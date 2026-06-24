// components/dashboard/agreement-renewal.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  RefreshCw,
  MessageCircle,
  Shield,
  Building2
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

interface AgreementRenewalProps {
  partnerName?: string
  endDate?: string
  consultantName?: string
  consultantContact?: string
}

export function AgreementRenewal({ 
  partnerName = 'Mentari Group',
  endDate = '11 Jun 2029',
  consultantName = 'Education Consultant',
  consultantContact = 'Available anytime'
}: AgreementRenewalProps) {
  const t = useTranslations('Dashboard')
  const [isRenewing, setIsRenewing] = useState(false)
  const [isRenewed, setIsRenewed] = useState(false)

  const handleRenew = () => {
    setIsRenewing(true)
    // Simulasi proses renewal
    setTimeout(() => {
      setIsRenewing(false)
      setIsRenewed(true)
      setTimeout(() => setIsRenewed(false), 5000)
    }, 2000)
  }

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl group">
      {/* Gradient Border */}
      <div className="absolute inset-0 bg-linear-to-r from-[#3279FF] via-[#FFB347] to-[#3279FF] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-2xl" style={{ padding: '2px' }} />
      
      <div className="relative p-6 sm:p-8">
        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#3279FF]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#FFB347]/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-linear-to-br from-[#3279FF]/10 to-[#FFB347]/10">
                <Building2 className="text-[#3279FF]" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {t('agreementRenewal.title')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('agreementRenewal.subtitle')}
                </p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {t('agreementRenewal.active')}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Partner Info */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-[#3279FF]/5 dark:bg-[#3279FF]/10 rounded-xl border border-[#3279FF]/10">
              <div className="flex items-center gap-3">
                <Shield className="text-[#3279FF]" size={18} />
                <span className="font-medium text-foreground">{partnerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                <span>{t('agreementRenewal.endsOn')} <strong className="text-foreground">{endDate}</strong></span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                {t('agreementRenewal.description')}
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#3279FF] mt-0.5">•</span>
                <span>{t('agreementRenewal.consultantHelp')} <strong className="text-foreground">{consultantName}</strong> {t('agreementRenewal.consultantAvailable')} {consultantContact}.</span>
              </p>
              <p className="text-foreground/80 font-medium">
                {t('agreementRenewal.gratitude')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              {/* Renew Button */}
              <Button
                onClick={handleRenew}
                disabled={isRenewing || isRenewed}
                className={`flex-1 gap-2 bg-linear-to-r from-[#3279FF] to-[#3279FF]/80 hover:from-[#2b66d9] hover:to-[#3279FF] text-white font-medium rounded-xl transition-all duration-300 ${
                  isRenewed ? 'bg-emerald-500 hover:bg-emerald-500' : ''
                }`}
                size="lg"
              >
                {isRenewing ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    {t('agreementRenewal.processing')}
                  </>
                ) : isRenewed ? (
                  <>
                    <CheckCircle size={18} />
                    {t('agreementRenewal.renewed')}
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} />
                    {t('agreementRenewal.autoRenew')}
                  </>
                )}
              </Button>

              {/* Contact Consultant Button */}
              <Button
                variant="outline"
                className="gap-2 border-[#3279FF]/30 text-[#3279FF] hover:bg-[#3279FF]/10 hover:text-[#2b66d9] rounded-xl transition-all duration-300"
                size="lg"
              >
                <MessageCircle size={18} />
                {t('agreementRenewal.contactConsultant')}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Success Message */}
            {isRenewed && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                  <CheckCircle size={16} />
                  <span>{t('agreementRenewal.successMessage')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}