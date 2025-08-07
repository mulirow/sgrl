import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { StatusReserva } from '@prisma/client';
import { z } from 'zod';

const QuerySchema = z.object({
    start: z.iso.datetime({ message: 'A data de início deve ser um ISO datetime string.' }),
    end: z.iso.datetime({ message: 'A data de fim deve ser um ISO datetime string.' }),
});

export async function GET(
    request: Request,
    context: { params: Promise<{ resourceId: string }> }
) {
    const { resourceId } = await context.params;
    const { searchParams } = new URL(request.url);

    const validation = QuerySchema.safeParse({
        start: searchParams.get('start'),
        end: searchParams.get('end'),
    });

    if (!validation.success) {
        return NextResponse.json({ error: 'Parâmetros de data inválidos.', details: validation.error.flatten() }, { status: 400 });
    }

    const { start, end } = validation.data;
    const startDate = new Date(start);
    const endDate = new Date(end);

    try {
        const reservas = await prisma.reserva.findMany({
            where: {
                recursoId: resourceId,
                status: {
                    in: [StatusReserva.APROVADA, StatusReserva.PENDENTE, StatusReserva.EM_USO],
                },
                OR: [
                    { inicio: { lte: endDate }, fim: { gte: startDate } },
                ],
            },
            select: {
                id: true,
                inicio: true,
                fim: true,
                status: true,
                justificativa: true,
            },
        });

        const bloqueios = await prisma.bloqueio.findMany({
            where: {
                recursoId: resourceId,
                OR: [
                    { inicio: { lte: endDate }, fim: { gte: startDate } },
                ],
            },
        });

        const events = [
            ...reservas.map(r => ({
                id: `reserva-${r.id}`,
                title: r.justificativa || `Reserva (${r.status.toLowerCase()})`,
                start: r.inicio.toISOString(),
                end: r.fim.toISOString(),
                type: 'RESERVA',
                status: r.status,
            })),
            ...bloqueios.map(b => ({
                id: `bloqueio-${b.id}`,
                title: `Bloqueado: ${b.motivo}`,
                start: b.inicio.toISOString(),
                end: b.fim.toISOString(),
                type: 'BLOQUEIO',
                status: 'BLOQUEADO',
            })),
        ];

        return NextResponse.json(events);

    } catch (error) {
        console.error("Erro ao buscar eventos do recurso:", error);
        return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
    }
}

export type CalendarEvent = {
    id: string;
    title: string;
    start: string;
    end: string;
    type: 'RESERVA' | 'BLOQUEIO';
    status: StatusReserva | 'BLOQUEADO';
};