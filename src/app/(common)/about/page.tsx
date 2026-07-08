// app/(common)/about/page.tsx
'use client'

import { useTranslations } from 'next-intl'
import { 
  GraduationCap, 
  Users, 
  Award, 
  Building, 
  Shield, 
  Sparkles,
  BookOpen,
  Globe,
  Target,
  Heart,
  ChevronRight,
  Star,
  Clock,
  Calendar,
  Gift
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  const t = useTranslations('About')
  
  const values = [
    {
      icon: Award,
      title: t('values.excellence.title'),
      description: t('values.excellence.description')
    },
    {
      icon: Users,
      title: t('values.collaboration.title'),
      description: t('values.collaboration.description')
    },
    {
      icon: Heart,
      title: t('values.care.title'),
      description: t('values.care.description')
    },
    {
      icon: Target,
      title: t('values.innovation.title'),
      description: t('values.innovation.description')
    }
  ]

  const stats = [
    { value: '100+', label: t('stats.schools'), icon: Building },
    { value: '24/7', label: t('stats.support'), icon: Clock },
    { value: '98%', label: t('stats.satisfaction'), icon: Star },
    { value: '3+', label: t('stats.years'), icon: Calendar }
  ]

  const offers = [
    { icon: BookOpen, title: t('offer.benefits.title'), description: t('offer.benefits.description'), color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Users, title: t('offer.training.title'), description: t('offer.training.description'), color: 'text-secondary', bg: 'bg-secondary/10' },
    { icon: Calendar, title: t('offer.events.title'), description: t('offer.events.description'), color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Shield, title: t('offer.certification.title'), description: t('offer.certification.description'), color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Sparkles, title: t('offer.competition.title'), description: t('offer.competition.description'), color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section - Full height image with overlay text */}
      <div className="relative bg-[#FEFDFC] w-full overflow-hidden">
        {/* Background Image - Full height */}
        <div 
          className="absolute top-0  right-0 w-4/5 h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/illustrations/school.png')`,
          }}
        >
          {/* Overlay gelap untuk text readability */}
          <div className="absolute inset-0 bg-linear-to-r from-white/90 via-white/70 to-white/40 lg:from-white/80 lg:via-white/50 lg:to-transparent"></div>
        </div>

        {/* Content - Text di atas image */}
        <div className="relative z-10 w-full flex items-center">
          <div className="max-w-6xl mx-auto px-4 w-full py-12 md:py-16">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/1 border border-primary/30 md:mb-2 mb-4">
                <GraduationCap size={16} className="text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary">{t('badge')}</span>
              </div>
              
              {/* Title */}
              <h1 className="text-3xl md:text-6xl font-bold text-foreground mb-3 sm:mb-4">
                {t('heroTitle')} <br className="hidden sm:block" />
                <span className="text-primary">{t('heroHighlight')}</span>
              </h1>
              
              {/* Description */}
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {t('heroDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto md:px-8 md:pt-12 px-4">
        
        {/* Mission & Vision */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
          <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
              <Target size={20} className="text-primary sm:size-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{t('missionTitle')}</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{t('missionDescription')}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-3 sm:mb-4">
              <Globe size={20} className="text-secondary sm:size-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{t('visionTitle')}</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {t('visionDescription')}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-xl p-4 sm:p-6 text-center border border-border shadow-sm">
                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-2 sm:mb-3">
                  <Icon size={16} className="text-primary sm:size-5" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Values */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t('valuesTitle')}</h2>
            <div className="w-22 h-1 bg-linear-to-r from-primary to-secondary rounded-full mx-auto mt-2" />
            <p className="text-sm text-muted-foreground mt-2 sm:mt-3 max-w-md mx-auto">{t('valuesSubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="bg-white rounded-xl p-4 sm:p-6 text-center border border-border hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Icon size={18} className="text-primary sm:size-5.5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1.5 sm:mb-2">{value.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
        
      </div>

      <div className="bg-primary/10 md:px-8 md:py-12 p-4">
         <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm border border-border">
            <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t('offerTitle')}</h2>
              <div className="w-22 h-1 bg-linear-to-r from-primary to-secondary rounded-full mx-auto" />
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {offers.map((offer, index) => {
                const Icon = offer.icon
                return (
                  <div key={index} className="flex items-start gap-2.5 sm:gap-3">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${offer.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon size={12} className={offer.color + ' sm:size-3.5'} />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-foreground">{offer.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{offer.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}