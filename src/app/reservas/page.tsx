import { getMinhasReservas } from "@/app/reservas/actions"
import { columns, ReservaComRecurso } from "@/components/reservas/user-reservas-columns"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function MinhasReservasPage() {
    const data = await getMinhasReservas() as ReservaComRecurso[];

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">Minhas Reservas</CardTitle>
                        <CardDescription>
                            Acompanhe o status e o histórico de suas solicitações.
                        </CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/reservas/nova">
                            <PlusCircle className="mr-2 h-4 w-4" /> Nova Reserva
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} filterColumn="recursoNome" filterPlaceholder="Filtrar por recurso..." />
                </CardContent>
            </Card>
        </div>
    )
}