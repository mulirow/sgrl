import { type User } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ProfileDetailsProps {
    user: Pick<User, 'name' | 'email'>;
}

export function ProfileDetails({ user }: ProfileDetailsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>
                    Estas informações são sincronizadas com sua conta universitária e não podem ser alteradas.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" value={user.name ?? 'Não informado'} disabled readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled readOnly />
                </div>
            </CardContent>
        </Card>
    );
}