'use client'

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Laboratorio } from "@prisma/client"
import { upsertLaboratorio, type UsersForForm } from "@/app/admin/laboratorios/actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select"

type LaboratorioFormProps = { laboratorio?: Laboratorio | null; users: UsersForForm; onSuccess: () => void; }
function SubmitButton({ isEditing }: { isEditing: boolean }) { const { pending } = useFormStatus(); return (<Button type="submit" disabled={pending} className="w-full">{pending ? "Salvando..." : (isEditing ? "Salvar Alterações" : "Criar Laboratório")}</Button>) }

export function LaboratorioForm({ laboratorio, users, onSuccess }: LaboratorioFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, dispatch] = useActionState(upsertLaboratorio, { success: false });
    const userOptions: MultiSelectOption[] = users.map(u => ({ label: u.name || u.email, value: u.id }));

    useEffect(() => {
        if (state.success) { toast.success(state.message); onSuccess(); }
        else if (state.message) { toast.error("Erro", { description: state.message }); }
    }, [state, onSuccess]);

    const isEditing = !!laboratorio;

    return (
        <form ref={formRef} action={dispatch} className="space-y-4">
            {isEditing && <input type="hidden" name="id" value={laboratorio.id} />}
            <div className="space-y-1"><Label htmlFor="nome">Nome do Laboratório</Label><Input id="nome" name="nome" defaultValue={laboratorio?.nome} required /></div>
            <div className="space-y-1"><Label htmlFor="centroAcademico">Centro Acadêmico</Label><Input id="centroAcademico" name="centroAcademico" defaultValue={laboratorio?.centroAcademico} required /></div>
            <div className="space-y-1"><Label htmlFor="descricao">Descrição</Label><Textarea id="descricao" name="descricao" defaultValue={laboratorio?.descricao} rows={3} required /></div>
            <div className="space-y-1"><Label>Gestores</Label><MultiSelect name="gerenteIds" options={userOptions} defaultValues={laboratorio?.gerenteIds} /></div>
            <div className="space-y-1"><Label>Membros</Label><MultiSelect name="membroIds" options={userOptions} defaultValues={laboratorio?.membroIds} /></div>
            <SubmitButton isEditing={isEditing} />
        </form>
    )
}