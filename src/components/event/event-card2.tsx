// components/event-card-alt.tsx
'use client'

import { EventI, EventCategory } from '@/types/event/event.types'
import { formatDate, formatEventDate } from '@/lib/utils/date'
import { Button } from '../ui/button'
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react'
import { getEventTypeConfig, getEventTypeIcon } from '@/constants/event.constant'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function EventCard2({ event }: { event: EventI }) {
    const t = useTranslations('Event')
    const EventTypeIcon = getEventTypeIcon(event.category as EventCategory)
    const typeConfig = getEventTypeConfig(event.category as EventCategory)
    const router = useRouter()
    
    const stripHtml = (html: string) => {
        if (!html) return ''
        if (typeof window !== 'undefined') {
            const doc = new DOMParser().parseFromString(html, 'text/html')
            return doc.body.textContent || ''
        }
        return html.replace(/<[^>]*>/g, '')
    }
    
    const cleanDescription = stripHtml(event.description || '')

    // Format date for display: "12" and "JUN 2024"
    const dateParts = formatDate(event.date_start).split(' ')
    const day = dateParts[0] || '12'
    const monthYear = dateParts.slice(1).join(' ') || 'JUN 2024'

    return (
        <Link href={`/events/${event.title_url}`} className="group relative cursor-pointer h-full block">
            {/* Card Container */}
            <div className="relative overflow-hidden rounded-2xl bg-white border border-border transition-all duration-500 hover:shadow-xl hover:border-primary/30 h-full flex flex-col">
                
                {/* Top Accent Bar - linear */}
                <div className="h-1 w-full bg-linear-to-r from-primary via-secondary to-accent"></div>
                
                {/* Image Section */}
                <div className="relative h-48 max-[640px]:h-40 overflow-hidden shrink-0">
                    <img 
                        src={event.photoevent} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/400x300/97262C/white?text=Event';
                        }}
                    />
                
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Date Badge - Clean & Minimal */}
                    <div className="absolute bottom-3 left-3 max-[640px]:bottom-2 max-[640px]:left-2">
                        <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl px-3.5 py-2 shadow-lg border border-white/30 max-[640px]:px-2.5 max-[640px]:py-1.5">
                            {/* Day */}
                            <div className="text-center">
                                <p className="text-2xl font-extrabold text-primary leading-none max-[640px]:text-lg">
                                    {day}
                                </p>
                            </div>
                            {/* Separator */}
                            <div className="w-px h-8 bg-border/60 max-[640px]:h-6"></div>
                            {/* Month & Year */}
                            <div className="text-left">
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider max-[640px]:text-[8px]">
                                    {t('starts')}
                                </p>
                                <p className="text-xs font-semibold text-foreground max-[640px]:text-[10px]">
                                    {monthYear}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Category Badge - Top Right */}
                    <div className="absolute top-3 right-3 max-[640px]:top-2 max-[640px]:right-2">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium capitalize ${typeConfig.bgColor} ${typeConfig.color} shadow-lg backdrop-blur-sm max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[9px]`}>
                            <EventTypeIcon size={12} className="max-[640px]:size-3" />
                            {event.category}
                        </div>
                    </div>

                    {/* Location - Right Bottom */}
                    <div className="absolute bottom-3 right-3 max-[640px]:bottom-2 max-[640px]:right-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-black/50 text-white backdrop-blur-sm border border-white/10 max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[9px]">
                            <MapPin size={12} className="max-[640px]:size-3" />
                            {event.city || event.province || event.location_place || 'Online'}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col max-[640px]:p-4">
                    
                    {/* Title */}
                    <h3 className="text-lg max-[640px]:text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                    </h3>
                    
                    {/* Description */}
                    <div className="flex-1 mb-3">
                        {cleanDescription.trim() ? (
                            <p className="text-sm text-muted-foreground line-clamp-2 max-[640px]:text-xs">
                                {cleanDescription.length > 100 ? cleanDescription.slice(0, 100) + '...' : cleanDescription}
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground/80 italic max-[640px]:text-xs">
                                {t('checkDetails')}
                            </p>
                        )}
                    </div>

                    {/* Bottom Row: Info + Button in same row */}
                    <div className="flex items-center gap-2 max-[640px]:flex-wrap">
                        {/* Date & Location Info */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg">
                                <Calendar size={13} className="text-primary/70 max-[640px]:size-3" />
                                <span className="font-medium text-foreground text-xs max-[640px]:text-[10px]">
                                    {formatEventDate(event.date_end)}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg max-[640px]:hidden">
                                <MapPin size={13} className="text-accent/70 max-[640px]:size-3" />
                                <span className="font-medium text-foreground text-xs truncate max-w-20">
                                    {event.location_place || t('onlineEvent')}
                                </span>
                            </div>
                        </div>
                        
                        {/* Button - Inline with info */}
                        <Button 
                            className="btn-outline-secondary shrink-0 group/btn rounded-lg text-[12px]! px-2! py-1.5! h-auto"
                            onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/events/${event.title_url}`)
                            }}
                        >
                            <span>{t('viewDetails')}</span>
                            <ArrowRight size={13} className="transition-transform duration-300 group-hover/btn:translate-x-1 max-[640px]:size-3" />
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    )
}