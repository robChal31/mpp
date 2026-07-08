"use client"

import { BenefitReport } from '@/components/dashboard/benefit-report'
import FeaturedEvents from '@/components/dashboard/featured-event'
import HeroSection from '@/components/dashboard/hero-section'
import OnboardingTour from '@/components/OnboardingTour'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

interface DashboardPageProps {
  user: { name: string; email: string; role: string } | null
}


const DashboardPage = ({ user }: DashboardPageProps) => {
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

      <HeroSection user={user} />

      <BenefitReport />
      <hr className='md:my-1 md:py-1 border-border max-w-6xl mx-auto'/>
      
      {/* Featured Events Section */}
      <FeaturedEvents />
    </div>
  )
}

export default DashboardPage;