import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.json();

  try {
    const updatedLab = await prisma.laboratorio.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updatedLab, { status: 200 });
  } catch (error) {
    console.error("Error updating lab:", error);
    return NextResponse.json(
      { error: "Lab not found or update failed." },
      { status: 404 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    await prisma.laboratorio.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting lab:", error);
    return NextResponse.json(
      { error: "Lab not found or delete failed." },
      { status: 404 }
    );
  }
}
