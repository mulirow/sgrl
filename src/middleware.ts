import { auth } from '@/auth';
export default auth((req) => {
    if (!req.auth && req.nextUrl.pathname !== '/login') {
        const newUrl = new URL('/login', req.nextUrl.origin);
        return Response.redirect(newUrl);
    }

    if (req.auth && req.nextUrl.pathname === '/') {
        const newUrl = new URL('/dashboard', req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
});

export const config = {
    matcher: [
        '/',
        '/reservas/:path*',
        '/dashboard/:path*',
        '/perfil/:path*',
    ],
};