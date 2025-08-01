'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { CreateReservaSchema, type CreateReservaState } from '@/lib/validators';

export async function createReserva(
    prevState: CreateReservaState,
    formData: FormData
): Promise<CreateReservaState> {
    const session = await auth();

    if (!session?.user?.id) {
        return { success: false, message: 'Erro de autenticação. Faça login novamente.' };
    }

    const validatedFields = CreateReservaSchema.safeParse({
        recursoId: formData.get('recursoId'),
        justificativa: formData.get('justificativa'),
        inicio: formData.get('inicio'),
        fim: formData.get('fim'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Erro de validação. Por favor, corrija os campos destacados.',
        };
    }

    const { recursoId, inicio, fim, justificativa } = validatedFields.data;
    const usuarioId = session.user.id;

    try {
        const conflictingBooking = await prisma.reserva.findFirst({
            where: {
                recursoId: recursoId,
                status: { in: ['APROVADA', 'PENDENTE', 'EM_USO'] },
                OR: [
                    { inicio: { lt: fim }, fim: { gt: inicio } },
                ],
            },
        });

        if (conflictingBooking) {
            return {
                success: false,
                errors: { geral: ["Este horário já está reservado ou pendente de aprovação."] },
                message: "Conflito de agendamento."
            };
        }

        await prisma.reserva.create({
            data: {
                recursoId,
                usuarioId,
                inicio,
                fim,
                justificativa,
                status: 'PENDENTE',
            },
        });

    } catch (error) {
        console.error("Erro ao criar reserva:", error);
        return { success: false, message: 'Erro no servidor. Não foi possível criar a reserva.' };
    }

    revalidatePath('/reservas');
    revalidatePath(`/recursos/${recursoId}`);

    return { success: true, message: 'Reserva solicitada com sucesso! Aguarde a aprovação.' };
}