import { NextResponse } from "next/server"
import { loginService } from "@/server/services/auth.service"

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

  const session = {
    id: user.id,
    email: user.email,
    role: user.role,
  }

  const res = NextResponse.json({ ok: true })

  res.cookies.set("mpp_session", JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })

  console.log("SESSION SET:", session)

  return res
}
