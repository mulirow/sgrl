'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { Perfil, Prisma, StatusReserva } from '@prisma/client'
import { RecursoSchema, type RecursoFormState } from '@/lib/validators'

export async function upsertRecurso(
    prevState: RecursoFormState,
    formData: FormData
): Promise<RecursoFormState> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "Acesso negado: você não está autenticado." };
    }

    if (session.user.perfil !== Perfil.GESTOR && session.user.perfil !== Perfil.ADMIN) {
        return { success: false, message: "Acesso negado: permissão insuficiente." };
    }

    const validatedFields = RecursoSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.issues,
            message: "Erro de validação. Por favor, corrija os campos.",
        };
    }
    const { id, laboratorioId, regrasReserva, ...data } = validatedFields.data;

    try {
        if (session.user.perfil === Perfil.GESTOR) {
            const userWithPermissions = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { laboratorioGerenteIds: true }
            });

            if (!userWithPermissions?.laboratorioGerenteIds.includes(laboratorioId)) {
                return { success: false, message: "Você não tem permissão para gerenciar recursos neste laboratório." };
            }
        }

        const dataPayload: Prisma.RecursoUncheckedUpdateInput = {
            ...data,
            laboratorioId,
        };

        if (regrasReserva && regrasReserva.trim()) {
            dataPayload.regrasReserva = { content: regrasReserva };
        } else {
            dataPayload.regrasReserva = null;
        }

        if (id) {
            await prisma.recurso.update({ where: { id }, data: dataPayload });
        } else {
            await prisma.recurso.create({ data: dataPayload as Prisma.RecursoUncheckedCreateInput });
        }
    } catch (error) {
        console.error("Erro no upsert do recurso:", error);
        return { success: false, message: "Erro no servidor. Não foi possível salvar o recurso." };
    }

    revalidatePath('/dashboard/recursos');
    return { success: true, message: `Recurso ${id ? 'atualizado' : 'criado'} com sucesso!` };
}

export async function deleteRecurso(recursoId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "Acesso negado: você não está autenticado." };
    }

    if (session.user.perfil !== Perfil.GESTOR && session.user.perfil !== Perfil.ADMIN) {
        return { success: false, message: "Acesso negado: permissão insuficiente." };
    }

    try {
        const recurso = await prisma.recurso.findUnique({ where: { id: recursoId } });
        if (!recurso) {
            return { success: false, message: "Recurso não encontrado." };
        }

        if (session.user.perfil === Perfil.GESTOR) {
            const userWithPermissions = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { laboratorioGerenteIds: true }
            });

            if (!userWithPermissions?.laboratorioGerenteIds.includes(recurso.laboratorioId)) {
                return { success: false, message: "Você não tem permissão para excluir este recurso." };
            }
        }

        const hasActiveReservations = await prisma.reserva.findFirst({
            where: {
                recursoId: recursoId,
                OR: [
                    { status: StatusReserva.PENDENTE },
                    {
                        status: { in: [StatusReserva.APROVADA, StatusReserva.EM_USO] },
                        fim: { gte: new Date() },
                    },
                ],
            },
        });

        if (hasActiveReservations) {
            return { success: false, message: "Não é possível excluir. Existem reservas pendentes, ativas ou futuras para este recurso." };
        }

        await prisma.recurso.delete({ where: { id: recursoId } });
    } catch (error) {
        console.error("Erro ao deletar recurso:", error);
        return { success: false, message: "Erro no servidor. Não foi possível excluir o recurso." };
    }

    revalidatePath('/dashboard/recursos');
    return { success: true, message: "Recurso excluído com sucesso." };
}

export async function getRecursosDoGestor() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Acesso negado: não autenticado.');
    }

    if (session.user.perfil !== Perfil.GESTOR && session.user.perfil !== Perfil.ADMIN) {
        throw new Error('Acesso negado: permissão insuficiente.');
    }

    if (session.user.perfil === Perfil.ADMIN) {
        return prisma.recurso.findMany({
            include: { laboratorio: { select: { nome: true } } },
            orderBy: { nome: 'asc' },
        });
    }

    const userWithPermissions = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { laboratorioGerenteIds: true }
    });

    if (!userWithPermissions || userWithPermissions.laboratorioGerenteIds.length === 0) {
        return [];
    }

    return prisma.recurso.findMany({
        where: { laboratorioId: { in: userWithPermissions.laboratorioGerenteIds } },
        include: { laboratorio: { select: { nome: true } } },
        orderBy: { nome: 'asc' },
    });
}

export async function getLaboratoriosParaForm() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Acesso negado: não autenticado');
    }

    if (session.user.perfil === Perfil.ADMIN) {
        return prisma.laboratorio.findMany({
            select: { id: true, nome: true },
            orderBy: { nome: 'asc' }
        });
    }

    const userWithPermissions = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { laboratorioGerenteIds: true }
    });

    if (!userWithPermissions || userWithPermissions.laboratorioGerenteIds.length === 0) {
        return [];
    }

    return prisma.laboratorio.findMany({
        where: { id: { in: userWithPermissions.laboratorioGerenteIds } },
        select: { id: true, nome: true },
        orderBy: { nome: 'asc' }
    });
}