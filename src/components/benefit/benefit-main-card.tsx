// components/benefit/benefit-main-card.tsx
'use client'

import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils/date'
import { sanitizeDisplay } from '@/lib/utils/sanitize-string'
import { BenefitDetailI, PK } from '@/types/benefit/benefit.type'
import { Calendar, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface BenefitMainCardProps {
  benefit: BenefitDetailI
  pk: PK
  totalQuota: number
  expired: boolean
}

export function BenefitMainCard({ benefit, pk, totalQuota, expired }: BenefitMainCardProps) {
  const t = useTranslations('BenefitDetail')

  return (
    <Card id="benefit-detail-main-card" className="relative overflow-hidden border-border bg-white p-0 shadow-sm">
      
      {/* Top accent bar - brand colors */}
      <div className="h-1 w-full bg-linear-to-r from-primary to-secondary" />
      
      {/* Decorative flower - bottom right corner */}
      <div className="pointer-events-none absolute bottom-2 right-2 opacity-30">
        <div className="relative h-12 w-12 sm:h-16 sm:w-16">
          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/60 sm:h-6 sm:w-6" />
          <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-secondary/40 sm:h-5 sm:w-5" />
          <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-secondary/40 sm:h-5 sm:w-5" />
          <div className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-secondary/40 sm:h-5 sm:w-5" />
          <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-secondary/40 sm:h-5 sm:w-5" />
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/60 sm:h-3 sm:w-3" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-4 w-3 rotate-45 rounded-full bg-emerald-400/30 sm:h-6 sm:w-4" />
      </div>
      
      <div className="p-3 pt-0 sm:px-6 sm:pb-4 sm:pt-0">
        
        {/* Header */}
        <div className="flex items-start gap-2 sm:gap-3 px-2">
          <div className="flex-1">
            {/* Program */}
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-xs">
              {sanitizeDisplay(pk.program)}
            </p>
            
            {/* Title row with expired badge inline */}
            <div className="flex flex-wrap items-start justify-between gap-1 sm:gap-2">
              <h1 className="text-base font-bold text-foreground sm:text-xl md:text-2xl md:max-w-4/5">
                {sanitizeDisplay(benefit.benefit_name)}
              </h1>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <span className="rounded-full font-semibold bg-accent/10 px-2 py-1 text-[8px] text-accent sm:px-3 sm:py-1.5 sm:text-[9px]">
                  {benefit.event_group_code}
                </span>
                {expired && (
                  <span className="whitespace-nowrap rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive sm:px-2 sm:py-0.5 sm:text-sm">
                    ⏰ {t('expired')}
                  </span>
                )}
              </div>
            </div>
            
            {/* Subject badge */}
            {benefit.subject_benefit && (
              <div className="mt-1 sm:mt-1.5">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] text-primary sm:px-2.5 sm:py-1 sm:text-xs">
                  📚 {benefit.subject_benefit}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-3 sm:mt-4">
          <div className="rounded-lg border border-border bg-gray-50 p-2 sm:p-3">
            <p className="whitespace-pre-line text-[11px] leading-relaxed text-foreground sm:text-sm">
              {benefit.description?.replace(/\s+(\d+\.)/g, '\n$1').replace(/^\n/, '') || '-'}
            </p>
          </div>
        </div>
        
        {/* Quota & Validity */}
        <div id="benefit-detail-quota" className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3 sm:mt-4 sm:gap-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 sm:h-7 sm:w-7">
              <Users size={12} className="text-primary sm:size-3.5" />
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-wide text-muted-foreground sm:text-[10px]">{t('availableSlots')}</p>
              <p className="text-center text-base font-bold text-foreground sm:text-lg">{totalQuota}</p>
            </div>
          </div>
          
          <div className="h-6 w-px bg-border sm:h-8" />
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary/10 sm:h-7 sm:w-7">
              <Calendar size={12} className="text-secondary sm:size-3.5" />
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-wide text-muted-foreground sm:text-[10px]">{t('validUntil')}</p>
              <p className={`text-xs font-semibold sm:text-sm ${expired ? 'text-destructive' : 'text-foreground'}`}>
                {formatDate(pk.expired_at)}
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </Card>
  )
}