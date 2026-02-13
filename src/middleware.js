import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

const protectedRoutes = ["/feed", "/profile", "/settings"];
const adminRoutes = ["/users", "/admin"];
const publicRoutes = ["/login", "/register", "/verify", "/"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  
  const isPublicFile = path.includes(".") || path.startsWith("/_next");
  if (isPublicFile) {
    return NextResponse.next();
  }

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // A. Kullanıcı giriş yapmamışsa ama korumalı bir yere girmeye çalışıyorsa -> Login'e at
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));

  if ((isProtectedRoute || isAdminRoute) && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // B. Giriş yapmış kullanıcı tekrar login/register sayfasına girmesin -> Feed'e at
  if (publicRoutes.includes(path) && session?.userId && path !== "/") {
    return NextResponse.redirect(new URL("/feed", req.nextUrl));
  }

  // C. Normal kullanıcı (GRADUATE) Admin sayfasına girmeye çalışıyorsa -> Feed'e geri yolla
  if (isAdminRoute && session?.role !== "ADMIN" && session?.role !== "SUPER_ADMIN") {
     return NextResponse.redirect(new URL("/feed", req.nextUrl));
  }

  return NextResponse.next();
}

// Middleware'in hangi sayfalarda çalışacağını belirten ayar
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};