import { prisma } from '@/server/db/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Token is required' },
        { status: 400 }
      )
    }
    
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date()
        },
        hasResetPasswordToken: true
        // GA PERLU cek isActive
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid or expired token' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Token is valid',
      data: { email: user.email }
    })
    
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}