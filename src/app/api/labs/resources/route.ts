import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient()

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {

    const { id } = params

    const resources = await prisma.recurso.findMany({
        where: {
            laboratorioId: id
        }
    })

    return Response.json(resources)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const body = await req.json()
    const { id } = params

    const { nome, tipo, descricao, localizacao, regrasReserva } = body
    const newResource = await prisma.recurso.create({
        data: {
            nome,
            tipo,
            descricao,
            localizacao,
            regrasReserva,
            laboratorioId: id
        }
    })

    return Response.json(newResource)
}