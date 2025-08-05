import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { StatusRecurso } from '@prisma/client';

export type RecursoParaForm = {
  id: string;
  nome: string;
  isWholeLab: boolean;
};

export async function GET(
  request: Request,
  context: { params: Promise<{ labId: string }> }
) {
  try {
    const { labId } = await context.params;

    if (!labId) {
      return NextResponse.json({ error: 'ID do laboratório é obrigatório' }, { status: 400 });
    }

    const recursos = await prisma.recurso.findMany({
      where: {
        laboratorioId: labId,
        status: StatusRecurso.DISPONIVEL,
      },
      select: {
        id: true,
        nome: true,
        isWholeLab: true,
      },
      orderBy: [
        { isWholeLab: 'desc' },
        { nome: 'asc' }
      ],
    });

    return NextResponse.json(recursos);

  } catch (error) {
    console.error("Erro ao buscar recursos do laboratório:", error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}