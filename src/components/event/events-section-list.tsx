'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { 
  Loader2,
  CalendarDays,
  Ticket
} from 'lucide-react'
import { EventCategory, EventI, EventTypeConfig } from '@/types/event/event.types'
import { getEventTypeConfig, getEventTypeIcon } from '@/constants/event.constant'
import EventCardListMode from './even-card-list-mode'
import { getEvents } from '@/server/services/hy/event.service'

interface EventsSectionListProps {
  typeFilter?: string
  subjectFilter?: string
  cityFilter?: string
  sortBy?: string
}

export default function EventsSectionList({ 
  typeFilter = 'all', 
  subjectFilter = 'all', 
  cityFilter = 'all',
  sortBy = 'date_asc'
}: EventsSectionListProps) {
  // State
  const [events, setEvents] = useState<EventI[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [totalEvents, setTotalEvents] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  // Refs
  const observerRef = useRef<IntersectionObserver>(null)
  const lastEventRef = useRef<HTMLDivElement>(null)
  
  const LIMIT = 9

  // 🔥 Sort events di client berdasarkan date_start
  const sortedEvents = useMemo(() => {
    if (!events.length) return []
    
    const sorted = [...events]
    return sorted.sort((a, b) => {
      const dateA = new Date(a.date_start).getTime()
      const dateB = new Date(b.date_start).getTime()
      
      if (sortBy === 'date_asc') {
        return dateA - dateB // Terdekat dulu
      } else {
        return dateB - dateA // Terjauh dulu
      }
    })
  }, [events, sortBy])

  const loadMore = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return

    setLoading(true)
    try {
      const currentPage = reset ? 1 : page
      
      const typeParam = typeFilter !== 'all' ? typeFilter : ''
      const subjectParam = subjectFilter !== 'all' ? subjectFilter : ''
      const cityParam = cityFilter !== 'all' ? cityFilter : ''
      
      const response = await getEvents(
        currentPage, 
        LIMIT, 
        typeParam,
        subjectParam,
        cityParam,
      )
      
      if(response && response.status == false ) {
        setEvents([])
      }else {
        if (reset || currentPage === 1) {
          setEvents(response.events)
        } else {
          setEvents(prev => [...prev, ...response.events])
        }
        
        setTotalEvents(response.total_data)
        
        const hasNextPage = currentPage < response.total_pages
        setHasMore(hasNextPage)
        
        if (hasNextPage && !reset) {
          setPage(prev => prev + 1)
        } else if (reset && hasNextPage) {
          setPage(2)
        }
      }
        
    } catch (err) {
      console.error('Error loading events:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    setPage(1)
    setEvents([])
    setHasMore(true)
    loadMore(true)
  }, [typeFilter, subjectFilter, cityFilter]) // Hapus sortBy dari dependency

  useEffect(() => {
    if (loading || !mounted) return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    if (lastEventRef.current) {
      observerRef.current.observe(lastEventRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [loading, hasMore, events, mounted])

  if (!mounted) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 max-[640px]:h-28 bg-muted rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  // List View
  return (
    <div className="space-y-6 max-[640px]:space-y-4">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-[640px]:gap-2 pb-2 border-b border-border">
        <h2 className="text-xl max-[640px]:text-base font-semibold text-foreground">All Events</h2>
        <div className="flex items-center gap-2 text-sm max-[640px]:text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span>{events.length} of {totalEvents} events</span>
          <span className="text-xs text-muted-foreground ml-2">
            (Sorted: {sortBy === 'date_asc' ? 'Earliest first' : 'Latest first'})
          </span>
        </div>
      </div>

      {/* Events List - menggunakan sortedEvents */}
      <div className="space-y-4 max-[640px]:space-y-3">
        {sortedEvents.map((event, index) => {
          const EventTypeIcon = getEventTypeIcon(event.category as EventCategory)
          const typeConfig = getEventTypeConfig(event.category as EventCategory)
          
          return (
            <EventCardListMode 
              key={event.id_event}
              event={event as EventI}
              typeConfig={typeConfig as EventTypeConfig}
              EventTypeIcon={EventTypeIcon}
              eventsLength={sortedEvents.length}
              index={index}
              lastEventRef={index === sortedEvents.length - 1 ? lastEventRef : null}
            />
          )
        })}
      </div>
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8 max-[640px]:py-4">
          <Loader2 className="h-8 w-8 max-[640px]:h-6 max-[640px]:w-6 animate-spin text-primary" />
        </div>
      )}

      {/* End of content */}
      {!hasMore && events.length > 0 && (
        <div className="text-center py-8 max-[640px]:py-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 max-[640px]:px-3 max-[640px]:py-1.5 rounded-full bg-muted text-muted-foreground text-sm max-[640px]:text-xs">
            <Ticket size={14} className="max-[640px]:size-3" />
            You've seen all {totalEvents} events 🎉
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {events.length === 0 && !loading && (
        <div className="text-center py-16 max-[640px]:py-10">
          <div className="inline-flex items-center justify-center w-20 h-20 max-[640px]:w-16 max-[640px]:h-16 rounded-full bg-muted mb-4 max-[640px]:mb-2">
            <CalendarDays size={32} className="text-muted-foreground max-[640px]:size-6" />
          </div>
          <h3 className="text-lg max-[640px]:text-base font-semibold text-foreground mb-2">No events found</h3>
          <p className="text-muted-foreground max-[640px]:text-sm">Try changing your filter or check back later for new events.</p>
        </div>
      )}
    </div>
  )
}