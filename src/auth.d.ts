import type { Perfil } from "@prisma/client";
import type { DefaultSession, User as DefaultUser } from "next-auth";

declare module "next-auth" {
    interface User extends DefaultUser {
        perfil: Perfil;
    }

    interface Session {
        user: {
            id: string;
            perfil: Perfil;
        } & DefaultSession["user"];
    }
}