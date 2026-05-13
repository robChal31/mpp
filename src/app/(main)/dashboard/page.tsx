// app/dashboard/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  Gift,
  Calendar,
  ArrowRight,
  Sparkles,
  Users,
  Lightbulb,
  Rocket
} from 'lucide-react'
import SimpleEventsScroll from '@/components/event/simple-events-scroll'
import { HelpSection } from '@/components/help-section'
import { useTranslations } from 'next-intl'
import OnboardingTour from '@/components/OnboardingTour'
import Link from 'next/link'
import { useMemo } from 'react'

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
      <OnboardingTour pageName='dashboard' steps={steps}  />
      <div className="my-6"></div>
      <div id="dashboard-hero" className="relative overflow-hidden rounded-2xl py-4">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-background" />
        
        <div className="relative p-8 max-[640px]:p-5 md:p-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-4">
                <Sparkles size={12} />
                <span>{t('heroBadge')}</span>
              </div>
              <h1 className="text-3xl max-[640px]:text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {t('heroTitle')}
              </h1>
              <p className="text-muted-foreground mb-6 text-base max-w-lg">
                {t('heroDescription')}
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-primary/20 border-2 border-background" />
                    ))}
                  </div>
                  <span>10.000+ pengguna aktif</span>
                </div>
                <div>⭐ 4.9/5 dari 500+ ulasan</div>
              </div>
            </div>
            
            {/* Right Content - Testimonial Card */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border max-w-sm">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm italic text-muted-foreground">
                    "Platform yang sangat membantu saya menemukan benefit dan event terbaik!"
                  </p>
                  <p className="text-xs font-medium mt-2">— Sarah, Guru SD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className='my-6 py-6'/>
      
      {/* Featured Events */}
      <div id="dashboard-featured-events" className="space-y-4 my-6">
        <div id="dashboard-featured-header" className="flex items-center justify-between max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-2">
          <div>
            <h2 className="text-xl max-[640px]:text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="text-primary" size={20} />
              {t('featuredEvents')}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('featuredEventsDesc')}
            </p>
          </div>
          <Link href="/events">
            <Button variant="ghost" size="sm" className="gap-1 text-primary max-[640px]:text-xs cursor-pointer">
              {t('viewAllEvents')}
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        <div id="simple-events-scroll">
          <SimpleEventsScroll limit={6} />
        </div>
      </div>

      {/* Quick Actions */}
      <div id="dashboard-quick-actions" className="space-y-4 my-12 py-4 border-b border-border">
        <div>
          <h2 className="text-xl max-[640px]:text-lg font-semibold text-foreground flex items-center gap-2">
            <Rocket className="text-primary" size={20} />
            {t('quickActions')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('quickActionsDesc')}
          </p>
        </div>

        <div id="dashboard-quick-actions-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/benefits" className="block">
            <div className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group max-[640px]:p-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Gift size={18} className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground text-sm max-[640px]:text-xs">{t('claimBenefits')}</p>
                <p className="text-xs text-muted-foreground max-[640px]:text-[10px]">{t('claimBenefitsDesc')}</p>
              </div>
              <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link href="/events" className="block">
            <div className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group max-[640px]:p-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Calendar size={18} className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground text-sm max-[640px]:text-xs">{t('browseEventsShort')}</p>
                <p className="text-xs text-muted-foreground max-[640px]:text-[10px]">{t('browseEventsDesc')}</p>
              </div>
              <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link href="/settings" className="block">
            <div className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group max-[640px]:p-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Users size={18} className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground text-sm max-[640px]:text-xs">{t('accountSettings')}</p>
                <p className="text-xs text-muted-foreground max-[640px]:text-[10px]">{t('accountSettingsDesc')}</p>
              </div>
              <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>
      </div>

      {/* Help Section */}
      <div id="dashboard-help-section" className="pt-4">
        <HelpSection
          title={t('helpTitle')}
          description={t('helpDescription')}
        />
      </div>
    </div>
  )
}