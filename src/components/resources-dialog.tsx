"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "./ui/badge"
import { MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react"

type Resource = {
  id: string
  nome: string
  tipo: string
  descricao: string
  localizacao: string
  regrasReserva: string
}

type ResourceFormData = Omit<Resource, 'id'>

interface ResourcesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id: string
  labName: string
}

export function ResourcesDialog({ open, onOpenChange, id, labName }: ResourcesDialogProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [deletingResource, setDeletingResource] = useState<Resource | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchResources = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/labs/${id}/resources`)
      if (response.ok) {
        const data = await response.json()
        setResources(data)
      } else {
        console.error('Failed to fetch resources')
        setResources([])
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
      setResources([])
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (open && id) {
      fetchResources()
    }
  }, [open, id, fetchResources])

  const handleAddResource = async (formData: ResourceFormData) => {
    setSubmitting(true)
    try {
      const response = await fetch(`/api/labs/${id}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newResource = await response.json()
        setResources([...resources, newResource])
        setShowAddDialog(false)
      } else {
        console.error('Failed to add resource')
      }
    } catch (error) {
      console.error('Error adding resource:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditResource = async (formData: ResourceFormData) => {
    if (!editingResource) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/labs/${id}/resources/${editingResource.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedResource = await response.json()
        setResources(resources.map(r => r.id === updatedResource.id ? updatedResource : r))
        setShowEditDialog(false)
        setEditingResource(null)
      } else {
        console.error('Failed to update resource')
      }
    } catch (error) {
      console.error('Error updating resource:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteResource = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/labs/${id}/resources/${resourceId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setResources(resources.filter(r => r.id !== resourceId))
        setDeletingResource(null)
      } else {
        console.error('Failed to delete resource')
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
    }
  }

  const ResourceForm = ({
    onSubmit,
    initialData,
    title,
    description
  }: {
    onSubmit: (data: ResourceFormData) => void
    initialData?: Resource
    title: string
    description: string
  }) => {
    const [formData, setFormData] = useState<ResourceFormData>({
      nome: initialData?.nome || '',
      tipo: initialData?.tipo || '',
      descricao: initialData?.descricao || '',
      localizacao: initialData?.localizacao || '',
      regrasReserva: initialData?.regrasReserva || '',
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit(formData)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Recurso</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Digite o nome do recurso"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Input
              id="tipo"
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              placeholder="Ex: Computador, Microscópio, Equipamento"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva o recurso em detalhes"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="localizacao">Localização</Label>
            <Input
              id="localizacao"
              value={formData.localizacao}
              onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
              placeholder="Ex: Mesa 1, Bancada A, Sala 101"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="regrasReserva">Regras de Reserva</Label>
            <Textarea
              id="regrasReserva"
              value={formData.regrasReserva}
              onChange={(e) => setFormData({ ...formData, regrasReserva: e.target.value })}
              placeholder="Defina as regras para reserva deste recurso"
              rows={2}
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowAddDialog(false)
              setShowEditDialog(false)
              setEditingResource(null)
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Recursos do Laboratório</DialogTitle>
                <DialogDescription>
                  Recursos disponíveis no laboratório labName
                </DialogDescription>
              </div>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Recurso
              </Button>
            </div>
          </DialogHeader>

          <div className="overflow-auto">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex space-x-4 items-center">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-[120px]" />
                  </div>
                ))}
              </div>
            ) : resources.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Regras de Reserva</TableHead>
                    <TableHead className="w-[70px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">{resource.nome}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{resource.tipo}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{resource.descricao}</TableCell>
                      <TableCell>{resource.localizacao}</TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {resource.regrasReserva}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                              setEditingResource(resource)
                              setShowEditDialog(true)
                            }}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingResource(resource)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum recurso encontrado para este laboratório.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Recurso
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Resource Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <ResourceForm
            onSubmit={handleAddResource}
            title="Adicionar Recurso"
            description={`Adicione um novo recurso ao laboratório "${labName}"`}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Resource Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <ResourceForm
            onSubmit={handleEditResource}
            initialData={editingResource || undefined}
            title="Editar Recurso"
            description="Edite as informações do recurso"
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingResource}
        onOpenChange={(open: boolean) => !open && setDeletingResource(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta ação não pode ser desfeita. Isso excluirá permanentemente o recurso
          {deletingResource?.nome} e removerá seus dados de nossos servidores.
        </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => deletingResource && handleDeleteResource(deletingResource.id)}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Excluir
        </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
