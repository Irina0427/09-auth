import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { checkSession } from './lib/api/serverApi';
import { parse } from 'cookie';

const PRIVATE_PREFIXES = ['/notes', '/profile'];
const AUTH_PAGES = ['/sign-in', '/sign-up'];

function isPrivatePath(pathname: string) {
  return PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
}

function isAuthPath(pathname: string) {
  return AUTH_PAGES.some((p) => pathname.startsWith(p));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap')
  ) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  let isAuthenticated = Boolean(accessToken);
  let response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const sessionRes = await checkSession();
      const success = sessionRes.data?.success;
      isAuthenticated = Boolean(success);

  
      const setCookie = sessionRes.headers['set-cookie'];
      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const name = Object.keys(parsed)[0];
          const value = parsed[name];
          if (!value) continue;

          response.cookies.set(name, value, {
            path: parsed.Path,
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
          });
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

 
  if (!isAuthenticated && isPrivatePath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }


  if (isAuthenticated && isAuthPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/profile';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
