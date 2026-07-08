// src/constants/event.constant.ts
import { EventCategory, EventTypeConfig } from '@/types/event/event.types'
import { 
  Users,
  Zap,
  Trophy,
  BookOpen,
  Ticket,
  CalendarDays,
  type LucideIcon,
  PartyPopper,
  FlaskConical
} from 'lucide-react'

export const EVENT_TYPES: EventTypeConfig[] = [
  { 
    type: 'workshop', 
    label: 'Workshop', 
    icon: FlaskConical, 
    color: 'text-emerald-500', 
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    description: 'Hands-on learning sessions'
  },
  { 
    type: 'competition', 
    label: 'Competition', 
    icon: Trophy, 
    color: 'text-amber-500', 
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    description: 'Competitive events with prizes'
  },
  { 
    type: 'certification', 
    label: 'Certification', 
    icon: Ticket, 
    color: 'text-slate-500', 
    bgColor: 'bg-slate-50 dark:bg-slate-950/30',
    borderColor: 'border-slate-200 dark:border-slate-800',
    description: 'Professional certification programs'
  },
  { 
    type: 'conference', 
    label: 'Conference', 
    icon: CalendarDays, 
    color: 'text-violet-500', 
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    borderColor: 'border-violet-200 dark:border-violet-800',
    description: 'Large-scale industry gatherings'
  },
  { 
    type: 'festival', 
    label: 'Festival', 
    icon: PartyPopper, 
    color: 'text-purple-500', 
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    description: 'Festival events with fun activities'
  },
]

// Helper functions untuk event
export const getEventTypeConfig = (type: EventCategory): EventTypeConfig => {
  return EVENT_TYPES.find((t) => t.type === type) || EVENT_TYPES[0]
}

export const getEventTypeIcon = (type: EventCategory): LucideIcon => {
  return getEventTypeConfig(type).icon
}

export const getEventTypeColor = (type: EventCategory): string => {
  const colors: Record<EventCategory, string> = {
    competition: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    workshop: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    certification: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800',
    conference: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-800',
    festival: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  }
  return colors[type] || colors.competition
}

// Untuk mapping kategori ke string (misal buat filter)
export const EVENT_CATEGORY_OPTIONS = EVENT_TYPES.map(type => ({
  value: type.type,
  label: type.label,
  icon: type.icon,
}))

// Untuk status event
export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  ENDED: 'ended',
} as const

export type EventStatus = typeof EVENT_STATUS[keyof typeof EVENT_STATUS]

export const getEventStatusConfig = (status: EventStatus) => {
  const configs = {
    upcoming: { label: 'Upcoming', color: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30' },
    ongoing: { label: 'Ongoing', color: 'text-primary', bgColor: 'bg-primary/10' },
    ended: { label: 'Ended', color: 'text-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-800' },
  }
  return configs[status]
}