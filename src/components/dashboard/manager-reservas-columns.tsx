"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Prisma, StatusReserva } from "@prisma/client" // Importar Prisma
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { updateReservaStatus } from "@/app/dashboard/reservas/actions"
import { toast } from "sonner"
import { useTransition } from "react"

export type ReservaPendente = Prisma.ReservaGetPayload<{
    include: {
        recurso: { select: { nome: true, laboratorio: { select: { nome: true } } } },
        usuario: { select: { name: true, email: true } },
    }
}>;

function RowActions({ reserva }: { reserva: ReservaPendente }) {
    const [isPending, startTransition] = useTransition();

    const handleAction = (status: StatusReserva) => {
        startTransition(async () => {
            const result = await updateReservaStatus(reserva.id, status);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message || "Ocorreu um erro.");
            }
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                    <span className="sr-only">Abrir menu</span>
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <MoreHorizontal className="h-4 w-4" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem
                    className="text-green-600 focus:text-green-600"
                    onClick={() => handleAction(StatusReserva.APROVADA)}
                    disabled={isPending}
                >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprovar
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => handleAction(StatusReserva.REJEITADA)}
                    disabled={isPending}
                >
                    <XCircle className="mr-2 h-4 w-4" />
                    Rejeitar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const columns: ColumnDef<ReservaPendente>[] = [
    {
        id: "recursoNome",
        accessorFn: row => row.recurso.nome,
        header: "Recurso",
    },
    {
        accessorKey: "recurso.laboratorio.nome",
        header: "Laboratório",
    },
    {
        accessorKey: "usuario.name",
        header: "Usuário",
        cell: ({ row }) => {
            const usuario = row.original.usuario;
            return <div>{usuario.name || 'Nome não disponível'} <span className="text-muted-foreground text-xs">({usuario.email})</span></div>
        }
    },
    {
        accessorKey: "inicio",
        header: "Início",
        cell: ({ row }) => new Date(row.getValue("inicio")).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
    },
    {
        accessorKey: "fim",
        header: "Fim",
        cell: ({ row }) => new Date(row.getValue("fim")).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
    },
    {
        id: "actions",
        cell: ({ row }) => <RowActions reserva={row.original} />,
    },
]