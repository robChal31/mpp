import { NextRequest, NextResponse } from 'next/server'
import { getEvent } from '@/server/services/hy/event.service'

export async function GET(request: NextRequest) {
  try {
    // GET request ambil params dari URL, bukan dari body
    const searchParams = request.nextUrl.searchParams
    const group = searchParams.get('type') ?? ''
    const subject = searchParams.get('subject') ?? ''
    const event_group = searchParams.get('event_group') ?? ''
    // Panggil service
    const events = await getEvent(group, subject, event_group)
    
    return NextResponse.json({
      status: 'success',
      data: events || []
    })
    
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Failed to fetch event' },
      { status: 500 }
    )
  }
}