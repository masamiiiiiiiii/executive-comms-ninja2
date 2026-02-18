import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(req: NextRequest) {
    const basicAuth = req.headers.get('authorization');
    const user = process.env.BASIC_AUTH_USER;
    const pwd = process.env.BASIC_AUTH_PASSWORD;

    // Only enable if env vars are present
    if (!user || !pwd) {
        return NextResponse.next();
    }

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        const [u, p] = atob(authValue).split(':');

        if (u === user && p === pwd) {
            return NextResponse.next();
        }
    }

    return new NextResponse('Authentication Required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    });
}
