import { PlusCircle } from "lucide-react"
import { getLaboratorios, getAllUsers } from "./actions"
import { LaboratorioSheet } from "@/components/shared/laboratorio-sheet"
import { LaboratoriosDataTable } from "@/components/tables/laboratorios-data-table"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default async function GerenciarLaboratoriosPage() {
    const [laboratorios, users] = await Promise.all([
        getLaboratorios(),
        getAllUsers()
    ]);

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">Gerenciar Laboratórios</CardTitle>
                        <CardDescription>Crie, edite e gerencie os laboratórios e seus respectivos gestores.</CardDescription>
                    </div>
                    <LaboratorioSheet users={users}>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Laboratório</Button>
                    </LaboratorioSheet>
                </CardHeader>
                <CardContent>
                    <LaboratoriosDataTable data={laboratorios} users={users} />
                </CardContent>
            </Card>
        </div>
    )
}