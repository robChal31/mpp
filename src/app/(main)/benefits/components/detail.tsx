'use client'

import { useState, useEffect, JSX, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Calendar,
  CheckCircle,
  Loader2,
  Clock,
  ArrowLeft,
  X,
  History,
  Ticket,
  MapPin,
  ExternalLink,
  Info,
  Layers,
  Gift,
  BookOpen,
  Users,
  TrendingUp,
  Trophy,
  Briefcase,
  Globe,
  Mic,
  Star,
  ChevronRight,
  RefreshCw,
  FileText,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { EventI } from '@/types/event/event.types'
import { formatDate, formatDateTime } from '@/lib/utils/date'
import { getEventDetailByRedeemCode } from '@/server/services/hy/event.service'
import { BenefitDetailI, EventByRedeemCodeI, PK, UsageHistory } from '@/types/benefit/benefit.type'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import OnBoardingTour from '@/components/OnboardingTour'
import { HowToClaim } from '@/components/benefit/how-to-claim'
import { BenefitMainCard } from '@/components/benefit/benefit-main-card'

interface BenefitDetailProps {
  data: {
    benefit: BenefitDetailI
    pk: PK
    usages: UsageHistory[]
  }
}

interface ReclaimModalData {
  isOpen: boolean
  historyId: string
  oldEventId: string
  remainingUnused: number
  maxMovable: number
  usedQty: number
}

const isExpired = (expiredAt: string) => {
  return new Date(expiredAt) < new Date()
}

export default function BenefitDetail({ data }: BenefitDetailProps) {
  const t = useTranslations('BenefitDetail')
  const { benefit, pk, usages } = data;
  const [relatedEvents, setRelatedEvents] = useState<EventI[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [usageHistoryWithEvents, setUsageHistoryWithEvents] = useState<UsageHistory[]>([])
  const [loadingHistoryEvents, setLoadingHistoryEvents] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [selectedEvent, setSelectedEvent] = useState<EventByRedeemCodeI | null>(null)
  
  const expired = isExpired(pk.expired_at)
  const totalQuota = benefit.active_quota?.available || 0;

  // Cek apakah benefit ini claimable atau view only
  const isClaimable = benefit.redeemable
  
  const [reclaimModal, setReclaimModal] = useState<ReclaimModalData>({
    isOpen: false,
    historyId: '',
    oldEventId: '',
    remainingUnused: 0,
    maxMovable: 0,
    usedQty: 0
  })
  const [selectedNewEventId, setSelectedNewEventId] = useState<string>('')
  const [isReclaiming, setIsReclaiming] = useState(false)
  const [reclaimQty, setReclaimQty] = useState<number>(1)

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleOpenReclaimModal = (history: UsageHistory, remainingUnused: number) => {
    setReclaimModal({
      isOpen: true,
      historyId: history.id,
      oldEventId: Array.isArray(history.event) ? history.event?.[0]?.id_event : '',
      remainingUnused: remainingUnused,
      usedQty: Array.isArray(history.event) ? (history.event?.[0]?.qty || 0) : 0,
      maxMovable: remainingUnused
    })

    const eventData = Array.isArray(history.event) && history.event.length > 0 ? history.event[0] : null;
    setSelectedEvent(eventData || null)
    setSelectedNewEventId('')
    setReclaimQty(Math.min(1, remainingUnused))
  }

  const handleReclaimSubmit = async () => {
    if (!selectedNewEventId) {
      toast.error(t('selectNewEvent'))
      return
    }
    if (reclaimQty < 1 || reclaimQty > reclaimModal.maxMovable) {
      toast.error(t('invalidQuantity', { max: reclaimModal.maxMovable }))
      return
    }
    setIsReclaiming(true)
    try {
      const response = await fetch('/api/mpartner/benefits/reclaim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history_id: reclaimModal.historyId,
          old_event_id: reclaimModal.oldEventId,
          new_event_id: selectedNewEventId,
          qty: reclaimQty,
          usedQty: reclaimModal.usedQty,
          benefit_id: benefit.id_benefit_list,
          benefit_draft_id: benefit.id_draft,
          pk_id: pk.id
        })
      })

      const data = await response.json()

      if (data.status === 'success') {
        toast.success(t('moveSuccess'))
        setReclaimModal({ ...reclaimModal, isOpen: false })
        window.location.reload()
      } else {
        toast.error(data.message || t('moveFailed'))
      }
    } catch (error) {
      console.error('Error reclaiming benefit:', error)
      toast.error(t('moveError'))
    } finally {
      setIsReclaiming(false)
    }
  }

  // Fetch related events (hanya untuk claimable)
  useEffect(() => {
    if (!isClaimable) return
    
    const loadRelatedEvents = async () => {
      setLoadingEvents(true)
      try {
        const group = benefit.subbenefit_group
        const subject = benefit.subject_benefit
        const event_group_code = benefit.event_group_code

        const res = await fetch(`/api/hy/event?type=${encodeURIComponent(group)}&subject=${encodeURIComponent(subject)}&event_group=${encodeURIComponent(event_group_code)}`)
        const data = await res.json()
        
        if (data.status === 'success' && data.data) {
          setRelatedEvents(data.data)
        } else {
          setRelatedEvents([])
        }
      } catch (err) {
        console.error('Error loading related events:', err)
        setRelatedEvents([])
      } finally {
        setLoadingEvents(false)
      }
    }

    loadRelatedEvents()
  }, [benefit, isClaimable])

  // Fetch event details for each usage history
  useEffect(() => {
    loadHistoryEvents()
  }, [usages])

  const loadHistoryEvents = async () => {
    if (!usages || usages.length === 0) return
    
    setLoadingHistoryEvents(true)
    try {
      const enrichedHistory = await Promise.all(
        usages.map(async (history) => {
          if (history.redeem_code) {
            const eventDetail = await getEventDetailByRedeemCode(history.redeem_code)
            return { ...history, event: eventDetail || undefined }
          }
          return { ...history, event: undefined }
        })
      )
      setUsageHistoryWithEvents(enrichedHistory)
    } catch (err) {
      console.error('Error loading history events:', err)
      setUsageHistoryWithEvents(usages.map(h => ({ ...h, event: undefined })))
    } finally {
      setLoadingHistoryEvents(false)
    }
  }

  const steps = useMemo(() => [
    {
      target: "main",
      title: t('tour.welcome.title'),
      content: t('tour.welcome.content'),
      disableBeacon: false,
      placement: "center",
    },
    {
      target: "#benefit-detail-header",
      title: t('tour.navigation.title'),
      content: t('tour.navigation.content'),
      placement: "bottom",
    },
    {
      target: "#benefit-detail-main-card",
      title: t('tour.benefitCard.title'),
      content: t('tour.benefitCard.content'),
      placement: "top",
    },
    {
      target: "#benefit-detail-quota",
      title: t('tour.quotaInfo.title'),
      content: t('tour.quotaInfo.content'),
      placement: "bottom",
    },
    {
      target: "#benefit-detail-tabs",
      title: t('tour.tabs.title'),
      content: t('tour.tabs.content'),
      placement: "top",
    },
    {
      target: "#benefit-detail-tab-events",
      title: t('tour.eventsTab.title'),
      content: t('tour.eventsTab.content'),
      placement: "bottom",
    },
    {
      target: "#benefit-detail-tab-history",
      title: t('tour.historyTab.title'),
      content: t('tour.historyTab.content'),
      placement: "bottom",
    },
    {
      target: "#benefit-detail-how-to-claim",
      title: t('tour.howToClaim.title'),
      content: t('tour.howToClaim.content'),
      placement: "top",
    },
  ], [t])

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <OnBoardingTour pageName='claim-benefits' steps={steps} />
      
      {/* Header */}
      <div id="benefit-detail-header" className="flex items-center justify-between">
        <Button variant="outline" size="sm" className='bg-gray-100'>
          <Link href="/benefits" className='flex items-center gap-2'>
            <ArrowLeft size={16} /> {t('backToBenefits')}
          </Link>
        </Button>
        <Button variant="ghost" size="sm">
          <Link href="/benefits">
            <X size={16} />
          </Link>
        </Button>
      </div>

      {/* Benefit Main Card */}
      <BenefitMainCard 
        benefit={benefit}
        pk={pk}
        totalQuota={totalQuota}
        expired={expired}
      />

      {/* ====== VIEW ONLY ====== */}
      {!isClaimable ? (
        <div className="space-y-4">
          
          {/* Usage History - Simplified untuk View Only */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <History size={18} className="text-[#3279FF]" />
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('usageHistory')}</h3>
              {usages.length > 0 && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-[#3279FF]/10 text-[#3279FF] text-xs font-medium">
                  {usages.length} {t('entries')}
                </span>
              )}
            </div>
            
            {loadingHistoryEvents ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : usageHistoryWithEvents.length > 0 ? (
              <div className="space-y-3">
                {usageHistoryWithEvents.map((history: UsageHistory) => {
                  const qtyUsed = history.qty1 != 0 ? history.qty1 : history.qty2 != 0 ? history.qty2 : history.qty3
                  
                  return (
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#3279FF]/20 transition-colors" key={history.id}>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                              <FileText size={16} className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                                {history.description?.split('\n')[0] || benefit.benefit_name || t('benefitUsed')}
                              </p>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1.5">
                                  <Clock size={12} className="text-gray-400" />
                                  {formatDateTime(history.used_at)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Users size={12} className="text-gray-400" />
                                  {qtyUsed} {qtyUsed !== 1 ? t('slots') : t('slot')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-[10px] shrink-0 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            {t('completed')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                  <History size={28} className="opacity-30" />
                </div>
                <p>{t('noUsageHistory')}</p>
                <p className="text-xs mt-1">{t('historyWillAppear')}</p>
              </div>
            )}
          </Card>
        </div>
      ) : (
        /* ====== CLAIMABLE ====== */
        <>
          {/* Tabs untuk Claimable */}
          <Tabs id="benefit-detail-tabs" defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-2 gap-1 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl">
              <TabsTrigger 
                id="benefit-detail-tab-events" 
                value="events" 
                className="gap-2 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm data-[state=active]:text-[#3279FF] data-[state=inactive]:text-gray-500 hover:data-[state=inactive]:text-gray-700 cursor-pointer"
              >
                <Ticket size={16} className="data-[state=active]:text-[#3279FF]" />
                <span>{t('events')}</span>
                {relatedEvents.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#3279FF]/10 text-[#3279FF] text-[10px] font-bold">
                    {relatedEvents.length}
                  </span>
                )}
              </TabsTrigger>
              
              <TabsTrigger 
                id="benefit-detail-tab-history" 
                value="history" 
                className="gap-2 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm data-[state=active]:text-[#3279FF] data-[state=inactive]:text-gray-500 hover:data-[state=inactive]:text-gray-700 cursor-pointer"
              >
                <History size={16} className="data-[state=active]:text-[#3279FF]" />
                <span>{t('usageHistory')}</span>
                {usages.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#FFB347]/10 text-[#FFB347] text-[10px] font-bold">
                    {usages.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Tab: Eligible Events */}
            <TabsContent value="events" className="mt-4">
              <Card className="p-5">
                {loadingEvents ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : relatedEvents.length > 0 ? (
                  <div id="benefit-detail-events-list" className="space-y-3 max-h-100 overflow-y-auto pr-2 scrollbar-thin">
                    {relatedEvents.map((event) => (
                      <div key={event.id_event} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                            <img
                              src={event.photoevent}
                              alt={event.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm sm:text-xs line-clamp-2">
                              {event.title}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                              <span className="flex items-center gap-1 shrink-0">
                                <Calendar size={10} /> {formatDate(event.date_start)}
                              </span>
                              <span className="flex items-center gap-1 min-w-0 max-w-[70%]">
                                <MapPin size={10} className="shrink-0" />
                                <span className="truncate">{event.location_address || event.location_place || t('online')}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="gap-1 cursor-pointer w-full sm:w-auto shrink-0"
                          asChild
                        >
                          <Link href={`/events/${event.title_url}`}>
                            {t('view')} <ExternalLink size={12} />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Ticket size={32} className="mx-auto mb-2 opacity-30" />
                    <p>{t('noEventsAvailable')}</p>
                    <p className="text-xs mt-1">{t('checkBackLater')}</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Tab: Usage History - Full dengan Reclaim */}
            <TabsContent value="history" className="mt-4">
              <Card className="p-5">
                {loadingHistoryEvents ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : usageHistoryWithEvents.length > 0 ? (
                  <div id="benefit-detail-history-list" className="space-y-3 max-h-100 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#3279FF]/30 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 hover:scrollbar-thumb-[#3279FF]/50">
                    {usageHistoryWithEvents.map((history: UsageHistory) => {
                      const qtyUsed = history.qty1 != 0 ? history.qty1 : history.qty2 != 0 ? history.qty2 : history.qty3
                      const participants = Array.isArray(history.event) ? history.event : [] 
                      const hasParticipants = Array.isArray(participants) && participants.length > 0
                      const isItemExpanded = expandedItems[history.id] || false
                      
                      const remainingUnused = qtyUsed - participants.length
                      const canReclaim = remainingUnused > 0;
                      return (
                        <div className="rounded-lg border border-border" key={history.id}>
                          <div className="w-full flex items-center justify-between p-3 text-left max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-2">
                            <div className="flex items-center gap-3 flex-1 min-w-0 max-[640px]:w-full">
                              <div className={`p-2 rounded-lg shrink-0 ${
                                  remainingUnused > 0
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                <CheckCircle size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm line-clamp-2">
                                  {Array.isArray(history.event) ? (history.event[0]?.event_name || benefit.benefit_name) : history.description?.split('\n')[0] || t('benefitUsed')}
                                </p>
                                <p className="text-[11px] text-muted-foreground max-[640px]:text-[10px]">{t('voucherCode')}: <span className="font-semibold">{history.redeem_code}</span></p>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground max-[640px]:text-[10px]">
                                  <span className="flex items-center gap-1">
                                    <Clock size={10} /> {formatDateTime(history.used_at)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users size={10} /> {qtyUsed} {qtyUsed !== 1 ? t('slots') : t('slot')}
                                  </span>
                                  {hasParticipants && (
                                    <span className="flex items-center gap-1 text-green-600">
                                      ✅ {participants.length} {t('used')}
                                    </span>
                                  )}
                                  {remainingUnused > 0 && (
                                    <span className="flex items-center gap-1 text-amber-600">
                                      ⏳ {remainingUnused} {t('unused')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 max-[640px]:w-full max-[640px]:justify-end">
                              {canReclaim && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1 text-xs h-8 border-amber-300 text-amber-700 hover:text-orange-400 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 cursor-pointer"
                                  onClick={() => handleOpenReclaimModal(history, remainingUnused)}
                                >
                                  <RefreshCw size={12} />
                                  <span className="max-[640px]:hidden">{t('moveSlots', { count: remainingUnused })}</span>
                                  <span className="hidden max-[640px]:inline">{t('move', { count: remainingUnused })}</span>
                                </Button>
                              )}
                              <button
                                onClick={() => toggleExpand(history.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted/30 transition-colors cursor-pointer"
                              >
                                <ChevronRight 
                                  size={16} 
                                  className={`text-muted-foreground transition-transform duration-200 shrink-0 ${isItemExpanded ? 'rotate-90' : ''}`}
                                />
                              </button>
                            </div>
                          </div>
                          {isItemExpanded && (
                            <div className="border-t border-border p-3 space-y-2 bg-muted/10">
                              <p className="text-xs font-medium text-foreground">{t('participantsList', { count: participants.length })}</p>
                              {hasParticipants && participants.map((p: EventByRedeemCodeI, i) => (
                                <div key={i} className="text-sm py-1 border-b border-border/50 last:border-0">
                                  <div className="font-medium max-[640px]:text-xs">{p.fullname}</div>
                                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 mt-0.5 max-[640px]:text-[10px]">
                                    <span>✉️ {p.email}</span>
                                    {p.phone && <span>📞 {p.phone}</span>}
                                  </div>
                                </div>
                              ))}
                              {!hasParticipants && (
                                <div className="text-sm text-muted-foreground max-[640px]:text-xs">
                                  {t('noParticipantsUsed')} {qtyUsed} {qtyUsed !== 1 ? t('slots') : t('slot')} {t('stillAvailable')}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <History size={32} className="mx-auto mb-2 opacity-30" />
                    <p>{t('noUsageHistory')}</p>
                    <p className="text-xs mt-1">{t('historyWillAppear')}</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          {/* Modal Reclaim / Move Event */}
          {reclaimModal.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <div className="flex items-center gap-2">
                    <RefreshCw size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">{t('moveToAnotherEvent')}</h2>
                  </div>
                  <button
                    onClick={() => setReclaimModal({ ...reclaimModal, isOpen: false })}
                    className="p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <p className="text-xs text-muted-foreground">{t('originalEvent')}</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedEvent?.event_name || t('unknown')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('unusedSlots')}: {reclaimModal.remainingUnused}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{t('selectNewEvent')}</label>
                    
                    {selectedNewEventId ? (
                      <div className="relative">
                        <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-primary bg-primary/5">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                            {relatedEvents.find(e => e.id_event === selectedNewEventId)?.photoevent ? (
                              <img 
                                src={relatedEvents.find(e => e.id_event === selectedNewEventId)?.photoevent} 
                                alt="" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Calendar size={20} className="text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">
                              {relatedEvents.find(e => e.id_event === selectedNewEventId)?.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span className="flex items-center gap-1">
                                <Calendar size={10} />
                                {formatDate(relatedEvents.find(e => e.id_event === selectedNewEventId)?.date_start || '')}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={10} />
                                {relatedEvents.find(e => e.id_event === selectedNewEventId)?.location_place || t('online')}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedNewEventId('')}
                            className="p-1 rounded-full hover:bg-muted transition-colors cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                        {relatedEvents.map((event) => (
                          <button
                            key={event.id_event}
                            onClick={() => setSelectedNewEventId(event.id_event)}
                            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                              {event.photoevent ? (
                                <img 
                                  src={event.photoevent} 
                                  alt={event.title} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <Ticket size={20} className="text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm text-foreground line-clamp-1">{event.title}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Calendar size={10} />
                                  {formatDate(event.date_start)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin size={10} />
                                  {event.location_place || t('online')}
                                </span>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}

                    {relatedEvents.length === 0 && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <p className="text-sm text-muted-foreground">{t('noRelatedEvents')}</p>
                      </div>
                    )}
                  </div>

                  {selectedNewEventId && (
                    <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                      <label className="text-sm font-medium text-foreground">
                        {t('quantityToMove', { max: reclaimModal.maxMovable })}
                      </label>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 cursor-pointer bg-white"
                          onClick={() => setReclaimQty(Math.max(1, reclaimQty - 1))}
                          disabled={reclaimQty <= 1}
                        >
                          -
                        </Button>
                        <input
                          type="number"
                          value={reclaimQty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value)
                            if (!isNaN(val) && val >= 1 && val <= reclaimModal.maxMovable) {
                              setReclaimQty(val)
                            }
                          }}
                          className="w-20 h-10 text-center rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 cursor-pointer bg-white"
                          onClick={() => setReclaimQty(Math.min(reclaimModal.maxMovable, reclaimQty + 1))}
                          disabled={reclaimQty >= reclaimModal.maxMovable}
                        >
                          +
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {t('available')}: {reclaimModal.maxMovable} {reclaimModal.maxMovable !== 1 ? t('slots') : t('slot')}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      ⚠️ {reclaimQty === 1 
                        ? t('warningMoveMessageSingular', { qty: reclaimQty }) 
                        : t('warningMoveMessagePlural', { qty: reclaimQty })
                      }
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-5 border-t border-border">
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer bg-gray-200"
                    onClick={() => setReclaimModal({ ...reclaimModal, isOpen: false })}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    className="flex-1 cursor-pointer gap-2 bg-linear-to-r from-primary to-primary/80"
                    onClick={handleReclaimSubmit}
                    disabled={isReclaiming || !selectedNewEventId || reclaimQty < 1}
                  >
                    {isReclaiming ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    {isReclaiming ? t('processing') : t('moveEvent')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* How to Claim Card - hanya untuk claimable */}
      {isClaimable && (
        <HowToClaim 
          totalQuota={totalQuota} 
          relatedEventsCount={relatedEvents.length}
          expired={expired}
        />
      )}
    </div>
  )
}