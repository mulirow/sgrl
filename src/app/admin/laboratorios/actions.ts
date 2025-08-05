'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { Perfil, StatusReserva } from '@prisma/client'
import { LaboratorioSchema, type LaboratorioFormState } from '@/lib/validators'

export type UsersForForm = Awaited<ReturnType<typeof getAllUsers>>;

export async function getLaboratorios() {
    const session = await auth()
    if (session?.user?.perfil !== Perfil.ADMIN) { throw new Error("Acesso negado") }
    return prisma.laboratorio.findMany({
        select: {
            id: true,
            nome: true,
            descricao: true,
            centroAcademico: true,
            criadoEm: true,
            atualizadoEm: true,
            _count: { select: { recursos: true } },
            gerenteIds: true,
            membroIds: true,
        },
        orderBy: { nome: 'asc' },
    })
}

export async function upsertLaboratorio(
    prevState: LaboratorioFormState,
    formData: FormData
): Promise<LaboratorioFormState> {
    const session = await auth();
    if (session?.user?.perfil !== Perfil.ADMIN) {
        return { success: false, message: "Acesso negado: permissão de administrador necessária." };
    }

    const data = {
        id: formData.get('id')?.toString(),
        nome: formData.get('nome')?.toString(),
        descricao: formData.get('descricao')?.toString(),
        centroAcademico: formData.get('centroAcademico')?.toString(),
        gerenteIds: formData.getAll('gerenteIds') as string[],
        membroIds: formData.getAll('membroIds') as string[],
    };

    const validatedFields = LaboratorioSchema.safeParse(data);
    if (!validatedFields.success) {
        return { success: false, errors: validatedFields.error.issues, message: "Erro de validação." };
    }

    const { id, nome, ...labData } = validatedFields.data;

    try {
        if (id) {
            await prisma.laboratorio.update({ where: { id }, data: { nome, ...labData } });
        } else {
            await prisma.$transaction(async (tx) => {
                const novoLaboratorio = await tx.laboratorio.create({ data: { nome, ...labData } });

                await tx.recurso.create({
                    data: {
                        nome: "Espaço Inteiro",
                        descricao: `Reserva do espaço físico completo do ${nome}.`,
                        localizacao: `Instalações do ${nome}`,
                        isWholeLab: true,
                        laboratorioId: novoLaboratorio.id,
                        status: 'DISPONIVEL',
                    },
                });
            });
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "Erro no servidor ao salvar o laboratório." };
    }

    revalidatePath('/admin/laboratorios');
    return { success: true, message: `Laboratório ${id ? 'atualizado' : 'criado'} com sucesso!` };
}

export async function deleteLaboratorio(labId: string) {
    const session = await auth();
    if (session?.user?.perfil !== Perfil.ADMIN) {
        return { success: false, message: "Acesso negado." };
    }

    try {
        await prisma.$transaction(async (tx) => {
            const blockingReservaCount = await tx.reserva.count({
                where: {
                    recurso: { laboratorioId: labId },
                    OR: [
                        { status: StatusReserva.PENDENTE },
                        { status: { in: [StatusReserva.APROVADA, StatusReserva.EM_USO] }, fim: { gte: new Date() } }
                    ]
                }
            });

            if (blockingReservaCount > 0) {
                throw new Error("Não é possível excluir. Este laboratório possui reservas pendentes, ativas ou futuras.");
            }

            const recursosDoLab = await tx.recurso.findMany({
                where: { laboratorioId: labId },
                select: { id: true }
            });
            const recursoIds = recursosDoLab.map(r => r.id);

            if (recursoIds.length > 0) {
                await tx.bloqueio.deleteMany({
                    where: { recursoId: { in: recursoIds } }
                });

                await tx.reserva.deleteMany({
                    where: { recursoId: { in: recursoIds } }
                });
            }

            const laboratorioParaDeletar = await tx.laboratorio.findUnique({
                where: { id: labId },
                select: { membroIds: true, gerenteIds: true }
            });

            if (!laboratorioParaDeletar) throw new Error("Laboratório não encontrado.");

            const membros = await tx.user.findMany({ where: { id: { in: laboratorioParaDeletar.membroIds } } });
            const gerentes = await tx.user.findMany({ where: { id: { in: laboratorioParaDeletar.gerenteIds } } });

            const updateMembrosPromises = membros.map(membro =>
                tx.user.update({
                    where: { id: membro.id },
                    data: { laboratorioMembroIds: { set: membro.laboratorioMembroIds.filter(id => id !== labId) } }
                })
            );
            const updateGerentesPromises = gerentes.map(gerente =>
                tx.user.update({
                    where: { id: gerente.id },
                    data: { laboratorioGerenteIds: { set: gerente.laboratorioGerenteIds.filter(id => id !== labId) } }
                })
            );

            await Promise.all([...updateMembrosPromises, ...updateGerentesPromises]);

            await tx.laboratorio.delete({ where: { id: labId } });
        });

    } catch (error) {
        console.error("Erro ao excluir laboratório:", error);
        return { success: false, message: "Erro inesperado no servidor ao excluir o laboratório." };
    }

    revalidatePath('/admin/laboratorios');
    return { success: true, message: "Laboratório excluído com sucesso." };
}

export async function getAllUsers() {
    const session = await auth()
    if (session?.user?.perfil !== Perfil.ADMIN) { return [] }
    return prisma.user.findMany({
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' },
    });
}