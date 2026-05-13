// components/event-card.tsx
'use client'

import { EventI, EventCategory } from '@/types/event/event.types'
import { formatDate, formatEventDate } from '@/lib/utils/date'
import { Button } from '../ui/button'
import { Calendar, MapPin, Sparkles, ArrowRight } from 'lucide-react'
import { getEventTypeConfig, getEventTypeIcon } from '@/constants/event.constant'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface EventCardProps {
  event: EventI
  variant?: 'default' | 'compact'
  onClick?: () => void
}

export function EventCard({ event, variant = 'default', onClick }: EventCardProps) {
    const t = useTranslations('Event')
    const EventTypeIcon = getEventTypeIcon(event.category as EventCategory)
    const typeConfig = getEventTypeConfig(event.category as EventCategory)
    const router = useRouter()

    return (
        <Link href={`/events/${event.title_url}`}className="group relative cursor-pointer h-full block">
            {/* Card Container */}
            <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-white/20 dark:border-gray-800/30 shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] h-full flex flex-col">
                
                {/* Image with Parallax Effect */}
                <div className="relative h-52 max-[640px]:h-44 overflow-hidden shrink-0">
                    <img src={event.photoevent} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy"/>
                
                    {/* Animated Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-70" />
                    

                    <div className="absolute bottom-4 left-4 max-[640px]:bottom-2 max-[640px]:left-2">
                        <div className="flex items-center gap-2">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium capitalize bg-primary/60 text-white max-[640px]:px-1.5 max-[640px]:py-0.5 max-[640px]:text-[9px]`}>
                                <MapPin size={12} className="max-[640px]:size-3" />
                                {event.city ? event.city : (event.province ? event.province : (event.location_place ? event.location_place : 'Online Event'))}
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-4 left-4 max-[640px]:top-2 max-[640px]:left-2">
                        <div className="flex items-center gap-2">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${typeConfig.bgColor} ${typeConfig.color} max-[640px]:px-1.5 max-[640px]:py-0.5 max-[640px]:text-[9px]`}>
                                <EventTypeIcon size={12} className="max-[640px]:size-3" />
                                {event.category}
                            </div>
                        </div>
                    </div>
                    
                    {/* Date Circle */}
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 max-[640px]:w-20 max-[640px]:h-20 bg-primary rounded-full opacity-90 group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute bottom-4 right-4 text-white text-right z-10 max-[640px]:bottom-2 max-[640px]:right-2">
                        <p className="text-xs font-light max-[640px]:text-[8px]">{t('starts')}</p>
                        <p className="text-xl font-bold leading-5 max-[640px]:text-sm max-[640px]:leading-4">
                            {formatDate(event.date_start).split(' ')[0]}
                        </p>
                        <p className="text-xs max-[640px]:text-[8px]">
                            {formatDate(event.date_start).split(' ')[1]}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col max-[640px]:p-4">
                    <h3 className="text-xl max-[640px]:text-base font-bold text-foreground mb-3 max-[640px]:mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                    </h3>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-4 max-[640px:gap-2 max-[640px]:mb-3">
                        <div className="flex items-center gap-2 max-[640px]:gap-1">
                            <div className="p-1.5 rounded-lg bg-primary/10 max-[640px]:p-1">
                                <Calendar size={14} className="text-primary max-[640px]:size-3" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground/70 max-[640px]:text-[8px]">{t('endsAt')}</span>
                                <span className="text-xs font-medium text-foreground max-[640px]:text-[10px]">{formatEventDate(event.date_end)}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 max-[640px]:gap-1">
                            <div className="p-1.5 rounded-lg bg-primary/10 max-[640px]:p-1">
                                <MapPin size={14} className="text-primary max-[640px]:size-3" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-[10px] text-muted-foreground/70 max-[640px]:text-[8px]">{t('location')}</span>
                                <span className="text-xs font-medium text-foreground truncate max-[640px]:text-[10px]">{event.location_place || t('onlineEvent')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                    variant="outline"
                    className="w-full gap-2 bg-transparent border-primary/20 hover:bg-primary hover:text-white transition-all duration-300 group/btn group-hover:bg-primary group-hover:text-white max-[640px]:text-xs max-[640px]:h-8 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/events/${event.title_url}`)
                    }}
                    >
                        <span>{t('viewDetails')}</span>
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1 max-[640px]:size-3" />
                    </Button>
                </div>
            </div>
        </Link>
    )
}