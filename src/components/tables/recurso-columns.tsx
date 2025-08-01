"use client"

import { useTransition } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Recurso, Laboratorio, StatusRecurso } from "@prisma/client"
import { toast } from "sonner"
import { MoreHorizontal, Trash2, Edit } from "lucide-react"

import { deleteRecurso, getLaboratoriosParaForm } from "@/app/dashboard/recursos/actions"
import { RecursoSheet } from "@/components/shared/recurso-sheet"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export type RecursoComLaboratorio = Recurso & {
    laboratorio: Pick<Laboratorio, "nome">
}

function CellActions({ recurso, laboratorios }: { recurso: RecursoComLaboratorio, laboratorios: Awaited<ReturnType<typeof getLaboratoriosParaForm>> }) {
    const [isPending, startTransition] = useTransition()
    const handleDelete = () => { startTransition(async () => { const result = await deleteRecurso(recurso.id); if (result.success) { toast.success(result.message) } else { toast.error(result.message) } }) }
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
                    <DropdownMenuSeparator />
                    <RecursoSheet recurso={recurso} laboratorios={laboratorios}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                    </RecursoSheet>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>Essa ação não pode ser desfeita. Isso excluirá permanentemente o recurso &quot;{recurso.nome}&quot; e todos os seus dados.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isPending}>{isPending ? "Excluindo..." : "Sim, excluir"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export const getColumns = (laboratorios: Awaited<ReturnType<typeof getLaboratoriosParaForm>>): ColumnDef<RecursoComLaboratorio>[] => [
    { accessorKey: "nome", header: "Nome" },
    { accessorKey: "tipo", header: "Tipo" },
    { accessorKey: "laboratorio.nome", header: "Laboratório" },
    {
        accessorKey: "status", header: "Status", cell: ({ row }) => {
            const status = row.getValue("status") as StatusRecurso;
            return <Badge variant={status === 'DISPONIVEL' ? 'success' : 'destructive'}>{status}</Badge>
        }
    },
    { id: "actions", cell: ({ row }) => <CellActions recurso={row.original} laboratorios={laboratorios} /> },
]