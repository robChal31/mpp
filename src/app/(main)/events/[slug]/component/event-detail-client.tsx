// app/events/[id]/event-detail-client.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getEventTypeIcon } from '@/constants/event.constant'
import { formatDateRange } from '@/lib/utils/date'
import { CheckBenefitByEventGroupResult } from '@/types/benefit/benefit.type'
import { EventCategory, EventI } from '@/types/event/event.types'
import he from 'he'
import {
  ArrowLeft,
  Building,
  Calendar,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Copy,
  Dot,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Share2,
  Ticket,
  Timer,
  X
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface EventDetailClientProps {
  event: EventI
  hasBenefit: CheckBenefitByEventGroupResult
}

interface ClaimModalData {
  isOpen: boolean
  benefitId: string
  benefitName: string
  benefitDraftId: string
  pkId: string
  availableQuota: number
  activeYear: number
}

export default function EventDetailClient({ event, hasBenefit: initialHasBenefit }: EventDetailClientProps) {
  const t = useTranslations('EventDetail')
  const router = useRouter()
  const [isSharing, setIsSharing] = useState(false)
  const [hasBenefit, setHasBenefit] = useState<CheckBenefitByEventGroupResult>(initialHasBenefit)
  const [isClaiming, setIsClaiming] = useState(false)
  const [selectedBenefitId, setSelectedBenefitId] = useState<string>('')
  const [claimModal, setClaimModal] = useState<ClaimModalData>({
    isOpen: false,
    benefitId: '',
    benefitName: '',
    benefitDraftId: '',
    pkId: '',
    availableQuota: 0,
    activeYear: 1
  })
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean
    redeemCode: string
    qty: number
    eventTitle: string
  }>({
    isOpen: false,
    redeemCode: '',
    qty: 0,
    eventTitle: ''
  })
  const [claimQty, setClaimQty] = useState<number>(1)
  const [claimDescription, setClaimDescription] = useState<string>('')

  const EventTypeIcon = getEventTypeIcon(event.category as EventCategory)

  // Parse price
  const price = parseInt(event.lowest_price) || 0
  const isFree = price === 0

  let status = 'upcoming'

  const handleShare = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: event.description?.replace(/<[^>]*>/g, '').substring(0, 100),
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert(t('linkCopied'))
      }
    } catch (error) {
      console.error('Error sharing:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const handleOpenClaimModal = () => {
    const selectedBenefit = hasBenefit?.benefits?.find(b => b.benefit.id === selectedBenefitId)
    if (!selectedBenefit) return

    setClaimModal({
      isOpen: true,
      benefitId: selectedBenefit.benefit.id,
      benefitName: selectedBenefit.benefit.name,
      benefitDraftId: selectedBenefit.benefit.id_draft,
      pkId: selectedBenefit.pk.id,
      availableQuota: selectedBenefit.benefit.active_quota.available,
      activeYear: selectedBenefit.benefit.active_quota.year || 1
    })
    setClaimQty(1)
    setClaimDescription('')
  }

  const handleClaimSubmit = async () => {
    if (claimQty < 1 || claimQty > claimModal.availableQuota) {
      toast.error(t('invalidQuantity', { max: claimModal.availableQuota }), {
        duration: 3000,
        position: 'top-center',
      })
      return
    }

    setIsClaiming(true)
    try {
      const response = await fetch('/api/mpartner/benefits/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          benefit_id: claimModal.benefitId,
          benefit_draft_id: claimModal.benefitDraftId,
          pk_id: claimModal.pkId,
          event_id: event.id_event,
          event_title: event.title,
          qty: claimQty,
          year: claimModal.activeYear,
          description: claimDescription || `${t('claimForEvent')} ${event.title}`
        })
      })

      const data = await response.json()

      if (data.status === 'success' && hasBenefit && hasBenefit.benefits) {
        const updatedBenefits = hasBenefit.benefits.map(b => {
          if (b.benefit.id === claimModal.benefitId) {
            return {
              ...b,
              benefit: {
                ...b.benefit,
                active_quota: {
                  ...b.benefit.active_quota,
                  available: b.benefit.active_quota.available - claimQty
                }
              }
            }
          }
          return b
        })

        setHasBenefit({
          ...hasBenefit,
          benefits: updatedBenefits
        })

        // Tutup modal claim, buka modal success
        setClaimModal({ ...claimModal, isOpen: false })
        setSuccessModal({
          isOpen: true,
          redeemCode: data.data.redeem_code,
          qty: claimQty,
          eventTitle: event.title
        })
        
        // Refresh setelah 5 detik
        setTimeout(() => {
          router.refresh()
        }, 5000)
      } else {
        toast.error(data.message || t('claimFailed'), {
          duration: 3000,
          position: 'top-center',
        })
      }
    } catch (error) {
      console.error('Error claiming benefit:', error)
      toast.error(t('claimError'), {
        duration: 3000,
        position: 'top-center',
      })
    } finally {
      setIsClaiming(false)
      setSelectedBenefitId('')
    }
  }

  const decodedHtml = he
    .decode(he.decode(event.description || ''))
    .replace(/<p>(&nbsp;|\s)*<\/p>/g, '')
    .replace(/\n/g, '<br />')
    
  // Get selected benefit available quota
  const selectedBenefit = hasBenefit?.benefits?.find(b => b.benefit.id === selectedBenefitId)
  const maxQty = selectedBenefit?.benefit.active_quota.available || 0

  return (
    <div className="min-h-screen">
      {successModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Success Header */}
            <div className="relative border-b border-border p-6 text-center">
              <div className="flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <h2 className="text-xl font-bold text-foreground">🎉 {t('claimSuccess')}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('claimSuccessDesc')}
                </p>
              </div>
            </div>

            {/* Success Body */}
            <div className="p-4 space-y-4">
              {/* Event Info */}
              <div className="rounded-lg bg-muted/30 p-4 text-center">
                <p className="text-xs text-muted-foreground">{t('eventTitle')}</p>
                <p className="text-sm font-semibold text-foreground">{successModal.eventTitle}</p>
              </div>

              {/* Redeem Code */}
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
                <p className="text-xs text-muted-foreground">{t('redeemCode')}</p>
                <div className="mt-1 flex items-center justify-center gap-3">
                  <code className="text-xl font-mono font-bold text-primary tracking-wider">
                    {successModal.redeemCode}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(successModal.redeemCode)
                      toast.success(t('codeCopied'))
                    }}
                    className="rounded-lg p-1.5 hover:bg-primary/10 transition-colors"
                  >
                    <Copy size={16} className="text-primary" />
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>{t('quantity')}:</span>
                <span className="font-semibold text-foreground">{successModal.qty}</span>
                <span>{successModal.qty !== 1 ? t('slots') : t('slot')}</span>
              </div>

              {/* Warning */}
              {/* <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs text-amber-700 text-center">
                  💡 {t('successNote')}
                </p>
              </div> */}
            </div>

            {/* Success Footer */}
            <div className="flex flex-col gap-2 border-t border-border p-4 sm:flex-row">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSuccessModal({ ...successModal, isOpen: false })
                }}
              >
                {t('close')}
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={() => {
                  const ticketUrl = event.is_eduhub == '1' 
                    ? `${process.env.NEXT_PUBLIC_ASTA_URL}/event-checkout?id=${event.id_event}&code=${successModal.redeemCode}&quota=${successModal.qty}` 
                    : `${process.env.NEXT_PUBLIC_HY_URL}/event/ticket/${event.title_url}?mppcode=${successModal.redeemCode}`
                  window.open(ticketUrl, '_blank')
                  // setSuccessModal({ ...successModal, isOpen: false })
                }}
              >
                <Ticket size={16} />
                {t('getTicket')}
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Claim */}
      {claimModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <Ticket size={18} className="text-primary sm:size-5" />
                <h2 className="text-base font-semibold text-foreground sm:text-lg">{t('claimBenefit')}</h2>
              </div>
              <button
                onClick={() => setClaimModal({ ...claimModal, isOpen: false })}
                className="cursor-pointer rounded-lg p-1 transition-colors hover:bg-muted"
              >
                <X size={16} className="sm:size-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-3 p-4 sm:space-y-4 sm:p-5">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-2 sm:p-3">
                <p className="text-[10px] text-muted-foreground sm:text-xs">{t('benefit')}</p>
                <p className="text-xs font-medium text-foreground sm:text-sm">{claimModal.benefitName}</p>
              </div>

              {/* Quantity Input */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs font-medium text-foreground sm:text-sm">
                  {t('quantityToClaim')}
                </label>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white sm:h-10 sm:w-10"
                    onClick={() => setClaimQty(Math.max(1, claimQty - 1))}
                    disabled={claimQty <= 1}
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    value={claimQty}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      if (!isNaN(val) && val >= 1 && val <= claimModal.availableQuota) {
                        setClaimQty(val)
                      }
                    }}
                    className="h-8 w-16 rounded-lg border border-border bg-white text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:h-10 sm:w-20"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white sm:h-10 sm:w-10"
                    onClick={() => setClaimQty(Math.min(claimModal.availableQuota, claimQty + 1))}
                    disabled={claimQty >= claimModal.availableQuota}
                  >
                    +
                  </Button>
                  <span className="text-[10px] text-muted-foreground sm:text-sm">
                    {t('available')}: {claimModal.availableQuota} {claimModal.availableQuota !== 1 ? t('slots') : t('slot')}
                  </span>
                </div>
              </div>

              <input type="hidden" name="activeYear" value={claimModal.activeYear} />

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 sm:p-3">
                <p className="text-[10px] text-amber-700 sm:text-xs">
                  { claimQty > 1 ? t('warningNoteSingular', { qty: claimQty }) : t('warningNotePlural', { qty: claimQty }) }
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-2 border-t border-border p-3 sm:gap-3 sm:p-5">
              <Button
                variant="outline"
                className="flex-1 cursor-pointer bg-gray-100 text-xs md:text-sm"
                onClick={() => setClaimModal({ ...claimModal, isOpen: false })}
              >
                {t('cancel')}
              </Button>
              <Button
                className="flex-1 md:text-sm! text-xs!"
                onClick={handleClaimSubmit}
                disabled={isClaiming || claimQty < 1 || claimQty > claimModal.availableQuota}
              >
                {isClaiming ? t('processing') : (claimQty > 1 ? t('claimButtonPlural', { qty: claimQty }) : t('claimButtonSingular', { qty: claimQty }))}
                {isClaiming ? <Loader2 size={14} className="animate-spin sm:size-4" /> : <CheckCircle size={14} className="sm:size-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: BANNER IMAGE */}
      <div className="relative w-full">
        {event.is_eduhub == '0' ? (
          <div className="relative max-h-[40vh] w-full overflow-hidden sm:max-h-[50vh] md:max-h-[60vh]">
            <img src={event.photoevent} alt={event.title} className="h-auto w-full object-cover opacity-90" style={{ maxHeight: '60vh', objectPosition: 'center' }} />
          </div>
        ) : (
          <div className="relative flex justify-center items-center max-h-[20vh] w-full overflow-hidden sm:max-h-[30vh] md:max-h-[40vh] md:h-[30vh] h-[20vh] gap-2 bg-primary/10">
              <img src={'/illustrations/event-placeholder.png'} alt={event.title} className="h-auto w-full object-cover opacity-90" style={{ maxHeight: '60vh', objectPosition: 'center' }} />
          </div>
        )}

        <div className="absolute left-3 right-3 top-3 z-20 mx-auto flex max-w-6xl justify-between sm:left-4 sm:right-4 sm:top-4 md:left-6 md:right-6 md:top-6">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="btn-outline-secondary btn-sm shadow-2xl">
            <ArrowLeft size={14} className="sm:size-4" />
            <span className="hidden sm:inline">{t('back')}</span>
          </Button>
          <div className="flex gap-1.5 sm:gap-2">
            <Button size="sm" onClick={handleShare} disabled={isSharing} className="btn-accent btn-sm shadow-2xl">
              <Share2 size={14} className="sm:size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* SECTION 2: INFO PANEL */}
      <div className="relative z-10 mx-auto -mt-6 max-w-6xl px-3 md:-mt-12">
        <Card className="border-border bg-white/90 shadow-xl backdrop-blur-sm overflow-hidden">
          <div className="md:px-8 px-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 capitalize sm:gap-3">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <Badge className={`bg-primary/10 text-primary border-0 px-2 py-0.5 sm:px-2.5 md:px-3 md:py-1.5 md:text-[11px] text-[8px]`}>
                  <EventTypeIcon size={12} className="mr-0.5 sm:mr-1 sm:size-3 md:size-3.5" />
                  {event.category}
                </Badge>
                <Badge className={`bg-accent/10 text-accent border-0 px-2 py-0.5 sm:px-2.5 md:px-3 md:py-1.5 md:text-[11px] text-[8px]`}>
                  {event.city ? <MapPin size={12} className="text-accent max-[640px]:size-3" /> : <Globe size={12} className="text-accent max-[640px]:size-3" />}
                      {event.city?.toLocaleLowerCase() || t('onlineEvent')}
                </Badge>
              </div>
            </div>

            <h1 className="font-bold text-foreground md:text-3xl text-base md:mb-6 mb-4">
              {event.title}
            </h1>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-4">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-2 sm:gap-2.5 sm:p-2.5 md:p-3">
                <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2">
                  <CalendarDays size={14} className="text-primary sm:size-4 md:size-4.5" />
                </div>
                <div>
                  <p className="md:text-xs text-[8px] text-muted-foreground">{t('date')}</p>
                  <p className="md:text-sm text-[10px] font-medium text-foreground">
                    {formatDateRange(event.date_start, event.date_end)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-2 sm:gap-2.5 sm:p-2.5 md:p-3">
                <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2">
                  <Timer size={14} className="text-primary sm:size-4 md:size-4.5" />
                </div>
                <div>
                  <p className="md:text-xs text-[8px] text-muted-foreground">{t('time')}</p>
                  <p className="md:text-sm text-[10px] font-medium text-foreground">
                    {event.time_start === '00:00:00' && event.time_end === '00:00:00' ? t('asScheduled') : `${(event.time_start)} - ${(event.time_end)}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-2 sm:gap-2.5 sm:p-2.5 md:p-3">
                <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2">
                  <Building size={14} className="text-primary sm:size-4 md:size-4.5" />
                </div>
                <div>
                  <p className="md:text-xs text-[8px] text-muted-foreground">{t('location')}</p>
                  <p className="md:text-sm text-[10px] font-medium text-foreground">
                    {event.city || event.location_place|| t('onlineEvent')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2 lg:space-y-8">
            <Card className="border-border bg-white shadow-sm md:p-6 p-4 overflow-hidden">
              {event.is_eduhub == '1' && (
                <>
                  <img src={`${event.photoevent}`} alt={event.title} className="w-full h-auto rounded-lg mb-4" />
                </>
              )}
              <div
                className="prose prose-sm max-w-none dark:prose-invert prose-p:text-sm sm:prose-p:text-base [&_img]:w-full [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_a]:block [&_a]:w-full [&_a]:no-underline"
                dangerouslySetInnerHTML={{ __html: decodedHtml || '' }}
              />
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4">
            <Card className="sticky top-24 border-border bg-white p-4 shadow-sm sm:p-5 md:p-6">
              <div className=" text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:mb-2.5 sm:h-14 sm:w-14 md:h-16 md:w-16">
                  <Ticket size={20} className="text-primary sm:size-6 md:size-7" />
                </div>
                <h3 className="text-base font-semibold text-foreground sm:text-lg">{t('readyToJoin')}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  {hasBenefit?.hasBenefit ? t('useBenefit') : t('secureSpot')}
                </p>
              </div>

              {/* Price */}
              {!hasBenefit?.hasBenefit && (
                <div className="text-center">
                  {!isFree ? (
                    <>
                      <span className="text-2xl font-bold text-foreground">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)}
                      </span>
                      <span className="text-xs text-muted-foreground"> / {t('person')}</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-primary/80">-</span>
                  )}
                </div>
              )}

              {/* Benefit Info */}
              {hasBenefit?.hasBenefit && hasBenefit.benefits && (
                <div className="rounded-lg border border-primary-200 bg-primary/5 p-2 sm:p-3">
                  <div className="mb-1 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
                    <CheckCircle size={14} className="text-primary sm:size-4" />
                    <span className="text-xs font-semibold text-primary sm:text-sm">
                      {t('benefitAvailable')}
                    </span>
                  </div>
                  <p className="mb-1.5 text-[10px] text-muted-foreground sm:mb-2 sm:text-xs">
                    {t('useBenefitToClaim')}
                  </p>
                  {hasBenefit.benefits.map((b, idx) => {
                    const remainingQuota = b.benefit.active_quota.available ?? 0
                    const cleanName = b.benefit.name.replace(/^\d+\.\s*/, '')
                    return (
                      <div key={idx} className="flex items-start gap-1.5 text-[10px]  sm:gap-2 sm:text-xs">
                        <Dot size={16} className="mt-0.5 shrink-0 text-primary sm:mt-0 sm:size-3" />
                        <div className="min-w-0 flex-1">
                          <span className="font-medium">{cleanName}</span>
                          <span className="ml-1.5 sm:ml-2 text-accent">
                            ({remainingQuota} {remainingQuota !== 1 ? t('slotsLeft') : t('slotLeft')})
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Event Details */}
              <div className="space-y-3 border-t border-border pt-3">
                <div className="flex items-center gap-2 text-xs sm:gap-2.5">
                  <Calendar size={14} className="shrink-0 text-primary sm:size-4" />
                  <span className="text-muted-foreground text-xs">
                    {formatDateRange(event.date_start, event.date_start)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:gap-2.5">
                  <MapPin size={14} className="shrink-0 text-primary sm:size-4" />
                  <div>
                    <span className="block truncate text-muted-foreground text-xs">
                      {event.location_place || event.location_address || t('onlineEvent')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {hasBenefit?.hasBenefit && hasBenefit.benefits ? (
                <div className="space-y-3 border-b border-border pb-2">
                  <Select
                    value={selectedBenefitId || 'none'}
                    onValueChange={(value) => setSelectedBenefitId(value === 'none' ? '' : value)}
                  >
                    <SelectTrigger className="w-full rounded-lg border border-border bg-white p-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary sm:p-2">
                      <SelectValue placeholder={t('selectBenefit')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border border-border bg-white shadow-lg">
                      <SelectItem value="none" className="cursor-pointer text-xs hover:bg-primary/10">
                        {t('selectBenefit')}
                      </SelectItem>
                      {hasBenefit.benefits.map((b, idx) => {
                        const remainingQuota = b.benefit.active_quota.available ?? 0
                        return (
                          <SelectItem 
                            key={idx} 
                            value={b.benefit.id}
                            className="cursor-pointer text-xs hover:bg-primary/10"
                          >
                            {b.benefit.name} ({remainingQuota} {remainingQuota !== 1 ? t('slotsLeft') : t('slotLeft')})
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <Button
                    className='w-full md:btn-primary md:text-sm! text-xs!'
                    disabled={status === 'ended' || event.sales_active !== 'active' || !selectedBenefitId || maxQty === 0}
                    onClick={handleOpenClaimModal}
                  >
                    {t('claimWithBenefit')}
                    <ChevronRight size={14} className="sm:size-4" />
                  </Button>
                  {selectedBenefitId && maxQty === 0 && (
                    <p className="text-center text-[10px] text-destructive sm:text-xs">
                      {t('noSlotsAvailable')}
                    </p>
                  )}
                </div>
              ) : (
                <Button
                  size="lg"
                  className="w-full gap-1.5 bg-linear-to-r from-primary to-primary/80 text-xs hover:from-primary/90 hover:to-primary/70 sm:gap-2 sm:text-sm cursor-pointer"
                  disabled={status === 'ended' || event.sales_active !== 'active'}
                  onClick={() => {
                    if (event.order_link) {
                      window.open(event.order_link, '_blank')
                    }
                  }}
                >
                  {status === 'ended'
                    ? t('eventEnded')
                    : event.sales_active !== 'active'
                      ? t('registrationClosed')
                      : t('registerNow')
                  }
                  <ChevronRight size={14} className="sm:size-4" />
                </Button>
              )}

              {/* Contact Info */}
              <div>
                <p className="text-center text-[11px] text-muted-foreground">
                  {t('haveQuestions')}
                </p>
                <div className="flex flex-col">
                  <a href="mailto:contact@mentarigroups.com"
                    className="group flex items-center justify-center gap-1.5 rounded-lg bg-muted/50 p-1.5 transition-colors hover:bg-primary/10">
                    <Mail size={12} className="text-primary transition-transform group-hover:scale-110 sm:size-3.5" />
                    <span className="text-[10px] text-primary/70 transition-colors group-hover:text-primary sm:text-xs">
                      contact@mentarigroups.com
                    </span>
                  </a>
                  {/* <a href="https://wa.me/628558881948" target="_blank" rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-1.5 rounded-lg bg-muted/50 p-1.5 transition-colors hover:bg-primary/10">
                    <MessageCircle size={12} className="text-primary transition-transform group-hover:scale-110 sm:size-3.5" />
                    <span className="text-[10px] text-foreground transition-colors group-hover:text-primary sm:text-xs">
                      +62 855-8881-948
                    </span>
                  </a> */}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}