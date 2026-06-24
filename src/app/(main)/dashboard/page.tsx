// app/dashboard/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import SimpleEventsScroll from '@/components/event/simple-events-scroll'
import { HelpSection } from '@/components/dashboard/help-section'
import { useTranslations } from 'next-intl'
import OnboardingTour from '@/components/OnboardingTour'
import Link from 'next/link'
import { useMemo } from 'react'
import Hero from '@/components/dashboard/hero'
import QuickAction from '@/components/dashboard/quick-action'
import { AgreementRenewal } from '@/components/dashboard/agreement-renewal'

export default function DashboardPage() {
  const t = useTranslations('Dashboard')
  const steps = useMemo(() => [
    {
      target: "main",
      title: t('tour.welcome.title'),
      content: t('tour.welcome.content'),
      disableBeacon: false,
      placement: "center",
      spotlightPadding: 20,
    },
    {
      target: "#navbar-section",
      title: t('tour.navigation.title'),
      content: t('tour.navigation.content'),
      placement: "bottom",
    },
    {
      target: "#dashboard-featured-header",
      title: t('tour.featuredEventsHeader.title'),
      content: t('tour.featuredEventsHeader.content'),
      placement: "bottom",
    },
    {
      target: "#simple-events-scroll",
      title: t('tour.featuredEvents.title'),
      content: t('tour.featuredEvents.content'),
      placement: "top",
    },
    {
      target: "#dashboard-quick-actions",
      title: t('tour.quickActions.title'),
      content: t('tour.quickActions.content'),
      placement: "top",
    },
    {
      target: "#dashboard-help-section",
      title: t('tour.helpSection.title'),
      content: t('tour.helpSection.content'),
      placement: "top",
    },
  ], [t])
  
  return (
    <div className="space-y-6 max-[640px]:space-y-6">
      <OnboardingTour pageName='dashboard' steps={steps} />

      <Hero />
      <hr className='md:my-3 md:py-3 border-0'/>
      
      {/* Featured Events Section */}
      <div id="dashboard-featured-events" className="space-y-5 my-8">
        
        {/* Header Section - Responsive: row di desktop, column di mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Left side - Title & Description */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-linear-to-br from-[#3279FF]/10 to-[#FFB347]/10">
                <Sparkles className="text-[#3279FF]" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {t('featuredEvents')}
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-9">
              {t('featuredEventsDesc')}
            </p>
          </div>
          
          {/* Right side - View All Button (Desktop: tampil, Mobile: hidden) */}
          <div className="hidden sm:block">
            <Link href="/events">
              <Button 
                variant="outline" 
                className="cursor-pointer group gap-2 text-[#3279FF] hover:text-[#2b66d9] bg-white hover:bg-gray-50 rounded-full px-4 py-2 transition-all duration-300"
              >
                <span className="text-sm font-medium">{t('viewAllEvents')}</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Divider decorative */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100 dark:border-gray-800" />
          </div>
          <div className="relative flex justify-start">
            <div className="pr-3">
              <div className="w-16 h-0.5 bg-linear-to-r from-[#3279FF] to-[#FFB347] rounded-full" />
            </div>
          </div>
        </div>

        {/* Events Scroll Component */}
        <div id="simple-events-scroll" className="pt-2">
          <SimpleEventsScroll limit={9} />
        </div>
        
        {/* View All Button - Bawah (Mobile: tampil, Desktop: hidden) */}
        <div className="flex justify-center pt-4 sm:hidden">
          <Link href="/events">
              <Button 
                variant="outline" 
                className="cursor-pointer group gap-2 text-[#3279FF] hover:text-[#2b66d9] bg-white hover:bg-gray-50 rounded-full px-4 py-2 transition-all duration-300"
              >
              <span className="text-sm font-medium">{t('viewAllEvents')}</span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
      </div>
      <hr className='md:my-3 md:py-3 border-0'/>

      {/* Quick Actions Section - Compact Bold Version */}
      <QuickAction />
      <hr className='md:my-1 md:py-1 my-0 py-0 border-0'/>

      {/* <div id="dashboard-agreement-renewal" className="mb-6">
        <AgreementRenewal />
      </div> */}

      {/* Help Section */}
      <div id="dashboard-help-section">
        <HelpSection
        />
      </div>
    </div>
  )
}