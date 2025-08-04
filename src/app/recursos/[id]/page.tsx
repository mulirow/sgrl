import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ResourceCalendar } from '@/components/recursos/ResourceCalendar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarPlus } from 'lucide-react';

interface DetalhesRecursoPageProps {
    params: Promise<{ id: string }>;
}

export default async function DetalhesRecursoPage({ params }: DetalhesRecursoPageProps) {
    const { id } = await params;

    const recurso = await prisma.recurso.findUnique({
        where: { id },
        include: {
            laboratorio: { select: { nome: true } }
        }
    });

    if (!recurso) {
        notFound();
    }

    const regras = recurso.regrasReserva as { content?: string };

    return (
        <div className="container mx-auto py-10 space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <Badge variant="secondary" className="mb-2">{recurso.laboratorio.nome}</Badge>
                            <CardTitle className="text-3xl">{recurso.nome}</CardTitle>
                            <CardDescription>{recurso.descricao}</CardDescription>
                        </div>
                        <Button asChild>
                            <Link href={`/reservas/nova?recursoId=${recurso.id}`}>
                                <CalendarPlus className="mr-2 h-4 w-4" />
                                Reservar este Recurso
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                {regras?.content && (
                    <CardContent>
                        <h3 className="font-semibold mb-2">Regras de Reserva:</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{regras.content}</p>
                    </CardContent>
                )}
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Agenda de Disponibilidade</CardTitle>
                    <CardDescription>
                        Selecione um dia no calendário para ver as reservas e bloqueios.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResourceCalendar resourceId={recurso.id} />
                </CardContent>
            </Card>
        </div>
    );
}