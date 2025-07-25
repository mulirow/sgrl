"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type Lab = {
    id: string
    nome: string
    descricao: string
    centroAcademico: string
}
async function fetchLabs() {
    const res = await fetch("/api/labs", { next: { tags: ['labs'] } })
    if (!res.ok) {
        throw new Error("Failed to fetch labs")
    }
    return await res.json()
}

export default function Espacos(){
    const[labs, setLabs] = useState<Lab[]>([])
    const[loading, setLoading] = useState(true)

    useEffect(() => {
        const loadLabs = async () => {
            try {
                const data = await fetchLabs()
                setLabs(data)
            } catch (error) {
                console.error("Failed to fetch labs:", error)
            }finally{
                setLoading(false)
            }
        }
        loadLabs()
    }, [])

    return(
        <div className="p-6 space-y-6">
            <div>
            <h1 className="text-3xl font-bold tracking-tight">Espaços e ateliês</h1>
                <p className="text-muted-foreground">
                    Explore todos os espaços disponíveis no CAC/UFPE
                </p>
            </div>

            <Separator/>
            {loading ? (
                <p>
                    Carregando espaços...
                </p>
            ) : labs.length === 0?(
                <p>
                    Nenhum espaço encontrado!
                </p>
            ) : (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {labs.map((lab) => (
                        <Card key ={lab.id}>
                            <CardHeader>
                                <CardTitle>
                                    {lab.nome}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 ">
                                <p className="text-sm text-muted-foreground">{lab.descricao}</p>
                                <p className="text-sm text-muted-foreground italic ">Centro Acadêmico: {lab.centroAcademico.toUpperCase()}</p>

                            </CardContent>
                        </Card>
                    )
                    )
                    }
                </div>
            )

            }    
        </div>
    )

}
