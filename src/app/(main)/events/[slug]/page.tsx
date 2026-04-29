// app/events/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import EventDetailClient from './component/event-detail-client'
import { getEventBySlug } from '@/server/services/hy/event.service';
import { getBenefitByEventGroup } from '@/server/services/mpartner/benefit.service';

interface EventDetailPageProps {
  params: {
    slug: string
  }
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  try {
    const resolvedParams = await params;
    const event = await getEventBySlug(resolvedParams.slug)

    if (!event) {
      notFound()
    }
    
    // Ambil user yang login
    const user = await getCurrentUser()
    
    // Panggil service dengan email user (kalo ada)
    const hasBenefit = user?.email 
      ? await getBenefitByEventGroup(event.benefit_type, event.subject, user.email)
      : null
    return <EventDetailClient event={event} hasBenefit={hasBenefit} />
  } catch (error) {
    console.error('Error fetching event:', error)
    notFound()
  }
}