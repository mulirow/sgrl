'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Perfil, StatusReserva } from '@prisma/client';

export async function getMinhasProximasReservas(limite: number = 3) {
    const session = await auth();
    if (!session?.user?.id) return [];

    return prisma.reserva.findMany({
        where: {
            usuarioId: session.user.id,
            status: StatusReserva.APROVADA,
            inicio: { gte: new Date() }
        },
        take: limite,
        orderBy: {
            inicio: 'asc',
        },
        include: {
            recurso: { select: { nome: true, laboratorio: { select: { nome: true } } } },
        },
    });
}

export async function getContagemReservasPendentes() {
    const session = await auth();
    if (!session?.user?.id || session.user.perfil === Perfil.USUARIO) {
        return 0;
    }

    const whereClause = session.user.perfil === Perfil.ADMIN
        ? {}
        : { recurso: { laboratorio: { gerenteIds: { has: session.user.id } } } };

    return prisma.reserva.count({
        where: {
            status: StatusReserva.PENDENTE,
            ...whereClause,
        }
    });
}