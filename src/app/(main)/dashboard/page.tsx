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

export default function DashboardPage() {
  const t = useTranslations('Dashboard')
  
  return (
    <div className="space-y-6 max-[640px]:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl max-[640px]:text-2xl font-bold text-foreground mb-2">{t('title')}</h1>
        <p className="text-muted-foreground max-[640px]:text-sm">{t('welcome')}</p>
        <p className="text-muted-foreground max-[640px]:text-sm mt-1">{t('description')}</p>
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
        </div>
        
        <div className="relative p-8 max-[640px]:p-5 md:p-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm text-primary text-xs font-medium mb-4 border border-primary/30">
              <Sparkles size={12} />
              <span className="max-[640px]:text-[10px]">{t('heroBadge')}</span>
            </div>
            <h1 className="text-3xl max-[640px]:text-2xl md:text-4xl font-bold text-foreground mb-3">
              {t('heroTitle')}
            </h1>
            <p className="text-muted-foreground mb-6 max-w-md max-[640px]:text-sm max-[640px]:mb-4">
              {t('heroDescription')}
            </p>
            <div className="flex flex-wrap gap-3 max-[640px]:flex-col max-[640px]:w-full">
              <Button 
                className="gap-2 shadow-lg shadow-primary/20 max-[640px]:w-full"
                onClick={() => window.location.href = '/benefits'}
              >
                <Gift size={16} />
                {t('viewBenefits')}
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 bg-background/50 backdrop-blur-sm max-[640px]:w-full"
                onClick={() => window.location.href = '/events'}
              >
                <Calendar size={16} />
                {t('browseEvents')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-2">
          <div>
            <h2 className="text-xl max-[640px]:text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="text-primary" size={20} />
              {t('featuredEvents')}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('featuredEventsDesc')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-primary max-[640px]:text-xs"
            onClick={() => window.location.href = '/events'}
          >
            {t('viewAllEvents')}
            <ArrowRight size={14} />
          </Button>
        </div>

        <SimpleEventsScroll limit={6} />
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl max-[640px]:text-lg font-semibold text-foreground flex items-center gap-2">
            <Rocket className="text-primary" size={20} />
            {t('quickActions')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('quickActionsDesc')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => window.location.href = '/benefits'}
            className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group max-[640px]:p-3"
          >
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Gift size={18} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground text-sm max-[640px]:text-xs">{t('claimBenefits')}</p>
              <p className="text-xs text-muted-foreground max-[640px]:text-[10px]">{t('claimBenefitsDesc')}</p>
            </div>
            <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => window.location.href = '/events'}
            className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group max-[640px]:p-3"
          >
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Calendar size={18} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground text-sm max-[640px]:text-xs">{t('browseEventsShort')}</p>
              <p className="text-xs text-muted-foreground max-[640px]:text-[10px]">{t('browseEventsDesc')}</p>
            </div>
            <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => window.location.href = '/settings'}
            className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group max-[640px]:p-3"
          >
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Users size={18} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground text-sm max-[640px]:text-xs">{t('accountSettings')}</p>
              <p className="text-xs text-muted-foreground max-[640px]:text-[10px]">{t('accountSettingsDesc')}</p>
            </div>
            <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="pt-4 border-t border-border">
        <HelpSection
          title={t('helpTitle')}
          description={t('helpDescription')}
        />
      </div>
    </div>
  )
}