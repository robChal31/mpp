import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/server/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()
    
    if (!token || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Token and password are required' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { status: 'error', message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }
    
    // Cari user dengan token valid
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date()
        },
        hasResetPasswordToken: true
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid or expired token' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Update user: set password, hapus token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        hasResetPasswordToken: false,
        resetPasswordToken: null,
        resetPasswordExpires: null
        // isActive TETAP true (tidak diubah)
      }
    })
    
    return NextResponse.json({
      status: 'success',
      message: 'Password set successfully. Please login.'
    })
    
  } catch (error) {
    console.error('Setup password error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}