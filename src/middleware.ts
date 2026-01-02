import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Защита админки - требуем авторизацию через сессию
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get("authjs.session-token")?.value 
      || request.cookies.get("__Secure-authjs.session-token")?.value;
    
    if (!sessionToken) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
