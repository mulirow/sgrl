import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string, resourceId: string }> }
) {
    const { resourceId } = await params;
    const body = await request.json();
    
    const { nome, tipo, descricao, localizacao, regrasReserva } = body;
    
    try {
        const updatedResource = await prisma.recurso.update({
            where: {
                id: resourceId
            },
            data: {
                nome,
                tipo,
                descricao,
                localizacao,
                regrasReserva
            }
        });

        return NextResponse.json(updatedResource);
    } catch (error) {
        console.error('Error updating resource:', error);
        return NextResponse.json(
            { error: 'Failed to update resource' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string, resourceId: string }> }
) {
    const { resourceId } = await params;

    try {
        await prisma.recurso.delete({
            where: {
                id: resourceId
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting resource:', error);
        return NextResponse.json(
            { error: 'Failed to delete resource' },
            { status: 500 }
        );
    }
}
