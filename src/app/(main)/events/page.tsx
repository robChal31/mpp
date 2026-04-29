// app/events/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Filter,
  Grid3x3,
  List,
  ChevronDown
} from 'lucide-react'
import EventsSection from '@/components/event/events-section'
import EventsSectionList from '@/components/event/events-section-list'
import { EVENT_TYPES } from '@/constants/event.constant'
import { EventCategory } from '@/types/event/event.types'

export default function EventsPage() {
  const [typeFilter, setTypeFilter] = useState<EventCategory | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 max-[640px]:px-3 py-8 max-[640px]:py-6">
        {/* Header */}
        <div className="text-center mb-10 max-[640px]:mb-6">
          <div className="inline-flex items-center gap-2 px-4 max-[640px]:px-3 py-2 rounded-full bg-primary/10 text-primary mb-4 max-[640px]:mb-3">
            <Calendar size={18} className="max-[640px]:size-4" />
            <span className="text-sm max-[640px]:text-xs font-medium">Upcoming Events</span>
          </div>
          <h1 className="text-4xl max-[640px]:text-2xl md:text-5xl font-bold text-foreground mb-4 max-[640px]:mb-2">
            Events & Competitions
          </h1>
          <p className="text-lg max-[640px]:text-sm text-muted-foreground max-w-2xl mx-auto">
            Explore and register for upcoming events, competitions, and training programs designed to help you grow.
          </p>
        </div>

        {/* Filters & View Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 max-[640px]:gap-3 mb-8 max-[640px]:mb-6">
          {/* Filter Section - Desktop: buttons, Mobile: dropdown */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-muted-foreground shrink-0 max-[640px]:size-4" />
            
            {/* Desktop Filter Buttons */}
            <div className="hidden lg:flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              <Button
                variant={typeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('all')}
                size="sm"
                className={typeFilter === 'all' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-primary/80'}
              >
                All Events
              </Button>
              {EVENT_TYPES.map((item) => (
                <Button
                  key={item.type}
                  variant={typeFilter === item.type ? 'default' : 'outline'}
                  onClick={() => setTypeFilter(item.type)}
                  size="sm"
                  className={`gap-2 ${
                    typeFilter === item.type 
                      ? `bg-linear-to-r ${item.color} text-white shadow-md` 
                      : 'hover:bg-primary/80'
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Mobile Filter Dropdown */}
            <div className="lg:hidden relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as EventCategory | 'all')}
                className="appearance-none pl-3 pr-8 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Events</option>
                {EVENT_TYPES.map((item) => (
                  <option key={item.type} value={item.type}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-muted/30 backdrop-blur-sm rounded-xl p-1 self-start lg:self-auto max-[640px]:self-stretch max-[640px]:justify-between">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`h-9 px-4 gap-2 max-[640px]:flex-1 max-[640px]:h-8 max-[640px]:px-2 max-[640px]:text-xs ${
                viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-md' : ''
              }`}
            >
              <Grid3x3 size={16} className="max-[640px]:size-3.5" />
              <span className="hidden sm:inline">Grid View</span>
              <span className="sm:hidden">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={`h-9 px-4 gap-2 max-[640px]:flex-1 max-[640px]:h-8 max-[640px]:px-2 max-[640px]:text-xs ${
                viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-md' : ''
              }`}
            >
              <List size={16} className="max-[640px]:size-3.5" />
              <span className="hidden sm:inline">List View</span>
              <span className="sm:hidden">List</span>
            </Button>
          </div>
        </div>

        {/* Events Content */}
        {viewMode === 'grid' ? (
          <EventsSection typeFilter={typeFilter} />
        ) : (
          <EventsSectionList typeFilter={typeFilter} />
        )}
      </div>
    </div>
  )
}