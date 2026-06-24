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
    { icon: BookOpen, title: t('offer.benefits.title'), description: t('offer.benefits.description'), color: 'text-[#3279FF]', bg: 'bg-[#3279FF]/10' },
    { icon: Users, title: t('offer.training.title'), description: t('offer.training.description'), color: 'text-[#FFB347]', bg: 'bg-[#FFB347]/10' },
    { icon: Calendar, title: t('offer.events.title'), description: t('offer.events.description'), color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { icon: Shield, title: t('offer.certification.title'), description: t('offer.certification.description'), color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: Sparkles, title: t('offer.competition.title'), description: t('offer.competition.description'), color: 'text-amber-600', bg: 'bg-amber-100' },
  ]

  return (
    <div className="min-h-screen bg-[#FCF6E4]">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#3279FF] to-[#5e93ff] py-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
            <GraduationCap size={16} className="text-white" />
            <span className="text-sm font-medium">{t('badge')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('heroTitle')} <span className="text-[#FFB347]">{t('heroHighlight')}</span>
          </h1>
          
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#3279FF]/10 flex items-center justify-center mb-4">
              <Target size={24} className="text-[#3279FF]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t('missionTitle')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('missionDescription')}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#FFB347]/10 flex items-center justify-center mb-4">
              <Globe size={24} className="text-[#FFB347]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t('visionTitle')}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {t('visionDescription')}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
                <div className="w-10 h-10 mx-auto rounded-lg bg-[#3279FF]/10 flex items-center justify-center mb-3">
                  <Icon size={20} className="text-[#3279FF]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">{t('valuesTitle')}</h2>
            <div className="w-16 h-1 bg-linear-to-r from-[#3279FF] to-[#FFB347] rounded-full mx-auto mt-2" />
            <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">{t('valuesSubtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-5">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="bg-white rounded-xl p-6 text-center border border-gray-100 hover:border-[#3279FF]/30 hover:shadow-md transition-all">
                  <div className="w-12 h-12 mx-auto rounded-full bg-linear-to-br from-[#3279FF]/10 to-[#FFB347]/10 flex items-center justify-center mb-4">
                    <Icon size={22} className="text-[#3279FF]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-[#3279FF]/10">
              <Gift size={22} className="text-[#3279FF]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('offerTitle')}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-5">
            {offers.map((offer, index) => {
              const Icon = offer.icon
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full ${offer.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon size={14} className={offer.color} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{offer.title}</h4>
                    <p className="text-sm text-gray-500">{offer.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
      </div>
    </div>
  )
}