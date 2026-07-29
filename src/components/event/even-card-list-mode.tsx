import { formatEventDate } from '@/lib/utils/date'
import { EventI, EventTypeConfig } from '@/types/event/event.types'
import { ArrowRight, Building, Calendar, Clock, Eye, MapPin, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { RefObject } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '../ui/badge'

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

  // Status badge
  const now = new Date()
  const startDate = new Date(event.date_start)
  const endDate = new Date(event.date_end)
  
  let statusBadge = null
  let statusColor = ''
  if (now < startDate) {
    statusBadge = 'Akan Datang'
    statusColor = 'bg-green-50 text-green-700 border-green-200'
  } else if (now > endDate) {
    statusBadge = 'Selesai'
    statusColor = 'bg-gray-50 text-gray-500 border-gray-200'
  } else {
    statusBadge = 'Berlangsung'
    statusColor = 'bg-primary/10 text-primary border-primary/20'
  }

  return (
    <Link href={`/events/${event.title_url}`} key={`${event.id_event}-${index}`}>
      <div
        key={`${event.id_event}-${index}`}
        ref={index === eventsLength - 1 ? lastEventRef : null}
        className="group mb-3 cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-xl border border-border bg-white transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5">
          <div className="flex flex-col md:flex-row">
            {/* Image Section - Lebih proporsional */}
            <div className="relative h-52 shrink-0 overflow-hidden bg-linear-to-br from-muted to-secondary/20 md:w-56 max-[640px]:h-44">
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
              
              {/* Status Badge - Bottom Left */}
              <div className="absolute bottom-3 left-3">
                <Badge className={`${statusColor} border text-[10px] font-medium px-2.5 py-0.5 backdrop-blur-sm`}>
                  {statusBadge}
                </Badge>
              </div>

              {/* Category badge - Top Left (mobile only) */}
              <div className="absolute left-3 top-3 md:hidden">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm border border-white/10">
                  <EventTypeIcon size={10} />
                  {event.category}
                </div>
              </div>

              {/* Date - Top Right (mobile only) */}
              <div className="absolute right-3 top-3 md:hidden">
                <div className="inline-flex items-center gap-1 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm border border-white/10">
                  <Calendar size={10} />
                  {formatEventDate(event.date_start)}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 md:p-5 max-[640px]:p-3">
              {/* Category & Status - Desktop */}
              <div className="mb-2.5 hidden items-center justify-between md:flex">
                <div className="flex items-center gap-2">
                  <div className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium capitalize ${typeConfig.bgColor} ${typeConfig.color}`}>
                    <EventTypeIcon size={12} />
                    {event.category}
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
                    <MapPin size={12} />
                    {event.location_place || t('online')} 
                  </div>
                  <Badge className={`${statusColor} border text-[10px] font-medium`}>
                    {statusBadge}
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock size={10} />
                  {formatEventDate(event.date_start)}
                </span>
              </div>

              {/* Title */}
              <h3 className="mb-1.5 line-clamp-2 text-base font-bold text-foreground transition-colors group-hover:text-primary max-[640px:text-sm max-[640px]:mb-1">
                {event.title}
              </h3>
              
              {/* Description */}
              <p className="mb-3 line-clamp-2 text-sm text-muted-foreground max-[640px:mb-2 max-[640px]:text-xs">
                {event.description?.replace(/<[^>]*>/g, '').substring(0, 120)}...
              </p>

              {/* Date & Location - More compact */}
              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground max-[640px:gap-2 max-[640px]:text-[10px]">
                <div className="flex items-center gap-1.5 max-[640px:gap-1">
                  <Calendar size={13} className="text-primary max-[640px:size-3" />
                  <span>{formatEventDate(event.date_start)}</span>
                  <span className="text-muted-foreground/40">→</span>
                  <span>{formatEventDate(event.date_end)}</span>
                </div>
                <div className="flex items-center gap-1.5 max-[640px:gap-1">
                  <Building size={13} className="text-secondary max-[640px:size-3" />
                  <span className="truncate max-w-40 text-foreground max-[640px:max-w-32">{event.location_place || t('onlineEvent')}</span>
                </div>
              </div>

              {/* Action Button - More prominent */}
              <Button
                variant="default"
                size="sm"
                className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary-dark text-white rounded-lg px-5 py-2 text-xs font-medium transition-all duration-300 hover:shadow-md"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/events/${event.title_url}`)
                }}
              >
                <span>{t('viewDetails')}</span>
                <ArrowRight size={13} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventCardListMode