'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';
import { type User } from '@prisma/client';
import Link from 'next/link';
import { CircleUser, LogOut } from 'lucide-react';

interface UserMenuProps {
    user?: Pick<User, 'name' | 'image' | 'email'>;
}

export function UserMenu({ user }: UserMenuProps) {
    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.image ?? ''} alt={user?.name ?? ''} />
                        <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/perfil">
                            <CircleUser className="mr-2 h-4 w-4" />
                            <span>Perfil</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
}