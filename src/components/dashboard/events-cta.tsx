// components/benefits/benefits-cta.tsx
'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ArrowRight, CalendarHeart, HelpCircle, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export function EventsCTA() {
  const t = useTranslations('Dashboard')

  return (
        <div className="relative md:mt-6 mt-2 overflow-hidden rounded-2xl bg-linear-to-r from-primary/5 via-primary/10 to-secondary/5 border border-border p-4 sm:p-6">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left side - Text */}
                <div className="flex items-start md:gap-5 gap-3 sm:items-center">
                    <CalendarHeart size={32} className="text-primary shrink-0 mt-0.5 sm:mt-0" />
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
                <Link href="/events" className="w-full md:w-auto flex items-center justify-center">
                    <Link href="/events" className='btn-sm btn-primary w-full' >
                        <span className="md:text-xs text-[11px]">{t('viewAllEvents')}</span>
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </Link>
            </div>
        </div>
  )
}