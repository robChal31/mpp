import { jwtVerify, SignJWT } from "jose"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)
const SESSION_DURATION = 60 * 60 * 6 // 6 jam dalam detik
const REFRESH_THRESHOLD = 60 * 60 * 1 // Refresh jika sisa 1 jam atau kurang

// Daftar API routes yang public (ga perlu login)
const publicApiRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("mpp_session")?.value

  const isLoginPage = pathname === "/login"
  const isApiRoute = pathname.startsWith("/api")
  const isStaticFile = pathname.startsWith("/_next") || 
                       pathname.startsWith("/favicon.ico") ||
                       pathname.includes(".")

  // Cek apakah API route public
  const isPublicApiRoute = publicApiRoutes.some(route => pathname === route || pathname.startsWith(route))

  // Bypass untuk static files
  if (isStaticFile) {
    return NextResponse.next()
  }

  // Untuk API routes
  if (isApiRoute) {
    // Jika public API route, langsung lanjut
    if (isPublicApiRoute) {
      return NextResponse.next()
    }
    
    // Jika tidak ada token untuk protected API route
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Verifikasi token untuk protected API route
    try {
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired token' },
        { status: 401 }
      )
    }
  }

  // Handle non-API routes (halaman web)
  const redirectToLogin = () => {
    const loginUrl = new URL("/login", req.url)
    if (pathname !== "/login") {
      loginUrl.searchParams.set("redirect", pathname)
    }
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete("mpp_session")
    return response
  }

  // Jika tidak ada token
  if (!token) {
    if (isLoginPage) return NextResponse.next()
    return redirectToLogin()
  }

  // Verifikasi token untuk halaman web
  try {
    const { payload } = await jwtVerify(token, secret)
    
    // Cek sisa waktu token untuk sliding session
    const exp = payload.exp as number
    const now = Math.floor(Date.now() / 1000)
    const timeLeft = exp - now
    
    // Jika token akan expired dalam threshold
    if (timeLeft < REFRESH_THRESHOLD && timeLeft > 0) {
      // Generate token baru
      const newToken = await new SignJWT({
        id: payload.id,
        role: payload.role,
        email: payload.email
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(`${SESSION_DURATION}s`)
        .sign(secret)
      
      const response = NextResponse.next()
      response.cookies.set("mpp_session", newToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_DURATION,
      })
      
      if (isLoginPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      
      return response
    }
    
    // Token masih valid
    if (isLoginPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    
    return NextResponse.next()
  } catch (error) {
    console.error("Token error:", error)
    return redirectToLogin()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}