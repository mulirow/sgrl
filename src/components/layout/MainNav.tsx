'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Perfil } from '@prisma/client';
import { cn } from '@/lib/utils';

interface MainNavProps {
    userPerfil?: Perfil;
}

export function MainNav({ userPerfil }: MainNavProps) {
    const pathname = usePathname();

    const navLinks = [
        { href: '/reservas', label: 'Minhas Reservas', roles: [Perfil.USUARIO, Perfil.GESTOR, Perfil.ADMIN] },
        { href: '/dashboard/reservas', label: 'Gerenciar Reservas', roles: [Perfil.GESTOR, Perfil.ADMIN] },
        { href: '/dashboard/recursos', label: 'Gerenciar Recursos', roles: [Perfil.GESTOR, Perfil.ADMIN] },
        { href: '/admin/laboratorios', label: 'Gerenciar Laboratórios', roles: [Perfil.ADMIN] },
    ];

    const filteredLinks = navLinks.filter(link =>
        link.roles.includes(userPerfil!)
    );

    return (
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {filteredLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                    )}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}