'use client'

import { useState } from "react"
import { RecursoForm } from "@/components/forms/recurso-form"
import { Recurso } from "@prisma/client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

type RecursoSheetProps = {
    children: React.ReactNode
    recurso?: Recurso | null
    laboratorios: { id: string, nome: string }[]
}

export function RecursoSheet({ children, recurso, laboratorios }: RecursoSheetProps) {
    const [open, setOpen] = useState(false)
    const isEditing = !!recurso

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>{isEditing ? "Editar Recurso" : "Adicionar Novo Recurso"}</SheetTitle>
                    <SheetDescription>
                        {isEditing ? "Faça alterações no recurso existente." : "Preencha os detalhes para criar um novo recurso."}
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                    <RecursoForm
                        recurso={recurso}
                        laboratorios={laboratorios}
                        onSuccess={() => setOpen(false)} // Passa a função para fechar o sheet
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
}