import { auth } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    if (!session?.user) {
        const loginUrl = new URL("/api/auth/signin", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/dashboard/manage")) {
        const userProfile = session.user.perfil;

        if (userProfile !== "GESTOR" && userProfile !== "ADMIN") {
            return NextResponse.redirect(new URL("/acesso-negado", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};