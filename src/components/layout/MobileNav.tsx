'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Perfil } from '@prisma/client';
import { Menu, Boxes } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface MobileNavProps {
    userPerfil?: Perfil;
}

export function MobileNav({ userPerfil }: MobileNavProps) {
    const [open, setOpen] = useState(false);
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
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>

                <Link
                    href="/reservas"
                    className="flex items-center"
                    onClick={() => setOpen(false)}
                >
                    <Boxes className="mr-2 h-4 w-4" />
                    <span className="font-bold">SGRL</span>
                </Link>
                <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                    <div className="flex flex-col space-y-3">
                        {filteredLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "transition-colors hover:text-foreground",
                                    pathname === item.href ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}