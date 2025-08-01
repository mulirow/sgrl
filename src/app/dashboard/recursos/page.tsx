import { PlusCircle } from "lucide-react"
import { getRecursosDoGestor, getLaboratoriosParaForm } from "./actions"

import { RecursosDataTable } from "@/components/tables/recursos-data-table"
import { RecursoSheet } from "@/components/shared/recurso-sheet"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default async function GerenciarRecursosPage() {
    const [recursos, laboratorios] = await Promise.all([
        getRecursosDoGestor(),
        getLaboratoriosParaForm()
    ])

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">Gerenciar Recursos</CardTitle>
                        <CardDescription>
                            Adicione, edite ou remova os espaços e equipamentos dos laboratórios.
                        </CardDescription>
                    </div>

                    <RecursoSheet laboratorios={laboratorios}>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Recurso
                        </Button>
                    </RecursoSheet>
                </CardHeader>
                <CardContent>
                    <RecursosDataTable data={recursos} laboratorios={laboratorios} />
                </CardContent>
            </Card>
        </div>
    )
}