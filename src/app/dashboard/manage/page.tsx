"use client"

import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import React from "react"
import { Lab, columns } from "./columns"
import { DataTable } from "./data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlusCircle } from "lucide-react"
import { EditLabDialog } from "@/components/edit-lab-dialog"
import { ResourcesDialog } from "@/components/resources-dialog"

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

async function fetchLabs() {
    const res = await fetch("/api/labs", { next: { tags: ['labs'] } })
    if (!res.ok) {
        throw new Error("Failed to fetch labs")
    }
    return await res.json()
}

async function addLab(nome: string, descricao: string, centro_academico: string) {
    try {
        const res = await fetch("/api/labs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nome,
                descricao,
                centroAcademico: centro_academico
            }),
        })

        if (!res.ok) {
            throw new Error("Erro ao adicionar laboratório")
        }
        return await res.json()
    } catch (error) {
        console.error("Erro ao adicionar laboratório:", error)
        throw error
    }
}

export default function ResourcesManagement() {
    const [selectedCenter, setSelectedCenter] = React.useState("")
    const [labs, setLabs] = React.useState<Lab[]>([])
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [editingLab, setEditingLab] = React.useState<Lab | null>(null)
    const [resourcesDialogLab, setResourcesDialogLab] = React.useState<Lab | null>(null)
    const formRef = React.useRef<HTMLFormElement>(null)

    React.useEffect(() => {
        const loadLabs = async () => {
            try {
                const data = await fetchLabs()
                setLabs(data)
            } catch (error) {
                console.error("Failed to fetch labs:", error)
            }
        }
        loadLabs()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const form = formRef.current
        if (!form) return

        const formData = new FormData(form)
        const nome = formData.get("name")?.toString().trim() || ""
        const descricao = formData.get("description")?.toString().trim() || ""

        if (!nome || !descricao || !selectedCenter) {
            console.warn("Todos os campos são obrigatórios.")
            setIsSubmitting(false)
            return
        }

        try {
            await addLab(nome, descricao, selectedCenter)
            const updatedLabs = await fetchLabs()
            setLabs(updatedLabs)
            form.reset()
            setSelectedCenter("")
        } catch (error) {
            console.error("Error adding lab:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditClick = (lab: Lab) => {
        setEditingLab(lab)
    }

    const handleResourcesClick = (lab: Lab) => {
        setResourcesDialogLab(lab)
    }

    const refreshLabs = async () => {
        try {
            const updatedLabs = await fetchLabs()
            setLabs(updatedLabs)
        } catch (error) {
            console.error("Failed to refresh labs:", error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Laboratórios</h1>
                    <p className="text-muted-foreground">
                        Gerencie os laboratórios disponíveis no sistema
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Novo Laboratório
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[500px]">
                        <form ref={formRef} onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>Adicionar Laboratório</DialogTitle>
                                <DialogDescription>
                                    Preencha os detalhes do novo laboratório
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome do Laboratório</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Digite o nome do laboratório"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Descrição</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Descreva o propósito e equipamentos do laboratório"
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Centro Acadêmico</Label>
                                    <Combobox
                                        options={academic_centers}
                                        value={selectedCenter}
                                        onChange={setSelectedCenter}
                                        placeholder="Selecione o centro acadêmico"
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" type="button">
                                        Cancelar
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Adicionando..." : "Adicionar"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Laboratórios</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns(handleEditClick, refreshLabs, handleResourcesClick)}
                        data={labs}
                        onRowClick={handleResourcesClick}
                    />

                    {editingLab && (
                        <EditLabDialog
                            lab={editingLab}
                            open={!!editingLab}
                            onOpenChange={(open) => {
                                if (!open) setEditingLab(null)
                            }}
                            onLabUpdated={(updatedLab) => {
                                setLabs(labs.map(l => l.id === updatedLab.id ? updatedLab : l))
                                setEditingLab(null)
                            }}
                        />
                    )}

                    {resourcesDialogLab && (
                        <ResourcesDialog
                            open={!!resourcesDialogLab}
                            onOpenChange={(open) => {
                                if (!open) setResourcesDialogLab(null)
                            }}
                            id={resourcesDialogLab.id}
                            labName={resourcesDialogLab.nome}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}