// components/benefit/benefit-main-card.tsx
'use client'

import { Card } from '@/components/ui/card'
import { Users, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils/date'
import { useTranslations } from 'next-intl'
import { BenefitDetailI, PK } from '@/types/benefit/benefit.type'
import { getBenefitIcon, getDetailColor } from '@/lib/utils/benefit'
import { sanitizeDisplay } from '@/lib/utils/sanitize-string'

interface BenefitMainCardProps {
  benefit: BenefitDetailI
  pk: PK
  totalQuota: number
  expired: boolean
}

export function BenefitMainCard({ benefit, pk, totalQuota, expired }: BenefitMainCardProps) {
  const t = useTranslations('BenefitDetail')
  const detailColor = getDetailColor(benefit.type)

  return (
    <Card id="benefit-detail-main-card" className="p-0 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm relative">
      
      {/* Top accent bar - brand colors */}
      <div className="h-1 w-full bg-linear-to-r from-[#3279FF] to-[#FFB347]" />
      
      {/* Decorative flower - bottom right corner */}
      <div className="absolute bottom-2 right-2 opacity-30 pointer-events-none">
        <div className="relative w-16 h-16">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFB347]/60" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FFB347]/40" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FFB347]/40" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FFB347]/40" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FFB347]/40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#3279FF]/60" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-6 rounded-full bg-emerald-400/30 rotate-45" />
      </div>
      
      <div className="p-5">
        
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg ${detailColor} shrink-0 hidden md:block`}>
            {getBenefitIcon(benefit.type, 24)}
          </div>
          <div className="flex-1">
            {/* Program */}
            <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide mb-0.5">
              {sanitizeDisplay(pk.program)}
            </p>
            
            {/* Title row with expired badge inline */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {sanitizeDisplay(benefit.benefit_name)}
              </h1>
              <div className="flex gap-2">
                <span className="text-[9px] px-3 py-1.5 rounded-full bg-accent text-white">
                  {benefit.event_group_code}
                </span>
                {expired && (
                  <span className="text-sm px-2 py-0.5 rounded-full bg-red-100 text-red-500 whitespace-nowrap">
                    ⏰ {t('expired')}
                  </span>
                )}
              </div>
            </div>
            
            {/* Subject badge */}
            {benefit.subject_benefit && (
              <div className="mt-1.5">
                <span className="text-xs px-2.5 py-1 rounded-md bg-primary text-gray-100">
                  📚 {benefit.subject_benefit}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-4 pl-0 md:pl-13">
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 dark:bg-gray-800/30 dark:border-gray-700">
            <p className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {benefit.description?.replace(/\s+(\d+\.)/g, '\n$1').replace(/^\n/, '') || '-'}
            </p>
          </div>
        </div>
        
        {/* Quota & Validity */}
        <div id="benefit-detail-quota" className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#3279FF]/10 flex items-center justify-center">
              <Users size={14} className="text-[#3279FF]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{t('availableSlots')}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white text-center">{totalQuota}</p>
            </div>
          </div>
          
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFB347]/10 flex items-center justify-center">
              <Calendar size={14} className="text-[#FFB347]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{t('validUntil')}</p>
              <p className={`text-sm font-semibold ${expired ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                {formatDate(pk.expired_at)}
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </Card>
  )
}