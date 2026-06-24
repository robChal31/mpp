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
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-white/70 rounded-2xl">
      <div className="text-center max-w-md">
        {/* Decorative blur */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#3279FF]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFB347]/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-linear-to-br from-[#3279FF]/10 to-[#FFB347]/10 rounded-full flex items-center justify-center mb-6 border border-[#3279FF]/20">
            <CalendarX size={40} className="text-[#3279FF]" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {t('title')}
          </h1>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
            {t('description')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/events">
              <Button className="bg-[#3279FF] hover:bg-[#2b66d9] text-white gap-2 rounded-xl px-6 py-2.5 shadow-lg shadow-[#3279FF]/20 hover:shadow-xl transition-all duration-300">
                <ArrowLeft size={16} />
                {t('backToEvents')}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2 rounded-xl px-6 py-2.5 border-[#3279FF]/20 text-[#3279FF] hover:bg-[#3279FF]/5 transition-all duration-300">
                <Home size={16} />
                {t('goToDashboard')}
              </Button>
            </Link>
          </div>
          
          {/* Decorative dots */}
          <div className="absolute -top-4 -right-4 w-2 h-2 rounded-full bg-[#FFB347]/30" />
          <div className="absolute -bottom-4 -left-4 w-3 h-3 rounded-full bg-[#3279FF]/20" />
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