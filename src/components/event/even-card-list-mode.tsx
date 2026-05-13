import { formatEventDate } from '@/lib/utils/date'
import { EventI, EventTypeConfig } from '@/types/event/event.types'
import { ArrowRight, Building, Calendar, Clock, Eye, MapPin } from 'lucide-react'
import { Button } from '../ui/button'
import { RefObject } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type EventCardListModeProps = {
  event: EventI;
  index: number;
  lastEventRef: RefObject<HTMLDivElement | null> | null;
  EventTypeIcon: React.ComponentType<any>;
  eventsLength: number;
  typeConfig: EventTypeConfig;
};

const EventCardListMode: React.FC<EventCardListModeProps> = ({
  event,
  index,
  lastEventRef,
  EventTypeIcon,
  eventsLength,
  typeConfig
}) => {
  const t = useTranslations('EventCard')
  const router = useRouter()
  return (
    <Link href={`/events/${event.title_url}`} key={`${event.id_event}-${index}`}>
      <div
        key={`${event.id_event}-${index}`}
        ref={index === eventsLength - 1 ? lastEventRef : null}
        className="group cursor-pointer"
      >
        <div className="relative bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-64 h-60 max-[640px]:h-48 md:h-auto relative overflow-hidden bg-linear-to-br from-muted to-secondary shrink-0">
              {event.photoevent ? (
                <>
                  <img
                    src={event.photoevent}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <EventTypeIcon size={40} className="text-muted-foreground/30 max-[640px]:size-8" />
                </div>
              )}
              {/* Category badge overlay on image - mobile only */}
              <div className="absolute top-3 left-3 md:hidden">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-medium backdrop-blur-sm bg-black/50 text-white">
                  <EventTypeIcon size={10} />
                  {event.category}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-5 max-[640px]:p-4 md:p-6">
              {/* Category & Status - Desktop */}
              <div className="hidden md:flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${typeConfig.bgColor} ${typeConfig.color}`}>
                    <EventTypeIcon size={12} />
                    {event.category}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium capitalize bg-primary/60 text-white">
                    <MapPin size={12} />
                    {event.city ? event.city : (event.province ? event.province : (event.location_place ? event.location_place : t('online')))} 
                  </div>
                  <StatusBadge date_start={event.date_start} date_end={event.date_end} />
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={12} />
                  {t('registerBy')} {formatEventDate(event.date_start)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg max-[640px]:text-base font-bold text-foreground mb-2 max-[640px]:mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                {event.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm max-[640px]:text-xs text-muted-foreground mb-4 max-[640px]:mb-2 line-clamp-2">
                {event.description?.replace(/<[^>]*>/g, '').substring(0, 120)}...
              </p>

              {/* Date & Location */}
              <div className="flex flex-wrap gap-4 max-[640px]:gap-3 text-sm max-[640px]:text-xs text-muted-foreground mb-4 max-[640px]:mb-3">
                <div className="flex items-center gap-1.5 max-[640px]:gap-1">
                  <Calendar size={14} className="text-primary max-[640px]:size-3" />
                  <span className="max-[640px]:text-[11px]">{formatEventDate(event.date_start)}</span>
                  <span className="text-muted-foreground/50 max-[640px]:text-[10px]">→</span>
                  <span className="max-[640px]:text-[11px]">{formatEventDate(event.date_end)}</span>
                </div>
                <div className="flex items-center gap-1.5 max-[640px]:gap-1">
                  <Building size={14} className="text-primary max-[640px]:size-3" />
                  <span className="truncate max-w-50 max-[640px]:max-w-40 max-[640px]:text-[11px]">{event.location_place || t('onlineEvent')}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 max-[640px]:gap-1 text-muted-foreground group-hover:text-primary group-hover:scale-110 hover:bg-primary/80 group/btn px-0 hover:px-3 transition-all max-[640px]:text-xs max-[640px]:h-8"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/events/${event.id_event}`)
                }}
              >
                <span>{t('viewDetails')}</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1 max-[640px]:size-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventCardListMode

// Status Badge Component
const StatusBadge = ({ date_start, date_end }: { date_start: string; date_end: string }) => {
  const t = useTranslations('EventCard')
  const now = new Date()
  const start = new Date(date_start)
  const end = new Date(date_end)
  
  if (now < start) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 max-[640px]:text-[10px] max-[640px]:px-1.5">
        <Clock size={10} className="max-[640px]:size-2.5" />
        <span className="max-[640px]:hidden">{t('upcoming')}</span>
        <span className="hidden max-[640px]:inline">{t('upcomingShort')}</span>
      </span>
    )
  } else if (now > end) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 max-[640px]:text-[10px] max-[640px]:px-1.5">
        <span className="max-[640px]:hidden">{t('ended')}</span>
        <span className="hidden max-[640px]:inline">{t('endedShort')}</span>
      </span>
    )
  } else {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary max-[640px]:text-[10px] max-[640px]:px-1.5">
        <Eye size={10} className="max-[640px]:size-2.5" />
        <span className="max-[640px]:hidden">{t('ongoing')}</span>
        <span className="hidden max-[640px]:inline">{t('ongoingShort')}</span>
      </span>
    )
  }
}