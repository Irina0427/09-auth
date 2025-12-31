// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];
const AUTH_ROUTES = ["/profile", "/notes"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthOnly = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (!accessToken && isAuthOnly) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (accessToken && isPublic && pathname !== "/") {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}
