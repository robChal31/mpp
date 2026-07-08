// components/simple-events-scroll.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { EventI } from '@/types/event/event.types'
import { getEvents } from '@/server/services/hy/event.service'
import { EventCard } from './event-card'
import { EventCard2 } from './event-card2'
import { EventCard3 } from './event-card3'

export default function SimpleEventsScroll({ limit = 9 }: { limit?: number }) {
  const [events, setEvents] = useState<EventI[]>([])
  const [loading, setLoading] = useState(true)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await getEvents(1, limit)
        let sortEvents = response.events.sort((a: EventI, b: EventI) => parseInt(b.id_event) - parseInt(a.id_event))
        sortEvents = sortEvents.filter((event: EventI) => event.category != "certification").slice(0, 7)
        setEvents(sortEvents)
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [limit])

  // Check scroll position to show/hide buttons
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftButton(scrollLeft > 20)
      setShowRightButton(scrollLeft + clientWidth < scrollWidth - 20)
    }
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollPosition)
      // Initial check
      setTimeout(checkScrollPosition, 100)
      return () => scrollElement.removeEventListener('scroll', checkScrollPosition)
    }
  }, [events])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-105 bg-muted animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-muted rounded-2xl">
        <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">Belum ada event tersedia</p>
      </div>
    )
  }

  return (
    <div className="relative group/scroll">
      {/* Left Scroll Button */}
      {showLeftButton && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 rounded-full bg-white shadow-md border-border hover:bg-primary hover:text-white hover:border-primary z-20 transition-all duration-300 w-10 h-10"
          onClick={() => scroll('left')}
        >
          <ChevronLeft size={18} />
        </Button>
      )}
      
      {/* Right Scroll Button */}
      {showRightButton && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 rounded-full bg-white shadow-md border-border hover:bg-primary hover:text-white hover:border-primary z-20 transition-all duration-300 w-10 h-10"
          onClick={() => scroll('right')}
        >
          <ChevronRight size={18} />
        </Button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-4">
          {events.map((event) => (
            <div key={event.id_event} className="min-w-70 sm:min-w-[320px] lg:min-w-92 w-full">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Overlays - very subtle */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-background to-transparent pointer-events-none opacity-0 group-hover/scroll:opacity-60 transition-opacity duration-300" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-background to-transparent pointer-events-none opacity-0 group-hover/scroll:opacity-60 transition-opacity duration-300" />
    </div>
  )
}