import { auth } from '@/auth';
import { getContagemReservasPendentes, getMinhasProximasReservas } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarCheck, CalendarPlus, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Perfil } from '@prisma/client';

export default async function DashboardPage() {
    const session = await auth();
    const [proximasReservas, contagemPendentes] = await Promise.all([
        getMinhasProximasReservas(),
        getContagemReservasPendentes(),
    ]);

    const isManagerOrAdmin = session?.user?.perfil === Perfil.GESTOR || session?.user?.perfil === Perfil.ADMIN;

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-2">
                Bem-vindo(a), {session?.user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground mb-8">
                Este é o seu painel central. Use-o para acompanhar suas reservas{isManagerOrAdmin && (" e gerenciar recursos")}.
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Ações Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        <Button asChild size="lg">
                            <Link href="/reservas/nova">
                                <CalendarPlus className="mr-2 h-5 w-5" />
                                Solicitar Nova Reserva
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/reservas">
                                <CalendarCheck className="mr-2 h-4 w-4" />
                                Ver Todas as Minhas Reservas
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Suas Próximas Reservas</CardTitle>
                        <CardDescription>Aqui estão seus próximos agendamentos aprovados.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {proximasReservas.length > 0 ? (
                            <ul className="space-y-4">
                                {proximasReservas.map(reserva => (
                                    <li key={reserva.id} className="flex items-center justify-between p-3 rounded-md border">
                                        <div>
                                            <p className="font-semibold">{reserva.recurso.nome}</p>
                                            <p className="text-sm text-muted-foreground">
                                                em <Badge variant="secondary">{reserva.recurso.laboratorio.nome}</Badge>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{format(reserva.inicio, 'PPP', { locale: ptBR })}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(reserva.inicio, 'HH:mm')} - {format(reserva.fim, 'HH:mm')}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-center text-muted-foreground py-8">Você não tem nenhuma reserva futura.</p>
                        )}
                    </CardContent>
                </Card>

                {isManagerOrAdmin && (
                    <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-secondary/50 border-primary/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Pendências de Gestão</CardTitle>
                                <CardDescription>Você tem {contagemPendentes} solicitações aguardando sua aprovação.</CardDescription>
                            </div>
                            <Button asChild>
                                <Link href="/dashboard/reservas">
                                    <CheckSquare className="mr-2 h-4 w-4" />
                                    Analisar Solicitações
                                </Link>
                            </Button>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
}