// components/event-card-alt.tsx
'use client'

import { EventI, EventCategory } from '@/types/event/event.types'
import { formatDate, formatDateRange, formatEventDate } from '@/lib/utils/date'
import { Button } from '../ui/button'
import { Calendar, MapPin, ArrowRight, Clock, Laptop, Globe, User } from 'lucide-react'
import { getEventTypeConfig, getEventTypeIcon } from '@/constants/event.constant'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function EventCard3({ event }: { event: EventI }) {
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
            <div className="relative overflow-hidden rounded-2xl bg-white border border-border transition-all duration-500 hover:shadow-xl hover:border-primary/30 h-full flex flex-col shadow-sm">
                
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

                    {/* Category Badge - Top Left */}
                    <div className="absolute top-3 left-3 max-[640px]:top-2 max-[640px]:left-2">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium capitalize ${typeConfig.bgColor} ${typeConfig.color} shadow-lg backdrop-blur-sm max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[9px]`}>
                            <EventTypeIcon size={12} className="max-[640px]:size-3" />
                            {event.category}
                        </div>
                    </div>

                    {/* Date - Right Bottom */}
                    <div className="absolute bottom-3 right-3 max-[640px]:bottom-2 max-[640px]:right-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-black/50 text-white backdrop-blur-sm border border-white/10 max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[9px]">
                            <Calendar size={12} className="max-[640px]:size-3" />
                            {formatDateRange(event.date_start, event.date_end)}
                        </div>
                    </div>
                </div>

                {/* Content Section - Like image style */}
                <div className="px-4 py-3 flex-1 flex flex-col max-[640px]:px-3 max-[640px]:py-2.5">
                    {/* Title */}
                    <h3 className="text-base max-[640px]:text-sm font-semibold text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                    </h3>
                    
                    {/* Info Row: Date • Location */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <span className="font-medium text-foreground">
                            {formatDateRange(event.date_start, event.date_end)}
                        </span>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="truncate">
                            {event.city || event.province || event.location_place || t('onlineEvent')}
                        </span>
                    </div>


                    {/* Description - shorter */}
                    <div className="flex-1 mb-2">
                        {cleanDescription.trim() ? (
                            <p className="text-xs text-muted-foreground line-clamp-2 max-[640px]:text-[11px]">
                                {cleanDescription.length > 80 ? cleanDescription.slice(0, 80) + '...' : cleanDescription}
                            </p>
                        ) : (
                            <p className="text-xs text-muted-foreground/80 italic max-[640px]:text-[11px]">
                                {t('checkDetails')}
                            </p>
                        )}
                    </div>

                    {/* Bottom Row: Location tag + Button */}
                    <div className="flex items-center justify-between gap-2 mt-1 pt-2 border-t border-border/50">
                        {/* Location Tag */}
                        <div className="flex items-center gap-1.5">
                            {event.city ? (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-medium">
                                    <MapPin size={10} />
                                    <span className="capitalize">{event.city.toLowerCase()}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/5 text-accent text-[10px] font-medium">
                                    <Globe size={10} />
                                    <span>{t('onlineEvent')}</span>
                                </div>
                            )}
                        </div>
                        
                        {/* View Details Link - like image style */}
                        <Button 
                            variant="link"
                            className="text-primary hover:text-primary-dark p-0 h-auto text-xs font-medium group/btn"
                            onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/events/${event.title_url}`)
                            }}
                        >
                            <span>{t('viewDetails')}</span>
                            <ArrowRight size={12} className="ml-1 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    )
}