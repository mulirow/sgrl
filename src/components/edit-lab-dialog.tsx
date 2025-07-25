"use client"

import { Lab } from "@/app/dashboard/manage/columns"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Combobox } from "./ui/combobox"
import React from "react"

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

interface EditLabDialogProps {
  lab: Lab
  open: boolean
  onOpenChange: (open: boolean) => void
  onLabUpdated: (updatedLab: Lab) => void
}

export function EditLabDialog({ lab, open, onOpenChange, onLabUpdated }: EditLabDialogProps) {
  const [selectedCenter, setSelectedCenter] = React.useState("")

  const [formData, setFormData] = useState({
    nome: lab.nome,
    descricao: lab.descricao,
    centroAcademico: lab.centroAcademico
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/labs/${lab.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedLab = await response.json()
        onLabUpdated(updatedLab)
        onOpenChange(false)
      } else {
        console.error('Failed to update lab')
      }
    } catch (error) {
      console.error('Error updating lab:', error)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Laboratório</DialogTitle>
            <DialogDescription>
              Faça alterações no laboratório aqui. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descricao" className="text-right">
                Descrição
              </Label>
              <Input
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
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
            <Button type="submit">Salvar alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}