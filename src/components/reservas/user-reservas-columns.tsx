"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Reserva, Recurso, StatusReserva } from "@prisma/client"

export type ReservaComRecurso = Reserva & {
    recurso: Pick<Recurso, 'nome'>
}

const statusVariantMap: Record<StatusReserva, "default" | "secondary" | "destructive" | "success"> = {
    PENDENTE: "default",
    APROVADA: "success",
    REJEITADA: "destructive",
    CANCELADA: "secondary",
    CONCLUIDA: "secondary",
    EM_USO: "default",
};

export const columns: ColumnDef<ReservaComRecurso>[] = [
    {
        id: "recursoNome",
        accessorFn: row => row.recurso.nome,
        header: "Recurso",
      },
    {
        accessorKey: "inicio",
        header: "Início",
        cell: ({ row }) => new Date(row.getValue("inicio")).toLocaleString('pt-BR'),
    },
    {
        accessorKey: "fim",
        header: "Fim",
        cell: ({ row }) => new Date(row.getValue("fim")).toLocaleString('pt-BR'),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as StatusReserva;
            return (
                <Badge variant={statusVariantMap[status] || "default"}>
                    {status.replace("_", " ")}
                </Badge>
            );
        },
    },
]