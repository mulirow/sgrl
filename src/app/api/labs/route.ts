import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nome, descricao, centroAcademico } = body

  try {
    const lab = await prisma.laboratorio.create({
      data: {
        nome,
        descricao,
        centroAcademico
      }
    })

    return NextResponse.json(lab)
  } catch (error) {
    console.error("Erro ao criar laboratório:", error)
    return NextResponse.json(
      { error: "Erro ao criar laboratório" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const labs = await prisma.laboratorio.findMany()
    return NextResponse.json(labs)
  } catch (error) {
    console.error("Erro ao buscar laboratórios:", error)
    return NextResponse.json(
      { error: "Erro ao buscar laboratórios" },
      { status: 500 }
    )
  }
}

