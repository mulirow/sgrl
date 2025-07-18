import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const id = (await params).id;
    const data = await request.json();

    const updatedLab = await prisma.laboratorio.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedLab);
  } catch (error) {
    console.error('Error updating lab:', error);
    return NextResponse.json(
      { error: 'Lab not found or update failed' },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const id = (await params).id;

    await prisma.laboratorio.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting lab:', error);
    return NextResponse.json(
      { error: 'Lab not found or delete failed' },
      { status: 404 }
    );
  }
}