'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Calendar,
  MapPin,
  Users,
  Zap,
  Trophy,
  BookOpen,
  ArrowRight,
  Filter,
} from 'lucide-react'

type EventType = 'competition' | 'training' | 'webinar' | 'workshop'

interface Event {
  id: number
  name: string
  type: EventType
  startDate: string
  endDate: string
  description: string
  location: string
  participants: string
  category: string
  registrationDeadline: string
  status: 'upcoming' | 'ongoing' | 'past'
  image?: string
}

const mockEvents: Event[] = [
  {
    id: 1,
    name: 'National Math Olympiad 2025',
    type: 'competition',
    startDate: 'Feb 15, 2025',
    endDate: 'Feb 20, 2025',
    description:
      'Annual national mathematics competition featuring challenging problems for students from grades 8-12. Winners get scholarships and recognition.',
    location: 'Jakarta Convention Center',
    participants: 'Students (Grade 8-12)',
    category: 'Mathematics',
    registrationDeadline: 'Feb 10, 2025',
    status: 'upcoming',
  },
  {
    id: 2,
    name: 'Digital Teaching in Modern Era',
    type: 'training',
    startDate: 'Mar 1, 2025',
    endDate: 'Mar 5, 2025',
    description:
      'Comprehensive training program for educators on leveraging digital tools, online platforms, and technology to enhance teaching effectiveness.',
    location: 'Online & In-person',
    participants: 'Teachers & Educators',
    category: 'Professional Development',
    registrationDeadline: 'Feb 20, 2025',
    status: 'upcoming',
  },
  {
    id: 3,
    name: 'Science Innovation Fair 2025',
    type: 'workshop',
    startDate: 'Apr 10, 2025',
    endDate: 'Apr 12, 2025',
    description:
      'Students showcase innovative science projects across physics, chemistry, biology, and environmental science. Includes expert mentorship and prizes.',
    location: 'Regional Science Center',
    participants: 'Students & Teachers',
    category: 'Science',
    registrationDeadline: 'Mar 25, 2025',
    status: 'upcoming',
  },
  {
    id: 4,
    name: 'Educational Leadership Summit',
    type: 'webinar',
    startDate: 'Mar 15, 2025',
    endDate: 'Mar 15, 2025',
    description:
      'Online summit featuring renowned educational leaders discussing latest trends, strategies, and innovations in school management and student success.',
    location: 'Online',
    participants: 'School Leaders & Administrators',
    category: 'Leadership',
    registrationDeadline: 'Mar 10, 2025',
    status: 'upcoming',
  },
  {
    id: 5,
    name: 'English Language Arts Festival',
    type: 'competition',
    startDate: 'May 5, 2025',
    endDate: 'May 8, 2025',
    description:
      'Celebrate English language and literature through debates, essay writing, poetry, and dramatic performances. Prizes for top performers.',
    location: 'Multiple Cities',
    participants: 'Students (All Levels)',
    category: 'English',
    registrationDeadline: 'Apr 20, 2025',
    status: 'upcoming',
  },
  {
    id: 6,
    name: 'Curriculum Development Workshop',
    type: 'workshop',
    startDate: 'Feb 28, 2025',
    endDate: 'Mar 2, 2025',
    description:
      'Hands-on workshop for curriculum developers and educators on designing outcomes-based curriculum aligned with international standards.',
    location: 'Seminar Center',
    participants: 'Curriculum Teams',
    category: 'Curriculum Design',
    registrationDeadline: 'Feb 15, 2025',
    status: 'upcoming',
  },
]

const eventTypes: { type: EventType; label: string; icon: any }[] = [
  { type: 'competition', label: 'Competition', icon: Trophy },
  { type: 'training', label: 'Training', icon: BookOpen },
  { type: 'webinar', label: 'Webinar', icon: Zap },
  { type: 'workshop', label: 'Workshop', icon: Users },
]

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all')

  const filteredEvents = mockEvents.filter(
    (e) => typeFilter === 'all' || e.type === typeFilter
  )

  const getTypeColor = (type: EventType) => {
    switch (type) {
      case 'competition':
        return 'bg-red-100 text-red-800'
      case 'training':
        return 'bg-blue-100 text-blue-800'
      case 'webinar':
        return 'bg-purple-100 text-purple-800'
      case 'workshop':
        return 'bg-green-100 text-green-800'
    }
  }

  const getTypeIcon = (type: EventType) => {
    const config = eventTypes.find((t) => t.type === type)
    return config?.icon || Calendar
  }

  if (selectedEvent) {
    const TypeIcon = getTypeIcon(selectedEvent.type)
    
    return (
      <div className="space-y-8">
        <Button
          variant="outline"
          onClick={() => setSelectedEvent(null)}
          className="gap-2"
        >
          ← Back to Events
        </Button>

        {/* Event Detail */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-3">
                  {selectedEvent.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(selectedEvent.type)}`}>
                    <TypeIcon size={16} />
                    {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-semibold">
                    {selectedEvent.category}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              {selectedEvent.description}
            </p>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border border-border bg-secondary/50">
              <div className="flex items-start gap-3">
                <Calendar className="text-primary flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Event Dates</p>
                  <p className="font-semibold text-foreground">
                    {selectedEvent.startDate} to {selectedEvent.endDate}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border border-border bg-secondary/50">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-semibold text-foreground">
                    {selectedEvent.location}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border border-border bg-secondary/50">
              <div className="flex items-start gap-3">
                <Users className="text-primary flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">For</p>
                  <p className="font-semibold text-foreground">
                    {selectedEvent.participants}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border border-border bg-secondary/50">
              <div className="flex items-start gap-3">
                <Zap className="text-accent flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Registration Deadline</p>
                  <p className="font-semibold text-foreground">
                    {selectedEvent.registrationDeadline}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1">
              Register for Event
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Download Details
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Calendar className="text-primary" size={32} />
          Events & Competitions
        </h1>
        <p className="text-muted-foreground">
          Explore and register for upcoming events, competitions, and training programs.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <Filter size={20} className="text-muted-foreground flex-shrink-0" />
        <Button
          variant={typeFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setTypeFilter('all')}
          className={typeFilter === 'all' ? 'bg-primary text-primary-foreground' : ''}
        >
          All Events
        </Button>
        {eventTypes.map((item) => (
          <Button
            key={item.type}
            variant={typeFilter === item.type ? 'default' : 'outline'}
            onClick={() => setTypeFilter(item.type)}
            className={
              typeFilter === item.type ? 'bg-primary text-primary-foreground' : ''
            }
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredEvents.map((event) => {
          const EventTypeIcon = getTypeIcon(event.type)
          
          return (
            <Card
              key={event.id}
              className="border border-border hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer overflow-hidden group"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <EventTypeIcon className="text-primary" size={24} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {event.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm mb-4">
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Calendar size={16} />
                    {event.startDate} - {event.endDate}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <MapPin size={16} />
                    {event.location}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Users size={16} />
                    {event.participants}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedEvent(event)
                  }}
                >
                  View Details <ArrowRight size={14} />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
