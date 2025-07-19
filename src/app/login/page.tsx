"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LogInIcon } from "lucide-react";

export default function LoginPage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <p>Verificando autenticação...</p>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <main className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">SGRL</CardTitle>
                        <CardDescription>
                            Sistema de Gerenciamento de Reservas de Laboratórios
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-center text-sm text-muted-foreground">
                                Use sua conta institucional @ufpe.br para continuar.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => signIn("google")}
                            >
                                <LogInIcon className="mr-2 h-4 w-4" />
                                Entrar com Google
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return null;
}