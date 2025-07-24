import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    
    try {
        const resources = await prisma.recurso.findMany({
            where: {
                laboratorioId: id
            }
        });

        return NextResponse.json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        return NextResponse.json(
            { error: 'Failed to fetch resources' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const body = await request.json();
    
    const { nome, tipo, descricao, localizacao, regrasReserva } = body;
    
    try {
        const newResource = await prisma.recurso.create({
            data: {
                nome,
                tipo,
                descricao,
                localizacao,
                regrasReserva,
                laboratorioId: id
            }
        });

        return NextResponse.json(newResource);
    } catch (error) {
        console.error('Error creating resource:', error);
        return NextResponse.json(
            { error: 'Failed to create resource' },
            { status: 500 }
        );
    }
}
