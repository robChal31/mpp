// app/events/[id]/page.tsx
import { getCurrentUser } from '@/lib/auth'
import EventDetailClient from './component/event-detail-client'
import { getEventBySlug } from '@/server/services/hy/event.service';
import { getBenefitByEventGroup } from '@/server/services/mpartner/benefit.service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarX, Home, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

interface EventDetailPageProps {
  params: {
    slug: string
  }
}

async function EventNotFound() {
  const t = await getTranslations('EventNotFound')
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="relative max-w-md text-center">
        {/* Decorative blur */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
        </div>
        
        <div className="relative">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-primary/20 bg-linear-to-br from-primary/10 to-secondary/10">
            <CalendarX size={40} className="text-primary" />
          </div>
          
          <h1 className="mb-3 text-2xl font-bold text-foreground">
            {t('title')}
          </h1>
          
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
            {t('description')}
          </p>
          
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/events">
              <Button className="btn-primary gap-2 rounded-xl px-6 py-2.5 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl">
                <ArrowLeft size={16} />
                {t('backToEvents')}
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="btn-outline gap-2 rounded-xl border-primary/20 px-6 py-2.5 transition-all duration-300 hover:bg-primary/5">
                <Home size={16} />
                {t('goToDashboard')}
              </Button>
            </Link>
          </div>
          
          {/* Decorative dots */}
          <div className="absolute -right-4 -top-4 h-2 w-2 rounded-full bg-secondary/30" />
          <div className="absolute -bottom-4 -left-4 h-3 w-3 rounded-full bg-primary/20" />
        </div>
      </div>
    </div>
  )
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  try {
    const resolvedParams = await params;
    const event = await getEventBySlug(resolvedParams.slug)

    if (!event) {
      return <EventNotFound />
    }
    
    const user = await getCurrentUser()
    const hasBenefit = user?.email 
      ? await getBenefitByEventGroup(event.benefit_type, event.subject, event.event_group, user.email)
      : null
      
    return <EventDetailClient event={event} hasBenefit={hasBenefit} />
  } catch (error) {
    console.error('Error fetching event:', error)
    return <EventNotFound />
  }
}