import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(req: NextRequest) {
  const session = req.cookies.get("mpp_session")
  const { pathname } = req.nextUrl
  console.log(req.cookies.getAll())
  const isAuthPage = pathname.startsWith("/login")
  const isPublic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api")

  // belum login → semua halaman main diarahkan ke login
  if (!session && !isAuthPage && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // sudah login → tidak boleh balik ke login
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
}
