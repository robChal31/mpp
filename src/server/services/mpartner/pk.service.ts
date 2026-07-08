// server/services/mpartner/pk.service.ts
export interface RenewProgramResultI {
  success: boolean
  message: string
}

export async function renewProgram(params: { email: string; pk_id: string }): Promise<RenewProgramResultI | null> {
  try {
    const phpUrl = `${process.env.NEXT_PUBLIC_MBS_API_URL}/renew_program.php`
    const apiToken = process.env.NEXT_PUBLIC_MBS_API_TOKEN

    const response = await fetch(phpUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: apiToken,
        email: params.email,
        pk_id: params.pk_id
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Renew program error response:', errorText)
      return {
        success: false,
        message: `HTTP ${response.status}: ${errorText}`
      }
    }

    const data = await response.json()

    if (data.status === 'error') {
      console.error('API returned error:', data.message)
      return {
        success: false,
        message: data.message || 'Failed to renew program'
      }
    }

    // FE cuma butuh success & message
    return {
      success: true,
      message: data.message || 'Program renewed successfully'
    }

  } catch (error) {
    console.error('Error renewing program:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to renew program'
    }
  }
}