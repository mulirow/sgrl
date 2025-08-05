import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { UnifiedBookingForm } from '@/components/forms/UnifiedBookingForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { redirect } from 'next/navigation';

export default async function NovaReservaPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const todosOsLaboratorios = await prisma.laboratorio.findMany({
        select: {
            id: true,
            nome: true,
        },
        orderBy: { nome: 'asc' }
    });

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Solicitar Nova Reserva</CardTitle>
                    <CardDescription>
                        Selecione o laboratório e o recurso que deseja usar. Sua solicitação ficará pendente até a aprovação de um gestor.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UnifiedBookingForm laboratorios={todosOsLaboratorios} />
                </CardContent>
            </Card>
        </div>
    );
}