
import { ResetPasswordEmailResponse } from "@/types/email/email.type"

export async function sendEmailResetPassword(email: string, resetToken: string, userName: string): Promise<ResetPasswordEmailResponse> {
  try {
    const phpUrl = `${process.env.NEXT_PUBLIC_MBS_API_URL}/send_email_reset_password.php`
    const apiToken = process.env.NEXT_PUBLIC_MBS_API_TOKEN

    const response = await fetch(phpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: apiToken,
        email: email,
        userName: userName,
        resetToken: resetToken
      }),
      cache: 'no-store',
    })
    
    if (!response.ok) return { status: 'error', message: 'Failed to send email' }
    
    const data = await response.json()
    
    return data && data.status === 'success' ? { status: 'success', message: data.message } : { status: 'error', message: 'Failed to send email' }
  } catch (error) {
    return { status: 'error', message: error instanceof Error ? error.message : 'Failed to send email' }
  }
}