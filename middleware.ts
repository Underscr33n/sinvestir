import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/embed"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  const auth = request.cookies.get("si_auth")?.value;
  if (!auth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo-|.*\\.svg$|.*\\.png$).*)"],
};
