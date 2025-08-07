import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

import { ProfileDetails } from '@/components/perfil/ProfileDetails';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, ShieldCheck } from 'lucide-react';
import { Perfil } from '@prisma/client';

function getInitials(name: string | null | undefined): string {
    if (!name) return 'U';
    return name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default async function PerfilPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const userWithIds = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            perfil: true,
            laboratorioMembroIds: true,
            laboratorioGerenteIds: true,
        },
    });

    if (!userWithIds) {
        notFound();
    }

    const [laboratoriosMembro, laboratoriosGerente] = await Promise.all([
        prisma.laboratorio.findMany({
            where: { id: { in: userWithIds.laboratorioMembroIds } },
            select: { id: true, nome: true },
        }),
        prisma.laboratorio.findMany({
            where: { id: { in: userWithIds.laboratorioGerenteIds } },
            select: { id: true, nome: true },
        }),
    ]);

    const user = {
        ...userWithIds,
        laboratoriosMembro,
        laboratoriosGerente,
    };

    return (
        <div className="container mx-auto py-10 space-y-8">
            <header className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <Badge variant="secondary" className="mt-1 inline-flex items-center">
                        {user.perfil === Perfil.ADMIN && <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />}
                        {user.perfil === Perfil.GESTOR && <UserIcon className="mr-1.5 h-3.5 w-3.5" />}
                        {user.perfil}
                    </Badge>
                </div>
            </header>

            <main className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <ProfileDetails user={user} />
                </div>
                <aside className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Laboratórios que Gerencio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user.laboratoriosGerente.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {user.laboratoriosGerente.map(lab => (
                                        <Badge key={lab.id}>{lab.nome}</Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Você não gerencia nenhum laboratório.</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Laboratórios que sou Membro</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user.laboratoriosMembro.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {user.laboratoriosMembro.map(lab => (
                                        <Badge variant="outline" key={lab.id}>{lab.nome}</Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Você não é membro de nenhum laboratório.</p>
                            )}
                        </CardContent>
                    </Card>
                </aside>
            </main>
        </div>
    );
}