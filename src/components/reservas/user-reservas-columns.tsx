"use client"

import { ColumnDef } from "@tanstack/react-table"
import { StatusReserva, Prisma } from "@prisma/client"
import { useTransition } from "react"
import { toast } from "sonner"
import { MoreHorizontal, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { cancelarMinhaReserva } from "@/app/reservas/actions"

export type ReservaComRecurso = Prisma.ReservaGetPayload<{
    include: { recurso: { select: { nome: true, laboratorio: { select: { nome: true } } } } };
}>;

const statusVariantMap: Record<StatusReserva, "default" | "secondary" | "destructive" | "success"> = {
    PENDENTE: "default",
    APROVADA: "success",
    REJEITADA: "destructive",
    CANCELADA: "secondary",
    CONCLUIDA: "secondary",
    EM_USO: "default",
};

function CellActions({ reserva }: { reserva: ReservaComRecurso }) {
    const [isPending, startTransition] = useTransition();

    const handleCancel = () => {
        startTransition(async () => {
            const result = await cancelarMinhaReserva(reserva.id);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        });
    };

    const cancellableStatuses: StatusReserva[] = [
        StatusReserva.PENDENTE,
        StatusReserva.APROVADA,
        StatusReserva.EM_USO
    ];

    const hasEnded = new Date(reserva.fim) < new Date();
    const canBeCancelled = cancellableStatuses.includes(reserva.status) && (reserva.status === 'PENDENTE' || !hasEnded);

    if (!canBeCancelled) {
        return null;
    }

    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancelar Reserva
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Sua reserva para o recurso &quot;{reserva.recurso.nome}&quot; será permanentemente cancelada.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel} disabled={isPending}>
                        {isPending ? "Cancelando..." : "Sim, cancelar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export const columns: ColumnDef<ReservaComRecurso>[] = [
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
    {
        id: "actions",
        cell: ({ row }) => (
            <div className="text-right">
                <CellActions reserva={row.original} />
            </div>
        ),
    },
]