import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthConfig } from "next-auth";

const authConfig = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async signIn({ profile }) {
      if (profile?.email?.endsWith("@ufpe.br")) {
        return true;
      }

      return false;
    },

    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.perfil = user.perfil;
        console.log("Passei ")
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

const { handlers } = NextAuth(authConfig);

export const { GET, POST } = handlers;