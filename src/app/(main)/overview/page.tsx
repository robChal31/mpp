// app/(main)/programs/page.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils/date'
import { sanitizeDisplay } from '@/lib/utils/sanitize-string'
import {
  Building2,
  Calendar,
  CheckCircle,
  CircleHelpIcon,
  Clock,
  Folder,
  Info,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Shield,
  Sparkles,
  X
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface PKDocument {
  id: string
  name: string
  pk: {
    no_pk: string
    id_draft: string
    start_at: string
    expired_at: string
    status: 'active' | 'expired'
  }
  pic: {
    name: string
    position: string
    email: string
    phone: string
  }
}

interface RenewalModalProps {
  isOpen: boolean
  onClose: () => void
  programName: string
  endDate: string
  onRenew: () => Promise<void>
  isRenewing: boolean
}

function RenewalModal({ 
  isOpen, 
  onClose, 
  programName, 
  endDate, 
  onRenew,
  isRenewing 
}: RenewalModalProps) {
  const t = useTranslations('Programs')
  const [isRenewed, setIsRenewed] = useState(false)

  const handleRenew = async () => {
    setIsRenewed(false)
    await onRenew()
    setIsRenewed(true)
    setTimeout(() => {
      setIsRenewed(false)
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="mx-4 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-3 sm:p-5">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-primary sm:size-5" />
            <h2 className="text-sm font-semibold text-foreground sm:text-lg">
              {t('renewal.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 transition-colors hover:bg-muted"
            disabled={isRenewing}
          >
            <X size={16} className="sm:size-4.5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3 p-3 sm:space-y-4 sm:p-5 max-h-[70vh] overflow-y-auto">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5 sm:p-3">
            <p className="text-[10px] text-muted-foreground sm:text-[11px]">{t('renewal.program')}</p>
            <p className="text-xs font-medium text-foreground capitalize sm:text-sm">{programName}</p>
            <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground sm:mt-2 md:text-[11px]">
              <Calendar size={12} className="text-secondary sm:size-3.5" />
              <span>{t('renewal.endsOn')} <strong className="text-foreground">{endDate}</strong></span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground leading-relaxed sm:space-y-3 sm:text-sm">
            <div className="flex items-start gap-1.5 sm:gap-2">
              <Info size={14} className="mt-0.5 shrink-0 text-primary sm:size-4" />
              <span>{t('renewal.description')}</span>
            </div>
            
            <div className="flex items-start gap-1.5 sm:gap-2">
              <Shield size={14} className="mt-0.5 shrink-0 text-primary sm:size-4" />
              <span>{t('renewal.benefit')}</span>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-lg border border-secondary/20 bg-secondary/5 p-2.5 sm:flex-row sm:gap-3 sm:p-3">
              <CircleHelpIcon size={20} className="text-primary sm:size-6.5" />
              <div className="flex-1 text-center sm:text-left">
                <p className="text-[10px] text-muted-foreground md:text-[11px]">
                  {t('renewal.consultantHelp')}
                </p>
                <p className="text-[10px] font-medium text-secondary md:text-[11px] sm:mt-0.5">
                  {t('renewal.consultantAvailable')}
                </p>
                <p className="mt-1 text-[10px] italic text-muted-foreground sm:mt-2 md:text-[11px]">
                  {t('renewal.gratitude')}
                </p>
              </div>
            </div>
          </div>

          {isRenewed && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-300 rounded-lg border border-green-200 bg-green-50 p-2.5 sm:p-3">
              <div className="flex items-center gap-2 text-xs text-green-700 sm:text-sm">
                <CheckCircle size={14} className="sm:size-4" />
                <span>{t('renewal.success')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t border-border p-3 sm:flex-row sm:p-5">
          <Button
            variant="outline"
            className="flex-1 text-xs sm:text-sm"
            onClick={onClose}
            disabled={isRenewing}
          >
            {t('renewal.cancel')}
          </Button>
          <Button
            className="flex-1 gap-1.5 text-xs sm:gap-2 sm:text-sm"
            onClick={handleRenew}
            disabled={isRenewing || isRenewed}
          >
            {isRenewing ? (
              <>
                <Loader2 size={14} className="animate-spin sm:size-4" />
                {t('renewal.processing')}
              </>
            ) : isRenewed ? (
              <>
                <CheckCircle size={14} className="sm:size-4" />
                {t('renewal.done')}
              </>
            ) : (
              <>
                <RefreshCw size={14} className="sm:size-4" />
                {t('renewal.renew')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function DocumentPage() {
  const t = useTranslations('Programs')
  const [pkDocuments, setPkDocuments] = useState<PKDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [isRenewing, setIsRenewing] = useState(false)
  const [renewalModal, setRenewalModal] = useState<{
    isOpen: boolean
    programId: string
    programName: string
    endDate: string
  }>({
    isOpen: false,
    programId: '',
    programName: '',
    endDate: ''
  })

  const loadPKDocuments = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/mpartner/benefits/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      
      if (data.status === 'error') {
        toast.error(data.message || t('failedToLoad'))
        setPkDocuments([])
      } else {
        const documents = data.data?.documents?.pk_documents || []
        setPkDocuments(documents)
      }
    } catch (err) {
      console.error(err)
      toast.error(t('failedToLoad'))
      setPkDocuments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPKDocuments()
  }, [t])

  const handleRenew = async (programId: string) => {
    setIsRenewing(true)
    try {
      const res = await fetch('/api/mpartner/pk/renewal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pk_id: programId })
      })
      
      const data = await res.json()

      if (data.status === 'error') {
        toast.error(data.message || t('failedToLoad'))
        return
      }
      
      toast.success(t('renewal.successMessage'))
      
    } catch (err) {
      console.error(err)
      toast.error(t('failedToLoad'))
    } finally {
      setIsRenewing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <Loader2 className="relative z-10 h-10 w-10 animate-spin text-primary sm:h-12 sm:w-12" />
        </div>
      </div>
    )
  }

  if (pkDocuments.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 min-h-[80vh]">
        <div className="mb-6 sm:mb-10 flex items-center gap-3 sm:gap-4">
          <div className="rounded-2xl bg-primary/10 p-2.5 sm:p-3">
            <Folder className="text-primary" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">{t('title')}</h1>
            <p className="text-xs text-muted-foreground sm:text-sm">{t('description')}</p>
          </div>
        </div>
        <div className="py-12 sm:py-16 text-center">
          <div className="mx-auto mb-3 sm:mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-muted">
            <Folder size={32} className="text-muted-foreground sm:size-10" />
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">{t('noData')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-6 min-h-[85vh]">
      {/* Header */}
      <div className="md:mb-4 mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-primary sm:text-2xl lg:text-3xl">{t('title')}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm max-w-2xl">
            {t('description')}
          </p>
        </div>
        
        <div className="md:mb-4 mb-1 flex flex-wrap items-center md:justify-end">
          <p className="md:text-xs text-[10px] text-muted-foreground">
            {t('programsCount', { count: pkDocuments.length, total: pkDocuments.length })}
          </p>
        </div>
      </div>

      {/* Table - dengan horizontal scroll di mobile */}
      <div className="overflow-hidden rounded-sm border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-175 sm:min-w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-primary/90">
                <th className="px-2 py-2 text-left text-[10px] font-semibold text-white sm:px-3 sm:py-3 md:text-xs min-w-30">
                  {t('table.program')}
                </th>
                <th className="px-2 py-2 text-left text-[10px] font-semibold text-white sm:px-3 md:text-xs min-w-22.5">
                  {t('table.pkNumber')}
                </th>
                <th className="px-2 py-2 text-left text-[10px] font-semibold text-white sm:px-3 md:text-xs min-w-45">
                  {t('table.period')}
                </th>
                <th className="px-2 py-2 text-left text-[10px] font-semibold text-white sm:px-3 md:text-xs min-w-30">
                  {t('table.pic')}
                </th>
                <th className="px-2 py-2 text-left text-[10px] font-semibold text-white sm:px-3 md:text-xs min-w-40">
                  {t('table.contact')}
                </th>
                <th className="px-2 py-2 text-center text-[10px] font-semibold text-white sm:px-3 md:text-xs min-w-20">
                  {t('table.status')}
                </th>
                <th className="px-2 py-2 text-right text-[10px] font-semibold text-white sm:px-3 md:text-xs min-w-20">
                  {t('table.action')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pkDocuments.map((program) => {
                const isActive = program.pk.status === 'active'
                const programId = program.pk.id_draft
                const cleanNoPk = program.pk.no_pk ? sanitizeDisplay(program.pk.no_pk) : ''
                const hasPIC = program.pic?.name && program.pic.name !== '-'
                const hasContact = (program.pic?.email && program.pic.email !== '-') || 
                                   (program.pic?.phone && program.pic.phone !== '-' && program.pic.phone !== '0')

                return (
                  <tr key={program.id} className="transition-colors hover:bg-muted/20">
                    <td className="px-2 py-2 sm:px-3 sm:py-3">
                      <div>
                        <p className="line-clamp-2 text-[10px] font-medium text-foreground md:text-[11px] capitalize">
                          {sanitizeDisplay(program.name) || program.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-2 py-2 sm:px-3">
                      <span className="font-mono text-[10px] text-muted-foreground md:text-[11px]">
                        {cleanNoPk}
                      </span>
                    </td>
                    <td className="px-2 py-2 sm:px-3">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground sm:gap-1.5 md:text-[11px]">
                        <Calendar size={10} className="shrink-0 text-primary sm:size-3" />
                        <span>{formatDate(program.pk.start_at)}</span>
                        <span className="text-muted-foreground/50">→</span>
                        <Clock size={10} className="shrink-0 text-secondary sm:size-3" />
                        <span>{formatDate(program.pk.expired_at)}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2 sm:px-3">
                      {hasPIC ? (
                        <div>
                          <p className="text-[10px] font-medium text-foreground md:text-[11px]">
                            {program.pic.name}
                          </p>
                          {program.pic.position && program.pic.position !== '-' && (
                            <p className="text-[10px] text-muted-foreground md:text-[11px]">
                              {program.pic.position}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground md:text-[11px]">-</span>
                      )}
                    </td>
                    <td className="px-2 py-2 sm:px-3">
                      {hasContact ? (
                        <div className="flex flex-col gap-0.5 sm:gap-1">
                          {program.pic.email && program.pic.email !== '-' && (
                            <a
                              href={`mailto:${program.pic.email}`}
                              className="flex items-center gap-1 text-[10px] text-primary hover:underline transition-colors md:text-[11px]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Mail size={10} className="shrink-0 sm:size-3" />
                              <span className="max-w-24 sm:max-w-32">{program.pic.email}</span>
                            </a>
                          )}
                          {program.pic.phone && program.pic.phone !== '-' && program.pic.phone !== '0' && (
                            <a
                              href={`tel:${program.pic.phone}`}
                              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors md:text-[11px]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone size={10} className="shrink-0 sm:size-3" />
                              <span>{program.pic.phone}</span>
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground md:text-[11px]">-</span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center sm:px-3">
                      <Badge 
                        className={`text-[8px] font-semibold md:text-[9px] ${
                          isActive 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <CheckCircle size={8} className="mr-0.5 sm:mr-1 sm:size-2.5" />
                            {t('active')}
                          </>
                        ) : (
                          t('expired')
                        )}
                      </Badge>
                    </td>
                    <td className="px-2 py-2 text-right sm:px-3">
                      <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRenewalModal({
                            isOpen: true,
                            programId: programId,
                            programName: sanitizeDisplay(program.name) || program.name,
                            endDate: formatDate(program.pk.expired_at)
                          })}
                          className="h-6 gap-0.5 px-1.5 text-[8px] text-primary hover:bg-primary/10 sm:h-7 sm:gap-1 sm:px-2 md:text-[9px]"
                          disabled={isRenewing}
                        >
                          <RefreshCw size={10} className="sm:size-3" />
                          <span className="md:text-xs md:inline hidden">{t('renew')}</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renewal Modal */}
      <RenewalModal
        isOpen={renewalModal.isOpen}
        onClose={() => setRenewalModal({ ...renewalModal, isOpen: false })}
        programName={renewalModal.programName}
        endDate={renewalModal.endDate}
        onRenew={() => handleRenew(renewalModal.programId)}
        isRenewing={isRenewing}
      />
    </div>
  )
}