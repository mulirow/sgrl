import { getReservasPendentesParaGestor } from "@/app/dashboard/reservas/actions"
import { columns, ReservaPendente } from "@/components/dashboard/manager-reservas-columns"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from 'lucide-react';

export default async function GerenciarReservasPage() {
    const result = await getReservasPendentesParaGestor();

    if (result.error) {
        return (
            <div className="container mx-auto py-10">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{result.error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    const data = result.data as ReservaPendente[];

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Gerenciar Reservas Pendentes</CardTitle>
                    <CardDescription>
                        Aprove ou rejeite as solicitações de reserva para os laboratórios que você gerencia.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} filterColumn="recursoNome" filterPlaceholder="Filtrar por recurso..." />
                </CardContent>
            </Card>
        </div>
    )
}