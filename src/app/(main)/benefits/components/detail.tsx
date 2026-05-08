'use client'

import { useState, useEffect, JSX } from 'react'
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
  AlertCircle,
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
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { EventI } from '@/types/event/event.types'
import { formatDate, formatDateTime } from '@/lib/utils/date'
import { getEventDetailByRedeemCode } from '@/server/services/hy/event.service'
import { BenefitDetailI, EventByRedeemCodeI, PK, UsageHistory } from '@/types/benefit/benefit.type'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

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

// ============ HELPER FUNCTIONS ============
const getBenefitIcon = (type: string, size: number = 20) => {
  const icons: Record<string, JSX.Element> = {
    'Curriculum & Training': <BookOpen size={size} />,
    'Guest English Teacher': <Mic size={size} />,
    'Pengembangan Pimpinan': <Briefcase size={size} />,
    'Training Kolektif Online': <Globe size={size} />,
    'Training Kolektif Offline': <Users size={size} />,
    'Masterclass Digital': <TrendingUp size={size} />,
    'Pelajar Berkreasi': <Trophy size={size} />,
    'Jambore': <Star size={size} />
  }
  return icons[type] || <Gift size={size} />
}

const getDetailColor = (type: string) => {
  const colors: Record<string, string> = {
    'Curriculum & Training': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
    'Guest English Teacher': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800',
    'Pengembangan Pimpinan': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800',
    'Training Kolektif Online': 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-800',
    'Training Kolektif Offline': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
    'Masterclass Digital': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
    'Pelajar Berkreasi': 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800',
    'Jambore': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800'
  }
  return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
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
  const detailColor = getDetailColor(benefit.type)
  const totalQuota = benefit.active_quota?.available || 0;
  
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

  const onBack = () => {
    window.history.back()
  }

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

  // Fetch related events
  useEffect(() => {
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
  }, [benefit])

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft size={16} /> {t('backToBenefits')}
        </Button>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <X size={16} />
        </Button>
      </div>

      {/* Benefit Main Card */}
      <Card className="p-0 overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300">
        <div className={`h-1 w-full bg-linear-to-r ${detailColor.split(' ')[0]} to-primary/50`} />
        
        <div className="p-5">
          <div className="flex items-start gap-4 -mt-2">
            <div className={`p-3 rounded-xl ${detailColor} shrink-0 shadow-sm`}>
              {getBenefitIcon(benefit.type, 24)}
            </div>
            <div className="flex-1">
              <h1 className="md:text-2xl text-lg font-bold text-foreground mb-1">
                {benefit.benefit_name}
              </h1>
              <p className="md:text-sm text-xs text-muted-foreground line-clamp-2">
                {benefit.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {benefit.subject_benefit && <Badge variant="default" className="text-[10px]">{benefit.subject_benefit}</Badge>}
            {expired && <Badge variant="destructive">{t('expired')}</Badge>}
            <Badge variant="outline" className="text-[10px] font-mono">
              {pk.no_pk}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-border/50">
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{t('availableSlots')}</p>
              <p className="md:text-2xl text-lg font-bold text-foreground">{totalQuota}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{t('validUntil')}</p>
              <p className={`md:text-sm text-sm font-semibold ${expired ? 'text-red-500' : 'text-foreground'}`}>
                {formatDate(pk.expired_at)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events" className="gap-2 md:text-sm text-xs">
            <Ticket size={16} />
            {t('events')}
            {relatedEvents.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {relatedEvents.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 md:text-sm text-xs">
            <History size={16} />
            {t('usageHistory')}
            {usages.length > 0 && (
              <Badge variant="outline" className="ml-1 text-xs">
                {usages.length}
              </Badge>
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
              <div className="space-y-3">
                {relatedEvents.map((event) => (
                  <div key={event.id_event} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors gap-3">
                    <div className="flex items-center gap-3 flex-1">
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
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1 shrink-0">
                            <Calendar size={10} /> {formatDate(event.date_start)}
                          </span>
                          <span className="flex items-center gap-1 shrink-0">
                            <MapPin size={10} /> {event.location_address || event.location_place || t('online')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
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

        {/* Tab: Usage History */}
        <TabsContent value="history" className="mt-4">
          <Card className="p-5">
            {loadingHistoryEvents ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : usageHistoryWithEvents.length > 0 ? (
              <div className="space-y-3">
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
                              className="gap-1 text-xs h-8 border-amber-300 text-amber-700 hover:text-orange-400 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400"
                              onClick={() => handleOpenReclaimModal(history, remainingUnused)}
                            >
                              <RefreshCw size={12} />
                              <span className="max-[640px]:hidden">{t('moveSlots', { count: remainingUnused })}</span>
                              <span className="hidden max-[640px]:inline">{t('move', { count: remainingUnused })}</span>
                            </Button>
                          )}
                          <button
                            onClick={() => toggleExpand(history.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted/30 transition-colors"
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
          <div className="bg-background rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <RefreshCw size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{t('moveToAnotherEvent')}</h2>
              </div>
              <button
                onClick={() => setReclaimModal({ ...reclaimModal, isOpen: false })}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
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
                        className="p-1 rounded-full hover:bg-muted transition-colors"
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
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
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
                      className="h-10 w-10"
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
                      className="w-20 h-10 text-center rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
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
                className="flex-1"
                onClick={() => setReclaimModal({ ...reclaimModal, isOpen: false })}
              >
                {t('cancel')}
              </Button>
              <Button
                className="flex-1 gap-2 bg-linear-to-r from-primary to-primary/80"
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

      {/* How to Claim Card */}
      <Card className="p-5 bg-linear-to-r from-blue-50/50 to-transparent dark:from-blue-950/20 border border-blue-100 dark:border-blue-900/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 shrink-0">
            <Info size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{t('howToClaim')}</p>
            <div className="mt-2 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-[10px] font-bold">1</span>
                <span>{t('step1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-[10px] font-bold">2</span>
                <span>{t('step2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-[10px] font-bold">3</span>
                <span>{t('step3')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-[10px] font-bold">4</span>
                <span>{t('step4')}</span>
              </div>
            </div>
            
            <div className="mt-3 pt-2 flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Layers size={12} className="text-primary" />
                <span className="text-muted-foreground">{totalQuota} {totalQuota !== 1 ? t('slots') : t('slot')} {t('available')}</span>
              </div>
              {relatedEvents.length > 0 && (
                <div className="flex items-center gap-1">
                  <Ticket size={12} className="text-primary" />
                  <span className="text-muted-foreground">{relatedEvents.length} {relatedEvents.length !== 1 ? t('eligibleEvents') : t('eligibleEvent')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}