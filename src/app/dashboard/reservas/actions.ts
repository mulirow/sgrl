'use server'

import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Perfil, StatusReserva } from '@prisma/client';

export async function getReservasPendentesParaGestor() {
    noStore();
    const session = await auth();

    if (session?.user?.perfil !== Perfil.GESTOR && session?.user?.perfil !== Perfil.ADMIN) {
        return { error: "Acesso negado." };
    }

    const laboratoriosGerenciados = session.user.laboratorioGerenteIds;
    if (!laboratoriosGerenciados || laboratoriosGerenciados.length === 0) {
        return { data: [] };
    }

    try {
        const data = await prisma.reserva.findMany({
            where: {
                status: StatusReserva.PENDENTE,
                recurso: {
                    laboratorioId: {
                        in: laboratoriosGerenciados,
                    },
                },
            },
            include: {
                recurso: { select: { nome: true } },
                usuario: { select: { name: true, email: true } },
            },
            orderBy: { criadoEm: 'asc' },
        });
        return { data };
    } catch (error) {
        console.error("Database Error:", error);
        return { error: 'Falha ao buscar reservas pendentes.' };
    }
}

export async function updateReservaStatus(reservaId: string, status: StatusReserva) {
    noStore();
    const session = await auth();

    if (session?.user?.perfil !== Perfil.GESTOR && session?.user?.perfil !== Perfil.ADMIN) {
        return { success: false, message: "Acesso negado: permissão insuficiente." };
    }

    try {
        const reserva = await prisma.reserva.findUnique({
            where: { id: reservaId },
            include: { recurso: true },
        });

        if (!reserva) {
            return { success: false, message: "Reserva não encontrada." };
        }

        if (session.user.perfil === Perfil.GESTOR && !session.user.laboratorioGerenteIds.includes(reserva.recurso.laboratorioId)) {
            return { success: false, message: "Acesso negado: você não gerencia este recurso." };
        }

        await prisma.reserva.update({
            where: { id: reservaId },
            data: { status },
        });

        revalidatePath('/dashboard/reservas');
        revalidatePath('/reservas');
        return { success: true, message: `Reserva ${status === 'APROVADA' ? 'aprovada' : 'rejeitada'} com sucesso.` };

    } catch (error) {
        console.error("Update Error:", error);
        return { success: false, message: "Falha ao atualizar o status da reserva." };
    }
}