// app/events/[id]/event-detail-client.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Ticket,
  CalendarDays,
  Timer,
  Mail,
  MessageCircle,
  Building,
  X,
  Loader2
} from 'lucide-react'
import { EventI, EventCategory } from '@/types/event/event.types'
import { formatDate } from '@/lib/utils/date'
import { getEventTypeConfig, getEventTypeIcon } from '@/constants/event.constant'
import he from 'he'
import { CheckBenefitByEventGroupResult } from '@/types/benefit/benefit.type'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

export default function EventDetailClient({ event, hasBenefit }: EventDetailClientProps) {
  const t = useTranslations('EventDetail')
  const router = useRouter()
  const [isSharing, setIsSharing] = useState(false)
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
  const [claimQty, setClaimQty] = useState<number>(1)
  const [claimDescription, setClaimDescription] = useState<string>('')

  const EventTypeIcon = getEventTypeIcon(event.category as EventCategory)
  const typeConfig = getEventTypeConfig(event.category as EventCategory)

  // Parse price
  const price = parseInt(event.lowest_price) || 0
  const isFree = price === 0

  // Determine event status
  const now = new Date()
  const startDate = new Date(event.date_start)
  const endDate = new Date(event.date_end)

  let status = 'upcoming'
  let statusColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
  let statusIcon = <Clock size={14} />
  let statusText = t('upcoming')

  if (now > endDate) {
    status = 'ended'
    statusColor = 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
    statusIcon = <AlertCircle size={14} />
    statusText = t('ended')
  } else if (now >= startDate && now <= endDate) {
    status = 'ongoing'
    statusColor = 'bg-primary/10 text-primary'
    statusIcon = <CheckCircle size={14} />
    statusText = t('ongoing')
  }

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

      if (data.status === 'success') {
        toast.success(
          <div>
            <div className="font-semibold">{t('claimSuccess')} 🎉</div>
            <div className="text-xs mt-1 font-mono">{t('redeemCode')}: {data.data.redeem_code}</div>
            <div className="text-xs mt-1">{t('quantity')}: {claimQty} {claimQty !== 1 ? t('slots') : t('slot')}</div>
          </div>,
          {
            duration: 5000,
            position: 'top-center',
            icon: '🎟️',
          }
        )
        setClaimModal({ ...claimModal, isOpen: false })
        setTimeout(() => {
          const ticketUrl = event.is_eduhub == '1' 
            ? `${process.env.NEXT_PUBLIC_ASTA_URL}/event-checkout?id=${event.id_event}` 
            : `${process.env.NEXT_PUBLIC_HY_URL}/event/ticket/${event.title_url}?mppcode=${data.data.redeem_code}`
          window.open(ticketUrl, '_blank')
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
    }
  }

  const decodedHtml = he
    .decode(he.decode(event.description || ''))
    .replace(/<p>(&nbsp;|\s)*<\/p>/g, '')

  // Get selected benefit available quota
  const selectedBenefit = hasBenefit?.benefits?.find(b => b.benefit.id === selectedBenefitId)
  const maxQty = selectedBenefit?.benefit.active_quota.available || 0

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/20">
      {/* Modal Claim */}
      {claimModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <Ticket size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{t('claimBenefit')}</h2>
              </div>
              <button
                onClick={() => setClaimModal({ ...claimModal, isOpen: false })}
                className="p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground">{t('benefit')}</p>
                <p className="font-medium text-foreground">{claimModal.benefitName}</p>
              </div>

              {/* Quantity Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('quantityToClaim')}
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 bg-white"
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
                    className="w-20 h-10 text-center rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 bg-white"
                    onClick={() => setClaimQty(Math.min(claimModal.availableQuota, claimQty + 1))}
                    disabled={claimQty >= claimModal.availableQuota}
                  >
                    +
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {t('available')}: {claimModal.availableQuota} {claimModal.availableQuota !== 1 ? t('slots') : t('slot')}
                  </span>
                </div>
              </div>

              <input type="hidden" name="activeYear" value={claimModal.activeYear} />

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  { claimQty > 1 ? t('warningNoteSingular', { qty: claimQty }) : t('warningNotePlural', { qty: claimQty }) }
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-5 border-t border-border">
              <Button
                variant="outline"
                className="flex-1 cursor-pointer bg-gray-100"
                onClick={() => setClaimModal({ ...claimModal, isOpen: false })}
              >
                {t('cancel')}
              </Button>
              <Button
                className="flex-1 gap-2 bg-linear-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 cursor-pointer"
                onClick={handleClaimSubmit}
                disabled={isClaiming || claimQty < 1 || claimQty > claimModal.availableQuota}
              >
                {isClaiming ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                {isClaiming ? t('processing') : (claimQty > 1 ? t('claimButtonPlural', { qty: claimQty }) : t('claimButtonSingular', { qty: claimQty }))}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: BANNER IMAGE */}
      <div className="relative w-full bg-black">
        <div className="relative w-full max-h-[60vh] max-[640px]:max-h-[40vh] overflow-hidden">
          <img src={event.photoevent} alt={event.title} className="w-full h-auto object-cover opacity-90" style={{ maxHeight: '60vh', objectPosition: 'center' }} />
        </div>

        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between max-[640px]:top-3 max-[640px]:left-3 max-[640px]:right-3">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-none shadow-lg md:text-xs text-[10px] max-[640px]:text-[8px] max-[640px]:h-7 max-[640px]:px-2 cursor-pointer">
            <ArrowLeft size={16} className="max-[640px]:size-3" />
            <span className="max-[640px]:hidden">{t('back')}</span>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} disabled={isSharing} className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-none shadow-lg max-[640px]:h-7 max-[640px]:w-7 max-[640px]:p-0 cursor-pointer">
              <Share2 size={16} className="max-[640px]:size-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* SECTION 2: INFO PANEL */}
      <div className="container mx-auto max-w-6xl px-4 -mt-8 md:-mt-12 relative z-10 max-[640px]:px-3 max-[640px]:-mt-6">
        <Card className="p-6 md:p-8 border-border shadow-xl bg-card/95 backdrop-blur-sm max-[640px]:p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 capitalize">
            <div className="flex flex-wrap items-center gap-3 max-[640px]:gap-1.5">
              <Badge className={`${typeConfig.bgColor} ${typeConfig.color} border-0 px-3 py-1.5 md:text-xs text-[8px] max-[640px]:px-2 max-[640px]:py-0.5 max-[640px]:text-[6px]`}>
                <EventTypeIcon size={14} className="mr-1 max-[640px]:size-2 max-[640px]:mr-0.5" />
                {event.category}
              </Badge>
              <Badge className={`bg-primary/10 text-primary border-0 px-3 py-1.5 md:text-xs text-[8px] max-[640px]:px-2 max-[640px]:py-0.5 max-[640px]:text-[6px]`}>
                <MapPin size={14} className="mr-1 max-[640px]:size-2 max-[640px]:mr-0.5" />
                {event.city ? event.city : (event.province ? event.province : (event.location_place ? event.location_place : t('onlineEvent')))}
              </Badge>
              <Badge className={`${statusColor} border-0 px-3 py-1.5 md:text-xs text-[8px] gap-1.5 max-[640px]:px-2 max-[640px]:py-0.5 max-[640px]:text-[6px]`}>
                {statusIcon}
                {statusText}
              </Badge>
            </div>
          </div>

          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 max-[640px]:text-base max-[640px]:mt-2">
            {event.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 max-[640px]:gap-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border max-[640px]:p-2 max-[640px]:gap-2">
              <div className="p-2 rounded-lg bg-primary/10 max-[640px]:p-1.5">
                <CalendarDays size={18} className="text-primary max-[640px]:size-3.5" />
              </div>
              <div>
                <p className="md:text-xs text-[10px] text-muted-foreground max-[640px]:text-[8px]">{t('date')}</p>
                <p className="md:text-sm text-[12px] font-medium text-foreground max-[640px]:text-[9px]">
                  {event.date_start_formatted || formatDate(event.date_start)}
                  {event.date_start !== event.date_end && ` - ${event.date_end_formatted || formatDate(event.date_end)}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border max-[640px]:p-2 max-[640px]:gap-2">
              <div className="p-2 rounded-lg bg-primary/10 max-[640px]:p-1.5">
                <Timer size={18} className="text-primary max-[640px]:size-3.5" />
              </div>
              <div>
                <p className="md:text-xs text-[10px] text-muted-foreground max-[640px]:text-[8px]">{t('time')}</p>
                <p className="md:text-sm text-[12px] font-medium text-foreground max-[640px]:text-[9px]">
                  {event.time_start === '00:00:00' && event.time_end === '00:00:00' ? t('asScheduled') : `${(event.time_start)} - ${(event.time_end)}`}
                </p>
                {event.time_start !== '00:00:00' && event.time_end !== '00:00:00' &&
                  <p className="md:text-xs text-[10px] text-muted-foreground/70 max-[640px]:text-[7px]">{event.timezone}</p>
                }
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border max-[640px]:p-2 max-[640px]:gap-2">
              <div className="p-2 rounded-lg bg-primary/10 max-[640px]:p-1.5">
                <Building size={18} className="text-primary max-[640px]:size-3.5" />
              </div>
              <div>
                <p className="md:text-xs text-[10px] text-muted-foreground max-[640px]:text-[8px]">{t('location')}</p>
                <p className="md:text-sm text-[12px] font-medium text-foreground max-[640px]:text-[9px]">
                  {event.location_place || t('onlineEvent')}
                </p>
                {event.location_address && (
                  <p className="md:text-xs text-[10px] text-muted-foreground/70 truncate max-w-50 max-[640px]:text-[7px] max-[640px]:max-w-28">
                    {event.location_address}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12 max-[640px]:px-3 max-[640px]:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-[640px]:gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8 max-[640px]:space-y-6">
            <Card className="p-6 md:p-8 border-border max-[640px]:p-4">
              <div
                className="prose prose-sm dark:prose-invert max-w-none w-full prose-p:text-sm max-[640px]:prose-p:text-xs"
                dangerouslySetInnerHTML={{ __html: decodedHtml || '' }}
              />
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 max-[640px]:space-y-4">
            <Card className="p-6 border-border sticky top-24 max-[640px]:p-4">
              <div className="text-center mb-6 max-[640px]:mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3 max-[640px]:w-12 max-[640px]:h-12 max-[640px]:mb-2">
                  <Ticket size={28} className="text-primary max-[640px]:size-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground max-[640px]:text-base">{t('readyToJoin')}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-[640px]:text-xs">
                  {hasBenefit?.hasBenefit ? t('useBenefit') : t('secureSpot')}
                </p>
              </div>

              {/* Price */}
              {!hasBenefit?.hasBenefit && (
                <div className="text-center mb-6 max-[640px]:mb-4">
                  {!isFree ? (
                    <>
                      <span className="text-3xl font-bold text-foreground max-[640px]:text-2xl">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)}
                      </span>
                      <span className="text-muted-foreground max-[640px]:text-xs"> / {t('person')}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 max-[640px]:text-xl">-</span>
                  )}
                </div>
              )}

              {/* Benefit Info */}
              {hasBenefit?.hasBenefit && hasBenefit.benefits && (
                <div className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 max-[640px]:p-2 max-[640px]:mb-4">
                  <div className="flex items-center gap-2 mb-2 max-[640px]:gap-1 max-[640px]:mb-1">
                    <CheckCircle size={16} className="text-green-600 dark:text-green-400 max-[640px]:size-3.5" />
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400 max-[640px]:text-xs">
                      {t('benefitAvailable')}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mb-2 max-[640px]:text-[10px]">
                    {t('useBenefitToClaim')}
                  </p>
                  {hasBenefit.benefits.map((b, idx) => {
                    const remainingQuota = b.benefit.active_quota.available ?? 0
                    return (
                      <div key={idx} className="text-xs text-green-600 dark:text-green-400 max-[640px]:text-[10px]">
                        <span className="font-medium">✨ {b.benefit.name}</span>
                        <span className="ml-2">({remainingQuota} {remainingQuota !== 1 ? t('slotsLeft') : t('slotLeft')})</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Event Details */}
              <div className="space-y-3 mb-6 max-[640px]:space-y-2 max-[640px]:mb-4">
                <div className="flex items-center gap-3 text-sm max-[640px:gap-2 max-[640px]:text-xs">
                  <Calendar size={16} className="text-primary shrink-0 max-[640px]:size-3.5" />
                  <span className="text-muted-foreground">
                    {formatDate(event.date_start)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm max-[640px:gap-2 max-[640px]:text-xs">
                  <MapPin size={16} className="text-primary shrink-0 max-[640px]:size-3.5" />
                  <div>
                    <span className="text-muted-foreground truncate block">
                      {event.location_place || t('onlineEvent')}
                    </span>
                    {event.location_address && (
                      <p className="text-xs text-muted-foreground/70 truncate max-w-50 max-[640px]:text-[9px] max-[640px]:max-w-32">
                        {event.location_address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {hasBenefit?.hasBenefit && hasBenefit.benefits ? (
                <div className="space-y-3 max-[640px]:space-y-2">
                  <Select
                    value={selectedBenefitId || 'none'}
                    onValueChange={(value) => setSelectedBenefitId(value === 'none' ? '' : value)}
                  >
                    <SelectTrigger className="w-full p-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary max-[640px]:text-xs max-[640px]:p-1.5">
                      <SelectValue placeholder={t('selectBenefit')} />
                    </SelectTrigger>
                    <SelectContent 
                      className="rounded-lg border border-border bg-white shadow-lg"
                      style={{ width: 'auto', minWidth: '200px', maxWidth: '400px' }}
                      // atau pake className:
                      // className="rounded-lg border border-border bg-white shadow-lg w-auto min-w-[200px] max-w-[400px]"
                    >
                      <SelectItem value="none" className="cursor-pointer hover:bg-primary/10">
                        {t('selectBenefit')}
                      </SelectItem>
                      {hasBenefit.benefits.map((b, idx) => {
                        const remainingQuota = b.benefit.active_quota.available ?? 0
                        return (
                          <SelectItem 
                            key={idx} 
                            value={b.benefit.id}
                            className="cursor-pointer hover:bg-primary/10"
                          >
                            {b.benefit.name} ({remainingQuota} {remainingQuota !== 1 ? t('slotsLeft') : t('slotLeft')})
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <Button
                    size="lg"
                    className="w-full bg-linear-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 gap-2 max-[640px:text-xs max-[640px]:py-2 max-[640px]:h-auto cursor-pointer"
                    disabled={status === 'ended' || event.sales_active !== 'active' || !selectedBenefitId || maxQty === 0}
                    onClick={handleOpenClaimModal}
                  >
                    <CheckCircle size={16} className="max-[640px]:size-3.5" />
                    {t('claimWithBenefit')}
                    <ChevronRight size={16} className="max-[640px]:size-3.5" />
                  </Button>
                  {selectedBenefitId && maxQty === 0 && (
                    <p className="text-center text-xs text-red-500 max-[640px]:text-[10px]">
                      {t('noSlotsAvailable')}
                    </p>
                  )}
                </div>
              ) : (
                <Button
                  size="lg"
                  className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary gap-2 max-[640px:text-xs max-[640px]:py-2 max-[640px]:h-auto"
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
                  <ChevronRight size={16} className="max-[640px]:size-3.5" />
                </Button>
              )}

              {/* Contact Info */}
              <div className="mt-4 pt-4 border-t border-border max-[640px]:mt-3 max-[640px]:pt-3">
                <p className="text-center text-xs text-muted-foreground mb-3 max-[640px]:text-[10px] max-[640px]:mb-2">
                  {t('haveQuestions')}
                </p>
                <div className="flex flex-col gap-2 max-[640px]:gap-1.5">
                  <a href="mailto:contact@mentarigroups.com"
                    className="flex items-center justify-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors group max-[640px]:p-1.5">
                    <Mail size={14} className="text-primary group-hover:scale-110 transition-transform max-[640px]:size-3" />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors max-[640px]:text-[10px]">
                      contact@mentarigroups.com
                    </span>
                  </a>
                  <a href="https://wa.me/628558881948" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors group max-[640px]:p-1.5">
                    <MessageCircle size={14} className="text-green-500 group-hover:scale-110 transition-transform max-[640px]:size-3" />
                    <span className="text-sm text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors max-[640px]:text-[10px]">
                      +62 855-8881-948
                    </span>
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}