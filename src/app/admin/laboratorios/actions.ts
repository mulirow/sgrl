'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { Perfil } from '@prisma/client'
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
    const session = await auth()
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

    const { id, ...labData } = validatedFields.data;

    try {
        if (id) {
            await prisma.laboratorio.update({ where: { id }, data: labData });
        } else {
            await prisma.laboratorio.create({ data: labData });
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "Erro no servidor ao salvar o laboratório." };
    }

    revalidatePath('/admin/laboratorios');
    return { success: true, message: `Laboratório ${id ? 'atualizado' : 'criado'} com sucesso!` };
}

export async function deleteLaboratorio(labId: string) {
    const session = await auth()
    if (session?.user?.perfil !== Perfil.ADMIN) {
        return { success: false, message: "Acesso negado." };
    }

    try {
        const recursoCount = await prisma.recurso.count({ where: { laboratorioId: labId } });
        if (recursoCount > 0) {
            return { success: false, message: "Não é possível excluir. Este laboratório possui recursos associados." };
        }
        await prisma.laboratorio.delete({ where: { id: labId } });
    } catch (error) {
        console.error(error);
        return { success: false, message: "Erro no servidor ao excluir o laboratório." };
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