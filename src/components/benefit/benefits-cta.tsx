// components/benefits/benefits-cta.tsx
'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ArrowRight, HelpCircle, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export function BenefitsCTA() {
  const t = useTranslations('Benefits')

  return (
        <div className="relative md:mt-6 mt-2 overflow-hidden rounded-2xl bg-linear-to-r from-primary/5 via-primary/10 to-secondary/5 border border-border p-4 sm:p-6">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left side - Text */}
                <div className="flex items-start md:gap-5 gap-3 sm:items-center">
                    <HelpCircle size={32} className="text-primary shrink-0 mt-0.5 sm:mt-0" />
                    <div className="space-y-0.5">
                        <p className="text-sm font-bold text-foreground">
                            {t('ctaTitle')}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {t('ctaDescription')}
                        </p>
                    </div>
                </div>
                
                {/* Right side - CTA Button */}
                <Link href="mailto:support@mentarigroups.com" className="shrink-0 w-full sm:w-auto">
                    <Button className="btn-primary group w-full sm:w-auto justify-center">
                        <span className="md:text-xs text-[11px]">{t('ctaButton')}</span>
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                </Link>
            </div>
        </div>
  )
}