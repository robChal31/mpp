import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { fetchPKDocuments } from '@/server/services/mpartner/benefit.service'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const documents = user?.email ? await fetchPKDocuments(user.email) : []

    return NextResponse.json({
      status: 'success',
      data: { documents }
    })
    
  } catch (error) {
    console.error('Error fetching PK Document:', error)
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Failed to fetch PK Document' },
      { status: 500 }
    )
  }
}