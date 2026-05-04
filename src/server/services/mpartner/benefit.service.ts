import { BenefitDetailI, BenefitGroupV2, CheckBenefitByEventGroupResult, ClaimBenefitParams, ClaimBenefitResult, FlattenedBenefit, GetBenefitByIdResponse, PK, ReclaimBenefitParams, ReclaimBenefitResult, UsageHistory } from "@/types/benefit/benefit.type"

interface BenefitGroup {
  benefit_id: string
  benefit_detail: BenefitDetailI[]
  related_pks: PK[]
}

// Custom error class untuk API errors
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export async function fetchBenefits(email: string): Promise<BenefitGroupV2[]> {
  const phpUrl = `${process.env.NEXT_PUBLIC_MBS_API_URL}/get_benefits.php`
  const apiToken = process.env.NEXT_PUBLIC_MBS_API_TOKEN
  
  const response = await fetch(phpUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: apiToken,
      email: email
    })
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  const result = await response.json()
  
  if (result.status === 'error') {
    throw new Error(result.message)
  }
  
  return result.data.benefits
}

// server/services/mpartner/benefit.service.ts
export async function getBenefitById(id: string, email: string): Promise<GetBenefitByIdResponse | null> {
  try {
    const phpUrl = `${process.env.NEXT_PUBLIC_MBS_API_URL}/get_benefit_by_id.php`
    const apiToken = process.env.NEXT_PUBLIC_MBS_API_TOKEN
    
    const response = await fetch(phpUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: apiToken,
        benefit_id: id,
        email: email
      }),
      // Tambahin ini
      cache: 'no-store',
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    
    if (data.status === 'error') {
      console.error('API returned error:', data.message)
      return null
    }
    
    // Pastikan structure response sesuai
    if (!data.data || !data.data.benefit) {
      console.error('Invalid response structure:', data)
      return null
    }
    
    return data.data
  } catch (error) {
    console.error('Error fetching benefit:', error)
    return null
  }
}

// server/services/mpartner/benefit.service.ts
export async function getBenefitByEventGroup(benefitType: string, subject: string, email: string): Promise<CheckBenefitByEventGroupResult> {
  try {
    const phpUrl = `${process.env.NEXT_PUBLIC_MBS_API_URL}/check_benefit_by_event_group.php`
    const apiToken = process.env.NEXT_PUBLIC_MBS_API_TOKEN
    console.log(['phpUrl', phpUrl, 'apiToken', apiToken, 'benefitType', benefitType, 'subject', subject, 'email', email])
    const response = await fetch(phpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: apiToken,
        benefit_type: benefitType,
        email: email,
        subject: subject
      }),
      cache: 'no-store',
    })
    
    if (!response.ok) return null
    
    const data = await response.json()
    
    return data.data ?? null
  } catch (error) {
    console.error('Error checking benefit:', error)
    return null
  }
}

export async function claimBenefit(params: ClaimBenefitParams): Promise<ClaimBenefitResult | null> {
  try {
    const phpUrl = `${process.env.NEXT_PUBLIC_MBS_API_URL}/claim_benefit.php`
    const apiToken = process.env.NEXT_PUBLIC_MBS_API_TOKEN

    const response = await fetch(phpUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: apiToken,
        benefit_id: params.benefit_id,
        benefit_draft_id: params.benefit_draft_id,
        pk_id: params.pk_id,
        event_id: params.event_id,
        event_title: params.event_title,
        qty: params.qty,
        year: params.year,
        email: params.email,
        description: params.description
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Claim benefit error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()

    if (data.status === 'error') {
      console.error('API returned error:', data.message)
      return null
    }

    return {
      redeem_code: data.data.redeem_code,
      success: true
    }

  } catch (error) {
    console.error('Error claiming benefit:', error)
    return null
  }
}

export async function reclaimBenefit(params: ReclaimBenefitParams): Promise<ReclaimBenefitResult> {
  try {
    const phpUrl = `${process.env.NEXT_PUBLIC_MBS_API_URL}/reclaim_benefit.php`
    const apiToken = process.env.NEXT_PUBLIC_MBS_API_TOKEN

    const response = await fetch(phpUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: apiToken,
        history_id: params.history_id,
        old_event_id: params.old_event_id,
        new_event_id: params.new_event_id,
        qty: params.qty,
        benefit_id: params.benefit_id,
        benefit_draft_id: params.benefit_draft_id,
        pk_id: params.pk_id,
        email: params.email,
        usedQty: params.usedQty
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Reclaim benefit error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()

    if (data.status === 'error') {
      console.error('API returned error:', data.message)
      return data
    }

    return data

  } catch (error: any) {
    console.error('Error reclaiming benefit:', error)
    return error
  }
}