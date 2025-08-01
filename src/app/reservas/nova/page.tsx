import prisma from '@/lib/prisma';
import { BookingForm } from '@/components/forms/BookingForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default async function NovaReservaPage() {
    const recursos = await prisma.recurso.findMany({
        where: {
            status: 'DISPONIVEL'
        },
        select: {
            id: true,
            nome: true,
            laboratorio: {
                select: {
                    nome: true,
                }
            }
        }
    });

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Solicitar Nova Reserva</CardTitle>
                    <CardDescription>
                        Preencha os detalhes abaixo para solicitar o uso de um recurso. Sua reserva ficará pendente até ser aprovada por um gestor.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <BookingForm recursos={recursos} />
                </CardContent>
            </Card>
        </div>
    );
}