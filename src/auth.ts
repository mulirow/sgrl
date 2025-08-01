import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';

import prisma from '@/lib/prisma';
import type { User } from '@prisma/client';
import type { NextAuthConfig } from 'next-auth';

import { Perfil } from '@prisma/client';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            perfil: Perfil;
        } & User;
    }
}

declare module '@auth/core/jwt' {
    interface JWT {
        perfil: Perfil;
    }
}

export const authConfig = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: { params: { prompt: "consent" } },
        }),
    ],
    callbacks: {
        async signIn({ profile }) {
            if (!profile?.email) {
                throw new Error('No profile email found');
            }

            if (profile.email.endsWith('@ufpe.br')) {
                return true;
            } else {
                return '/login?error=InvalidDomain';
            }
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
                if (dbUser) {
                    token.perfil = dbUser.perfil;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.perfil = token.perfil;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;

export const { handlers: {GET, POST}, auth, signIn, signOut } = NextAuth(authConfig);
