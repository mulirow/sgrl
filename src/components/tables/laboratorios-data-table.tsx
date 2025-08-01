'use client'

import { getColumns, type LaboratorioComContagem } from "./laboratorio-columns"
import { DataTable } from "@/components/ui/data-table"
import { type UsersForForm } from "@/app/admin/laboratorios/actions"

interface LaboratoriosDataTableProps {
    data: LaboratorioComContagem[]
    users: UsersForForm
}

export function LaboratoriosDataTable({ data, users }: LaboratoriosDataTableProps) {
    const columns = getColumns(users)
    return <DataTable columns={columns} data={data} filterColumn="nome" filterPlaceholder="Filtrar por nome..." />
}