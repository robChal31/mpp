import { EventByRedeemCodeI } from "@/types/benefit/benefit.type"
import { EventI } from "@/types/event/event.types"

export async function getEvent(group: string, subject: string, event_group: string): Promise<EventI[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_HADIRYUK_URL}/EventBenefit?type=${encodeURIComponent(group)}&subject=${encodeURIComponent(subject)}&event_group=${encodeURIComponent(event_group)}`
    console.log('Fetching eventasdsad:', url)
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      if (response.status === 404) return []
      throw new Error(`Failed to fetch event: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Return array of events, not just first one
    return data?.data || data?.events || []
  } catch (error) {
    console.error('Error fetching event:', error)
    return []
  }
}

export async function getEvents(page: number = 1, limit: number = 10, category: string = '', subject: string = '', city: string = '') {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HADIRYUK_URL}/EventBenefit?limit=${limit}&page=${page}&category=${category}&subject=${subject}&city=${city}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch vendor events")
  }

  return res.json()
}

// server/services/event.service.ts
export async function getEventById(id: string): Promise<EventI | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HADIRYUK_URL}/EventBenefit/detail/${id}`,
      { next: { revalidate: 60 } }
    )
    
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch event')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching event:', error)
    return null
  }
}

export async function getEventBySlug(slug: string): Promise<EventI | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HADIRYUK_URL}/event_by_url/${slug}`,
      { next: { revalidate: 60 } }
    )
    
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch event')
    }
    
    const data = await response.json()
    return data ? data.events[0] : null
  } catch (error) {
    console.error('Error fetching event:', error)
    return null
  }
}

export async function getEventDetailByRedeemCode(redeemcode: string): Promise<EventByRedeemCodeI | null> {
  try {
    const phpUrl = `${process.env.NEXT_PUBLIC_HADIRYUK_URL}/check_code`
    
    const response = await fetch(phpUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        redeemcode: redeemcode
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
    
    return data
  } catch (error) {
    console.error('Error fetching benefit:', error)
    return null
  }
}