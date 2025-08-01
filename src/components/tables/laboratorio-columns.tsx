"use client"

import { useTransition } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Laboratorio } from "@prisma/client"
import { toast } from "sonner"
import { MoreHorizontal, Trash2, Edit, Users, Wrench } from "lucide-react"

import { deleteLaboratorio, type UsersForForm } from "@/app/admin/laboratorios/actions"
import { LaboratorioSheet } from "@/components/shared/laboratorio-sheet"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type LaboratorioComContagem = Omit<Laboratorio, 'gerenteIds' | 'membroIds'> & {
    _count: { recursos: number; };
    gerenteIds: string[];
    membroIds: string[];
}

function CellActions({ laboratorio, users }: { laboratorio: LaboratorioComContagem, users: UsersForForm }) {
    const [isPending, startTransition] = useTransition()
    const handleDelete = () => { startTransition(async () => { const result = await deleteLaboratorio(laboratorio.id); if (result.success) toast.success(result.message); else toast.error(result.message); }) }

    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Abrir menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <LaboratorioSheet laboratorio={laboratorio} users={users}><DropdownMenuItem onSelect={(e) => e.preventDefault()}><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem></LaboratorioSheet>
                    <AlertDialogTrigger asChild><DropdownMenuItem className="text-red-600 focus:text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem></AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Essa ação não pode ser desfeita. Isso excluirá permanentemente o laboratório &quot;{laboratorio.nome}&quot;.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDelete} disabled={isPending}>{isPending ? "Excluindo..." : "Sim, excluir"}</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export const getColumns = (users: UsersForForm): ColumnDef<LaboratorioComContagem>[] => [
    { accessorKey: "nome", header: "Nome" },
    { accessorKey: "centroAcademico", header: "Centro" },
    {
        header: "Contagem",
        cell: ({ row }) => (
            <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center" title="Recursos">
                    <Wrench className="mr-1.5 h-4 w-4 text-muted-foreground" />
                    {row.original._count.recursos}
                </span>
                <span className="flex items-center" title="Gestores">
                    <Users className="mr-1.5 h-4 w-4 text-muted-foreground" />
                    {row.original.gerenteIds.length}
                </span>
            </div>
        )
    },
    { id: "actions", cell: ({ row }) => <CellActions laboratorio={row.original} users={users} /> },
]