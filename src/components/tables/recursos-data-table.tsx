'use client'

import { getColumns, type RecursoComLaboratorio } from "./recurso-columns"
import { DataTable } from "@/components/ui/data-table"

interface RecursosDataTableProps {
    data: RecursoComLaboratorio[]
    laboratorios: { id: string; nome: string }[]
}

export function RecursosDataTable({ data, laboratorios }: RecursosDataTableProps) {
    const columns = getColumns(laboratorios)

    return (
        <DataTable
            columns={columns}
            data={data}
            filterColumn="nome"
            filterPlaceholder="Filtrar por nome do recurso..."
        />
    )
}