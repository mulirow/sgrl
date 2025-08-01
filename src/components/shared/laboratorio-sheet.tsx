'use client'

import { useState } from "react"
import { LaboratorioForm } from "@/components/forms/laboratorio-form"
import { Laboratorio } from "@prisma/client"
import { type UsersForForm } from "@/app/admin/laboratorios/actions"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

type LaboratorioSheetProps = { children: React.ReactNode; laboratorio?: Laboratorio | null; users: UsersForForm; }
export function LaboratorioSheet({ children, laboratorio, users }: LaboratorioSheetProps) {
    const [open, setOpen] = useState(false);
    const isEditing = !!laboratorio;
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>{isEditing ? "Editar Laboratório" : "Adicionar Novo Laboratório"}</SheetTitle>
                    <SheetDescription>{isEditing ? "Faça alterações no laboratório." : "Preencha os detalhes para criar um novo laboratório."}</SheetDescription>
                </SheetHeader>
                <div className="mt-4"><LaboratorioForm laboratorio={laboratorio} users={users} onSuccess={() => setOpen(false)} /></div>
            </SheetContent>
        </Sheet>
    )
}