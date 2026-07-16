// components/event-card-alt.tsx
'use client'

import { getEventTypeConfig, getEventTypeIcon } from '@/constants/event.constant'
import { formatDateRange } from '@/lib/utils/date'
import { EventCategory, EventI } from '@/types/event/event.types'
import { ArrowRight, Calendar, Globe, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

export function EventCard({ event }: { event: EventI }) {
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

    return (
        <Link href={`/events/${event.title_url}`} className="group relative cursor-pointer h-full block">
            {/* Card Container */}
            <div className="relative overflow-hidden rounded-2xl bg-white border border-border transition-all duration-500 hover:shadow-xl hover:border-primary/30 h-full flex flex-col shadow-lg">
                
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

                    {/* Category Badge - Top Right */}
                    <div className="absolute top-3 left-3 max-[640px]:top-2 max-[640px]:right-2">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-secondary/80 text-white backdrop-blur-sm border border-white/10 max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[9px]`}>
                            <EventTypeIcon size={12} className="max-[640px]:size-3" />
                            {event.category}
                        </div>
                    </div>

                    {/* Location - Right Bottom */}
                    <div className="absolute top-3 right-3 max-[640px]:bottom-2 max-[640px]:right-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-accent/80 text-white backdrop-blur-sm border border-white/10 max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[9px]">
                            <Calendar size={12} />   
                            {formatDateRange(event.date_start, event.date_end)}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-5 py-3 flex-1 flex flex-col max-[640px]:p-4">
                    {/* Title */}
                    <h3 className="md:text-lg text-sm font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                    </h3>
                    
                    {/* Description */}
                    <div className="flex-1 mb-3">
                        {cleanDescription.trim() ? (
                            <p className="md:text-sm text-[11px] text-muted-foreground line-clamp-2">
                                {cleanDescription.length > 100 ? cleanDescription.slice(0, 100) + '...' : cleanDescription}
                            </p>
                        ) : (
                            <p className="md:text-sm text-[11px] text-muted-foreground/80 italic">
                                {t('checkDetails')}
                            </p>
                        )}
                    </div>

                    {/* Bottom Row: Info + Button in same row */}
                    <div className="flex items-center justify-between gap-2 my-2 mt-3 pt-3 border-t border-border">
                    
                        {/* Date & Location Info */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                            <div className="flex items-center gap-1.5 bg-accent/10 px-2.5 py-1.5 rounded-lg">
                                {event.city ? <MapPin size={13} className="text-accent max-[640px]:size-3" /> : <Globe size={13} className="text-accent max-[640px]:size-3" />}
                                <span className="font-medium text-foreground md:text-xs text-[10px] truncate capitalize max-w-42">
                                    {event.city?.toLocaleLowerCase() || t('onlineEvent')}
                                </span>
                            </div>
                        </div>
                        
                        {/* Button - Inline with info */}
                        <Button 
                            className="btn-outline shrink-0 group/btn rounded-lg text-[12px]! px-4! py-1.5! h-auto flex-1"
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