// components/simple-events-scroll.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/event/event-card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { EventI } from '@/types/event/event.types'
import { getEvents } from '@/server/services/hy/event.service'

export default function SimpleEventsScroll({ limit = 9 }: { limit?: number }) {
  const [events, setEvents] = useState<EventI[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await getEvents(1, limit)
        setEvents(response.events)
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [limit])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(limit == 6 ? 3 : 6)].map((_, i) => (
          <div key={i} className="h-100 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="relative group/scroll">
      {/* Scroll Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full bg-background shadow-lg opacity-0 group-hover/scroll:opacity-100 transition-opacity z-10"
        onClick={() => scroll('left')}
      >
        <ChevronLeft size={20} />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-background shadow-lg opacity-0 group-hover/scroll:opacity-100 transition-opacity z-10"
        onClick={() => scroll('right')}
      >
        <ChevronRight size={20} />
      </Button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-6 pb-4">
          {events.map((event) => (
            <div key={event.id_event} className="min-w-70 md:min-w-[320px] lg:min-w-90">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Overlays for scroll indication */}
      <div className="absolute left-0 top-0 bottom-0 md:w-8 w-0 bg-linear-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 md:w-8 w-0 bg-linear-to-l from-background to-transparent pointer-events-none" />
    </div>
  )
}