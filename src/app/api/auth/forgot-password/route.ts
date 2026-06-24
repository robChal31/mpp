import { NextRequest, NextResponse } from 'next/server'
import { sendEmailResetPassword } from '@/server/services/mpartner/email.service';
import { changeResetPasswordToken } from '@/server/services/auth.service';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()
        if(!email) return NextResponse.json({ status: 'error', message: 'Email is required' }, { status: 400 })
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { status: 'error', message: 'Invalid email format' },
                { status: 400 }
            )
        }
        const updateUserPasswordToken = await changeResetPasswordToken(email);
        let resetPassword;

        if (updateUserPasswordToken && updateUserPasswordToken.status === 'success' && updateUserPasswordToken.resetToken && updateUserPasswordToken.name) {
            resetPassword = await sendEmailResetPassword(email, updateUserPasswordToken.resetToken, updateUserPasswordToken.name);
        } else {
            resetPassword = { status: 'error', message: 'Failed to reset password' };
        }

        if (resetPassword.status === 'error') {
            return NextResponse.json({
                status: 'error',
                message: 'Failed to send email for password reset'
            })
        }

        return NextResponse.json({
            status: 'success',
            message: "Password reset link has been sent to your email"
        })
    
    } catch (error) {
        console.error('Error resetting password:', error)
        return NextResponse.json(
            { status: 'error', message: error instanceof Error ? error.message : 'Failed to reset password' },
            { status: 500 }
        )
    }
}