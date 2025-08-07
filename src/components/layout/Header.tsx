import { auth } from '@/auth';
import Link from 'next/link';
import { MainNav } from './MainNav';
import { UserMenu } from './UserMenu';
import { MobileNav } from './MobileNav';
import { ThemeToggle } from './ThemeToggle';
import { Boxes } from 'lucide-react';

export async function Header() {
    const session = await auth();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95">
            <div className="container flex h-16 items-center">
                <MobileNav userPerfil={session?.user?.perfil} />

                <div className="mr-4 hidden md:flex">
                    <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                        <Boxes className="h-6 w-6" />
                        <span className="font-bold">SGRL</span>
                    </Link>
                    <MainNav userPerfil={session?.user?.perfil} />
                </div>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    <ThemeToggle />
                    <UserMenu user={session?.user} />
                </div>
            </div>
        </header>
    );
}