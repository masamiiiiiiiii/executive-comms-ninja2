import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

let locales = ['en', 'ja'];
let defaultLocale = 'en';

export function middleware(req: NextRequest) {
    const basicAuth = req.headers.get('authorization');
    const user = process.env.BASIC_AUTH_USER;
    const pwd = process.env.BASIC_AUTH_PASSWORD;

    // --- Basic Auth Logic ---
    let isAuthenticated = true;
    if (user && pwd) {
        isAuthenticated = false;
        if (basicAuth) {
            const authValue = basicAuth.split(' ')[1];
            const [u, p] = atob(authValue).split(':');

            if (u === user && p === pwd) {
                isAuthenticated = true;
            }
        }
    }

    if (!isAuthenticated) {
        return new NextResponse('Authentication Required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"',
            },
        });
    }

    // --- i18n Rewrite Logic ---
    const { pathname } = req.nextUrl;
    
    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) {
        return NextResponse.next();
    }

    // If we get here, it means no locale was found. We rewrite to the default locale 'en'
    const url = req.nextUrl.clone();
    // E.g., /pricing -> /en/pricing
    url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
}
