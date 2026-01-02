
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession, createCookieHeaderFromTokens } from '@/lib/api/serverApi';

const PUBLIC_ROUTES = ['/sign-in', '/sign-up'];
const PRIVATE_ROUTES = ['/notes', '/profile'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isPrivate = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));

  if (!accessToken && refreshToken) {
    try {
      const headers = createCookieHeaderFromTokens({ refreshToken });
      const res = await checkSession(headers);
      const setCookie = res.headers['set-cookie'];

      if (setCookie) {
        const response = NextResponse.next();
        const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookie of cookiesArray) {
          response.headers.append('set-cookie', cookie);
        }

        return response;
      }
    } catch (e) {

    }
  }

  if (!accessToken && isPrivate) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (accessToken && isPublic) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\..*).*)'],
};
