/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { upsertRecurso } from "@/app/dashboard/recursos/actions"
import { Recurso, StatusRecurso } from "@prisma/client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type RecursoFormProps = {
    recurso?: Recurso | null
    laboratorios: { id: string, nome: string }[]
    onSuccess: () => void
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (isEditing ? "Salvando..." : "Criando...") : (isEditing ? "Salvar Alterações" : "Criar Recurso")}
        </Button>
    )
}

export function RecursoForm({ recurso, laboratorios, onSuccess }: RecursoFormProps) {
    const formRef = useRef<HTMLFormElement>(null)
    const [state, dispatch] = useActionState(upsertRecurso, { success: false })

    useEffect(() => {
        if (state.success) {
            toast.success(state.message)
            onSuccess()
        } else if (state.message) {
            toast.error("Erro", { description: state.message })
        }
    }, [state, onSuccess])

    const isEditing = !!recurso

    return (
        <form ref={formRef} action={dispatch} className="space-y-4">
            {isEditing && <input type="hidden" name="id" value={recurso.id} />}

            <div className="space-y-1">
                <Label htmlFor="nome">Nome do Recurso</Label>
                <Input id="nome" name="nome" defaultValue={recurso?.nome} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Input id="tipo" name="tipo" placeholder="Ex: Prensa, Sala, Computador" defaultValue={recurso?.tipo} required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="laboratorioId">Laboratório</Label>
                    <Select name="laboratorioId" defaultValue={recurso?.laboratorioId} required>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                            {laboratorios.map(lab => <SelectItem key={lab.id} value={lab.id}>{lab.nome}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-1">
                <Label htmlFor="localizacao">Localização</Label>
                <Input id="localizacao" name="localizacao" placeholder="Ex: Bancada 3, Sala 102" defaultValue={recurso?.localizacao} required />
            </div>

            <div className="space-y-1">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" name="descricao" defaultValue={recurso?.descricao} rows={3} />
            </div>

            <div className="space-y-1">
                <Label htmlFor="regrasReserva">Regras de Reserva</Label>
                <Textarea id="regrasReserva" name="regrasReserva" defaultValue={(recurso?.regrasReserva as any)?.content || ""} rows={3} placeholder="Ex: Uso máximo de 2 horas, necessário supervisão, etc." />
            </div>

            <div className="space-y-1">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={recurso?.status || StatusRecurso.DISPONIVEL} required>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                        {Object.values(StatusRecurso).map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <SubmitButton isEditing={isEditing} />
        </form>
    )
}