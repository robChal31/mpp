// app/api/mpartner/benefits/reclaim/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { reclaimBenefit } from '@/server/services/mpartner/benefit.service'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()
    const email = user?.email

    if (!email) {
      return NextResponse.json(
        { status: 'error', message: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await request.json()
    const {
      history_id,
      old_event_id,
      new_event_id,
      qty,
      benefit_id,
      benefit_draft_id,
      pk_id,
      usedQty
    } = body

    // Validasi required fields
    if (!history_id || !new_event_id || !qty || !benefit_id) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Missing required fields: history_id, new_event_id, qty, benefit_id' 
        },
        { status: 400 }
      )
    }

    if (qty < 1) {
      return NextResponse.json(
        { status: 'error', message: 'Quantity must be at least 1' },
        { status: 400 }
      )
    }

    // Panggil service untuk reclaim benefit
    const result = await reclaimBenefit({
      history_id,
      old_event_id,
      new_event_id,
      qty,
      benefit_id,
      benefit_draft_id,
      pk_id,
      email,
      usedQty
    })

    if (result && result.status === 'error') {
      console.log('result:', result)
      return NextResponse.json(
        { status: 'error', message: result.message || 'Failed to move benefit' },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json({
      status: 'success',
      message: 'Benefit moved successfully',
    })

  } catch (error) {
    console.error('Error in reclaim API:', error)
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}