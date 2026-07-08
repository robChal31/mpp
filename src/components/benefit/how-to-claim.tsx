// components/benefit/how-to-claim-compact.tsx
'use client'

import { ArrowRight, Layers, Sparkles, Ticket } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface HowToClaimProps {
  totalQuota: number
  relatedEventsCount: number
  expired?: boolean
}

export function HowToClaim({ totalQuota, relatedEventsCount, expired = false }: HowToClaimProps) {
  const t = useTranslations('BenefitDetail')

  if (expired) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⏰</div>
          <div>
            <p className="text-sm font-medium text-destructive">{t('expiredBenefit')}</p>
            <p className="text-xs text-destructive/70">{t('expiredBenefitMessage')}</p>
          </div>
        </div>
      </div>
    )
  }

  const steps = [
    { icon: '📋', title: t('step1'), color: 'from-blue-500/20 to-blue-500/5' },
    { icon: '✏️', title: t('step2'), color: 'from-purple-500/20 to-purple-500/5' },
    { icon: '🔍', title: t('step3'), color: 'from-orange-500/20 to-orange-500/5' },
    { icon: '✅', title: t('step4'), color: 'from-green-500/20 to-green-500/5' }
  ]

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-linear-to-r from-primary/5 to-secondary/5 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Sparkles size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">{t('howToClaim')}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
            <Layers size={12} className="text-primary" />
            {totalQuota} {t('slots')}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-xs">
            <Ticket size={12} className="text-secondary" />
            {relatedEventsCount} {t('eligibleEvents')}
          </span>
        </div>
      </div>
      
      {/* Steps - Compact Card */}
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:p-5">
        {steps.map((step, index) => (
          <div key={index} className="group relative overflow-hidden rounded-xl border border-border bg-white p-4 text-center transition-all hover:border-primary/30 hover:shadow-md">
            <div className={`absolute inset-0 bg-linear-to-br ${step.color} opacity-0 transition-opacity group-hover:opacity-100`} />
            
            <div className="relative">
              <div className="mb-2 text-3xl">{step.icon}</div>
              <p className="text-xs font-medium text-foreground">{step.title}</p>
              {index < steps.length - 1 && (
                <ArrowRight size={12} className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-muted-foreground/30 lg:block" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}