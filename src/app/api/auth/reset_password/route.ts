import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { changePasswordService } from "@/server/services/auth.service"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function PUT(req: Request) {
  try {
    // 1. Ambil token dari cookie
    const cookieStore = await cookies()
    const token = cookieStore.get("mpp_session")?.value

    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Verifikasi token dan ambil user ID
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.id as number

    // 3. Ambil request body
    const { currentPassword, newPassword } = await req.json()

    // 4. Validasi input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { status: 'error', message: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { status: 'error', message: 'New password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // 5. Panggil service untuk change password
    await changePasswordService(userId, currentPassword, newPassword)

    return NextResponse.json({
      status: 'success',
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change password error:', error)
    
    const message = error instanceof Error ? error.message : 'Failed to change password'
    
    return NextResponse.json(
      { status: 'error', message },
      { status: 400 }
    )
  }
}