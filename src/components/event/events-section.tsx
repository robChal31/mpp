'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { Loader2, Ticket, CalendarDays } from 'lucide-react'
import { EventI } from '@/types/event/event.types'
import { EventCard } from './event-card'
import { getEvents } from '@/server/services/hy/event.service'
import { useTranslations } from 'next-intl'

interface EventsSectionProps {
  typeFilter?: string
  subjectFilter?: string,
  cityFilter?: string,
  sortBy?: string
  searchQuery?: string
}

export default function EventsSection({ 
  typeFilter = 'all', 
  subjectFilter = 'all', 
  cityFilter = 'all',
  sortBy = 'date_asc',
  searchQuery = ''
}: EventsSectionProps) {
  const t = useTranslations('EventsSection')
  const [events, setEvents] = useState<EventI[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState<number>(1)
  const [totalEvents, setTotalEvents] = useState(0)
  const [mounted, setMounted] = useState(false)
  const observerRef = useRef<IntersectionObserver>(null);
  const lastEventRef = useRef<HTMLDivElement>(null);
  const limit: number = 9

  // ============ FILTER EVENTS BERDASARKAN SEARCH QUERY ============
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events
    
    const query = searchQuery.toLowerCase().trim()
    return events.filter(event => {
      const titleMatch = event.title?.toLowerCase().includes(query)
      const descMatch = event.description?.toLowerCase().includes(query)
      const locationMatch = (
        event.location_place?.toLowerCase().includes(query) ||
        event.city?.toLowerCase().includes(query) ||
        event.province?.toLowerCase().includes(query)
      )
      return titleMatch || descMatch || locationMatch
    })
  }, [events, searchQuery])

  // Sort filtered events
  const sortedEvents = useMemo(() => {
    if (!filteredEvents.length) return []
    
    const sorted = [...filteredEvents]
    return sorted.sort((a, b) => {
      const dateA = new Date(a.date_start).getTime()
      const dateB = new Date(b.date_start).getTime()
      
      if (sortBy === 'date_asc') {
        return dateA - dateB
      } else {
        return dateB - dateA
      }
    })
  }, [filteredEvents, sortBy])

  useEffect(() => {
    setMounted(true)
    setPage(1)
    setEvents([])
    setHasMore(true)
    loadMore(true)
  }, [typeFilter, subjectFilter, cityFilter, searchQuery])

  useEffect(() => {
    if (loading || !mounted) return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMore()
      }
    }, { threshold: 0.1, rootMargin: '100px' })

    if (lastEventRef.current) {
      observerRef.current.observe(lastEventRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [loading, hasMore, events, mounted])

  const loadMore = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return

    setLoading(true)
    try {
      const currentPage = reset ? 1 : page
      
      const typeParam = typeFilter !== 'all' ? typeFilter : ''
      const subjectParam = subjectFilter !== 'all' ? subjectFilter : ''
      const cityParam = cityFilter !== 'all' ? cityFilter : ''
      const searchName = searchQuery !== '' ? searchQuery : ''
      
      const response = await getEvents(currentPage, limit, typeParam, subjectParam, cityParam, searchName)
      
      if (response && response.status == false) {
        setEvents([])
      } else {
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

  // Prevent rendering on server to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{t('events')}</h2>
          <span className="text-sm text-muted-foreground">{t('loading')}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-100 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">{t('allEvents')}</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span>{t('eventsCount', { count: sortedEvents.length, total: totalEvents })}</span>
          {searchQuery && (
            <span className="text-xs text-primary ml-1">
              ({t('searchResults', { count: sortedEvents.length })})
            </span>
          )}
          <span className="text-xs text-muted-foreground ml-2">
            ({t('sortedBy', { sort: sortBy === 'date_asc' ? t('earliestFirst') : t('latestFirst') })})
          </span>
        </div>
      </div>

      {/* Search query indicator */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
          <span className="font-medium">{t('searchingFor')}</span>
          <span className="font-semibold text-foreground">"{searchQuery}"</span>
          <span className="text-xs">- {sortedEvents.length} {t('resultsFound')}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
        {sortedEvents.map((event, index) => (
          <div key={event.id_event} ref={index === sortedEvents.length - 1 ? lastEventRef : null}>
            <EventCard event={event} />
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!hasMore && sortedEvents.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
            <Ticket size={14} />
            {t('seenAllEvents', { total: totalEvents })}
          </div>
        </div>
      )}

      {sortedEvents.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
            <CalendarDays size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? t('noSearchResults') : t('noEventsFound')}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery ? t('tryDifferentSearch') : t('tryChangingFilter')}
          </p>
        </div>
      )}
    </div>
  )
}