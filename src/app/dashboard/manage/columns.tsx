"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export type Lab = {
  id: string
  nome: string
  descricao: string
  centroAcademico: string
}

const academic_centers = [
  {
    value: "cac",
    label: "Centro de Artes e Comunicação",
  },
  {
    value: "cin",
    label: "Centro de Informática",
  },
  {
    value: "ccen",
    label: "Centro de Ciências Exatas e da Natureza",
  },
  {
    value: "ccsa",
    label: "Centro de Ciências Sociais Aplicadas",
  },
]

export const columns = (
  onEditClick: (lab: Lab) => void, 
  onDeleteSuccess?: () => void,
  onResourcesClick?: (lab: Lab) => void
): ColumnDef<Lab>[] => [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
  },
  {
    accessorKey: "centroAcademico",
    header: "Centro Acadêmico",
    cell: ({ row }) => {
      const centerValue = row.getValue("centroAcademico")
      const center = academic_centers.find(c => c.value === centerValue)
      return center ? center.label : centerValue
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lab = row.original

      const handleDelete = async (id: string) => {
        try {
          const response = await fetch(`/api/labs/${id}`, {
            method: 'DELETE'
          })

          if (!response.ok) {
            throw new Error('Failed to delete lab')
          }

          // Call the success callback to refresh the table
          if (onDeleteSuccess) {
            onDeleteSuccess()
          }
        } catch (error) {
          console.error('Error deleting lab:', error)
          // You might want to show a toast notification here
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEditClick(lab)}>
              Editar laboratório
            </DropdownMenuItem>
            {onResourcesClick && (
              <DropdownMenuItem onClick={() => onResourcesClick(lab)}>
                Ver recursos
              </DropdownMenuItem>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Excluir laboratório
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o laboratório
                    "{lab.nome}" e removerá seus dados de nossos servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(lab.id)}>
                    Continuar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]