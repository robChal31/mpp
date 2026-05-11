import { NextRequest, NextResponse } from 'next/server'
import { fetchBenefits } from '@/server/services/mpartner/benefit.service'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const benefits = user?.email ? await fetchBenefits(user.email) : [];
    return NextResponse.json({
      status: 'success',
      data: { benefits }
    })
    
  } catch (error) {
    console.error('Error fetching benefits:', error)
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Failed to fetch benefits' },
      { status: 500 }
    )
  }
}