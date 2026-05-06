import { prisma } from '@/server/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, resetToken, resetExpires } = body;

    if (!email || !name) {
      return NextResponse.json(
        { status: 'error', message: 'Email and name are required' },
        { status: 400 }
      );
    }

    if (!resetToken || !resetExpires) {
      return NextResponse.json(
        { status: 'error', message: 'Reset token and expiry are required' },
        { status: 400 }
      );
    }

    const expiresAt = new Date(resetExpires);
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // Update existing user (misal untuk resend email)
      await prisma.user.update({
        where: { email },
        data: {
          name: name,
          resetPasswordToken: resetToken,
          resetPasswordExpires: expiresAt,
          hasResetPasswordToken: true
          // isActive tetap true (tidak diubah)
        }
      });
    } else {
      // Create new user - LANGSUNG AKTIF
      await prisma.user.create({
        data: {
          email,
          name,
          resetPasswordToken: resetToken,
          resetPasswordExpires: expiresAt,
          hasResetPasswordToken: true,
          isActive: true,  // ← LANGSUNG AKTIF
          password: '',    // Password kosong dulu
          role: 'mp_user'
        }
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'User created/updated successfully'
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}