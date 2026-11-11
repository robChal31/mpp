// components/benefits/benefits-cta.tsx
'use client'

import { ArrowRight, HelpCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function BenefitCTA() {
  const t = useTranslations('Benefits')

  return (
    <div className="relative mt-2 overflow-hidden rounded-2xl border border-border bg-linear-to-r from-primary/5 via-primary/10 to-secondary/5 p-4 sm:mt-6 sm:p-6">
      {/* Decorative elements */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/5 blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side - Text */}
        <div className="flex items-start gap-3 sm:items-center md:gap-5">
          <div className="shrink-0 rounded-full bg-primary/10 p-2.5">
            <HelpCircle size={24} className="text-primary" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-foreground">
              {t('ctaTitle2')}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {t('ctaDescription2')}
            </p>
          </div>
        </div>
        
        {/* Right side - CTA Button */}
        <Link href="/help-center" className="md:w-auto w-full shrink-0 sm:w-auto">
          <span className="btn-sm btn-primary w-full flex items-center justify-center gap-2">
            <span className="text-[11px] md:text-xs">{t('ctaButton2')}</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </div>
  )
}