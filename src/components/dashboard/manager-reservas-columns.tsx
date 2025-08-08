"use client"

import { useState } from "react" // Importar useState
import { ColumnDef } from "@tanstack/react-table"
import { Prisma, StatusReserva } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Loader2, Calendar, User, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { updateReservaStatus } from "@/app/dashboard/reservas/actions"
import { toast } from "sonner"
import { useTransition } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export type ReservaPendente = Prisma.ReservaGetPayload<{
    select: {
        id: true, inicio: true, fim: true, status: true, justificativa: true,
        recurso: { select: { nome: true, laboratorio: { select: { nome: true } } } },
        usuario: { select: { name: true, email: true } },
    }
}>;

function RowActions({ reserva }: { reserva: ReservaPendente }) {
    const [isPending, startTransition] = useTransition();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAction = (status: StatusReserva) => {
        startTransition(async () => {
            const result = await updateReservaStatus(reserva.id, status);
            if (result.success) {
                toast.success(result.message);
                setIsDialogOpen(false);
            } else {
                toast.error(result.message || "Ocorreu um erro.");
            }
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            Detalhes
                        </DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Analisar Solicitação de Reserva</DialogTitle>
                    <DialogDescription>
                        Revise os detalhes abaixo e aprove ou rejeite a solicitação.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-start space-x-3">
                        <User className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">{reserva.usuario.name}</p>
                            <p className="text-sm text-muted-foreground">{reserva.usuario.email}</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">
                                {format(reserva.inicio, "dd/MM/yyyy 'das' HH:mm", { locale: ptBR })}
                                {' às '}
                                {format(reserva.fim, "HH:mm")}
                            </p>
                            <p className="text-sm text-muted-foreground">{reserva.recurso.nome} em {reserva.recurso.laboratorio.nome}</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">Justificativa</p>
                            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                {reserva.justificativa || "Nenhuma justificativa fornecida."}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="grid grid-cols-2 gap-2">
                    <Button variant="destructive" onClick={() => handleAction(StatusReserva.REJEITADA)} disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Rejeitar
                    </Button>
                    <Button variant="default" onClick={() => handleAction(StatusReserva.APROVADA)} disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Aprovar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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