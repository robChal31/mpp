import { NextResponse } from "next/server"
import { loginService } from "@/server/services/auth.service"
import { SignJWT } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    )
  }

  const user = await loginService(email, password)

  if (!user) {
    return NextResponse.json(
      { message: "Email or password incorrect" },
      { status: 401 }
    )
  }

  const token = await new SignJWT({
    id: user.id,
    role: user.role,
    email: user.email,
    name: user.name
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7h")
    .sign(secret)

  const res = NextResponse.json({ ok: true })

  res.cookies.set("mpp_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 360,
  })

  return res
}