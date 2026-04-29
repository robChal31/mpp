// app/api/mpartner/benefits/claim/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { claimBenefit } from '@/server/services/mpartner/benefit.service'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  const email = user?.email;
  try {
    // Ambil data dari request body
    const body = await request.json()
    const {
      benefit_id,
      benefit_draft_id,
      pk_id,
      event_id,
      event_title,
      qty,
      year,
      description
    } = body

    // Validasi required fields
    if(!email) {
      return NextResponse.json(
        { status: 'error', message: 'User not authenticated' },
        { status: 401 }
      )
    }
    if (!benefit_id || !benefit_draft_id || !pk_id || !event_id || !qty || !year) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Missing required fields: benefit_id, benefit_draft_id, pk_id, event_id, qty, year' 
        },
        { status: 400 }
      )
    }

    // Validasi qty harus positif
    if (qty < 1) {
      return NextResponse.json(
        { status: 'error', message: 'Quantity must be at least 1' },
        { status: 400 }
      )
    }

    // Panggil service untuk claim benefit
    const result = await claimBenefit({
      benefit_id,
      benefit_draft_id,
      pk_id,
      event_id,
      event_title,
      qty,
      year,
      email,
      description: description || `Claim for event: ${event_title}`
    })

    if (!result) {
      return NextResponse.json(
        { status: 'error', message: 'Failed to claim benefit' },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json({
      status: 'success',
      message: 'Benefit claimed successfully',
      data: {
        redeem_code: result.redeem_code,
        qty: qty,
        year: year
      }
    })

  } catch (error) {
    console.error('Error in claim API:', error)
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}