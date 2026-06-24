// components/benefit/how-to-claim.tsx
'use client'

import { useTranslations } from 'next-intl'
import { Layers, Ticket, CheckCircle } from 'lucide-react'

interface HowToClaimProps {
  totalQuota: number
  relatedEventsCount: number
  expired?: boolean
}

export function HowToClaim({ totalQuota, relatedEventsCount, expired = false }: HowToClaimProps) {
  const t = useTranslations('BenefitDetail')

  if (expired) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⏰</div>
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">{t('expiredBenefit')}</p>
            <p className="text-xs text-red-600 dark:text-red-300">{t('expiredBenefitMessage')}</p>
          </div>
        </div>
      </div>
    )
  }

  const steps = [
    { number: 1, title: t('step1'), emoji: '📋' },
    { number: 2, title: t('step2'), emoji: '✏️' },
    { number: 3, title: t('step3'), emoji: '🔍' },
    { number: 4, title: t('step4'), emoji: '✅' }
  ]

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📌</span>
            <h3 className="font-semibold text-gray-900 dark:text-white">{t('howToClaim')}</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Layers size={14} className="text-[#3279FF]" />
              <span>{totalQuota} {t('slots')}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Ticket size={14} className="text-green-500" />
              <span>{relatedEventsCount} {t('eligibleEvents')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Steps */}
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 dark:bg-gray-800 flex items-center justify-center mb-2">
                <span className="text-2xl">{step.emoji}</span>
              </div>
              <div className="w-5 h-5 mx-auto rounded-full bg-[#3279FF]/10 flex items-center justify-center mt-0 mb-1">
                <span className="text-[9px] font-bold text-[#3279FF]">{step.number}</span>
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {step.title}
              </p>
            </div>
          ))}
        </div>
        
      </div>
      
    </div>
  )
}