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
        className="group mb-2 cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-xl border border-border bg-white transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative h-60 shrink-0 overflow-hidden bg-linear-to-br from-muted to-secondary/20 md:w-64 max-[640px]:h-48">
              {event.photoevent ? (
                <>
                  <img
                    src={event.photoevent}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <EventTypeIcon size={40} className="text-muted-foreground/30 max-[640px]:size-8" />
                </div>
              )}
              {/* Category badge overlay on image - mobile only */}
              <div className="absolute left-3 top-3 md:hidden">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  <EventTypeIcon size={10} />
                  {event.category}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-5 md:p-6 max-[640px]:p-4">
              {/* Category & Status - Desktop */}
              <div className="mb-3 hidden items-center justify-between md:flex">
                <div className="flex items-center gap-2">
                  <div className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium capitalize ${typeConfig.bgColor} ${typeConfig.color}`}>
                    <EventTypeIcon size={12} />
                    {event.category}
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
                    <MapPin size={12} />
                    {event.location_place || t('online')} 
                  </div>

                </div>
              
              </div>

              {/* Title */}
              <h3 className="mb-2 line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary max-[640px:mb-1.5 max-[640px]:text-base">
                {event.title}
              </h3>
              
              {/* Description */}
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground max-[640px:mb-2 max-[640px]:text-xs">
                {event.description?.replace(/<[^>]*>/g, '').substring(0, 120)}...
              </p>

              {/* Date & Location */}
              <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground max-[640px:mb-3 max-[640px]:gap-3 max-[640px]:text-xs">
                <div className="flex items-center gap-1.5 max-[640px:gap-1">
                  <Calendar size={14} className="text-primary max-[640px:size-3" />
                  <span className="max-[640px]:text-[11px]">{formatEventDate(event.date_start)}</span>
                  <span className="text-muted-foreground/50 max-[640px]:text-[10px]">→</span>
                  <span className="max-[640px]:text-[11px]">{formatEventDate(event.date_end)}</span>
                </div>
                <div className="flex items-center gap-1.5 max-[640px:gap-1">
                  <Building size={14} className="text-secondary max-[640px:size-3" />
                  <span className="truncate max-w-50 text-foreground max-[640px:max-w-40 max-[640px]:text-[11px]">{event.location_place || t('onlineEvent')}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="ghost"
                size="sm"
                className=""
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/events/${event.id_event}`)
                }}
              >
                <span>{t('viewDetails')}</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1 max-[640px:size-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventCardListMode
