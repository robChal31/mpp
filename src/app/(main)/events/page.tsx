// app/events/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Filter,
  Grid3x3,
  List,
  X,
  ChevronRight,
  SlidersHorizontal,
  MapPin,
  ChevronDown,
  BookOpen,
  Grid3X3,
  ArrowUpDown,
  CalendarDays,
} from 'lucide-react'
import EventsSection from '@/components/event/events-section'
import EventsSectionList from '@/components/event/events-section-list'
import { EVENT_TYPES } from '@/constants/event.constant'
import { EventCategory } from '@/types/event/event.types'
import { useTranslations } from 'next-intl'

// Subject options - akan diganti dengan translation nanti
const SUBJECTS = [
  { value: 'english', label: 'English' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'indonesian', label: 'Bahasa Indonesia' },
  { value: 'mandarin', label: 'Mandarin' },
]

// City options
const CITIES = [
  'Jakarta',
  'Surabaya',
  'Bandung',
  'Medan',
  'Semarang',
  'Makassar',
  'Palembang',
  'Pekanbaru',
  'Bali',
  'Yogyakarta',
]

// Sort options - akan diganti dengan translation nanti
const SORT_OPTIONS = [
  { value: 'date_asc', icon: CalendarDays },
  { value: 'date_desc', icon: CalendarDays },
]

export default function EventsPage() {
  const t = useTranslations('Events')
  const tSubjects = useTranslations('Subjects')
  const [typeFilter, setTypeFilter] = useState<EventCategory | 'all'>('all')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [cityFilter, setCityFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('date_asc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  
  // Toggle states untuk desktop filter
  const [openSections, setOpenSections] = useState({
    category: true,
    subject: true,
    city: true,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const getSelectedTypeLabel = () => {
    if (typeFilter === 'all') return t('allCategories')
    return EVENT_TYPES.find(t => t.type === typeFilter)?.label || t('allCategories')
  }

  const getSelectedSubjectLabel = () => {
    if (subjectFilter === 'all') return t('allSubjects')
    return SUBJECTS.find(s => s.value === subjectFilter)?.label || t('allSubjects')
  }

  const getSelectedCityLabel = () => {
    if (cityFilter === 'all') return t('allCities')
    return cityFilter
  }

  const getSelectedSortLabel = () => {
    if (sortBy === 'date_asc') return t('sortDateAsc')
    return t('sortDateDesc')
  }

  // Filter component yang reusable dengan toggle
  const FilterContent = () => (
    <div className="space-y-4">
      {/* Category Filter - Toggle */}
      <div>
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between py-2 text-sm font-semibold text-foreground cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Grid3X3 size={14} />
            {t('category')}
          </span>
          <ChevronDown size={16} className={`transition-transform ${openSections.category ? 'rotate-180' : ''}`} />
        </button>
        {openSections.category && (
          <div className="mt-2 space-y-1 pl-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-foreground hover:bg-muted/50'
              }`}
            >
              <span>{t('allCategories')}</span>
              {typeFilter === 'all' && <ChevronRight size={16} />}
            </button>
            {EVENT_TYPES.map((item) => (
              <button
                key={item.type}
                onClick={() => setTypeFilter(item.type)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  typeFilter === item.type
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </div>
                {typeFilter === item.type && <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Subject Filter - Toggle */}
      <div>
        <button
          onClick={() => toggleSection('subject')}
          className="w-full flex items-center justify-between py-2 text-sm font-semibold text-foreground cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <BookOpen size={14} />
            {t('subject')}
          </span>
          <ChevronDown size={16} className={`transition-transform ${openSections.subject ? 'rotate-180' : ''}`} />
        </button>
        {openSections.subject && (
          <div className="mt-2 space-y-1 pl-2">
            <button
              onClick={() => setSubjectFilter('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                subjectFilter === 'all'
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-foreground hover:bg-muted/50'
              }`}
            >
              <span>{t('allSubjects')}</span>
              {subjectFilter === 'all' && <ChevronRight size={16} />}
            </button>
            {SUBJECTS.map((subject) => (
              <button
                key={subject.value}
                onClick={() => setSubjectFilter(subject.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  subjectFilter === subject.value
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-muted/50'
                }`}
              >
                <span>{tSubjects(subject.value)}</span>
                {subjectFilter === subject.value && <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* City Filter - Toggle */}
      <div>
        <button
          onClick={() => toggleSection('city')}
          className="w-full flex items-center justify-between py-2 text-sm font-semibold text-foreground cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <MapPin size={14} />
            {t('city')}
          </span>
          <ChevronDown size={16} className={`transition-transform ${openSections.city ? 'rotate-180' : ''}`} />
        </button>
        {openSections.city && (
          <div className="mt-2 space-y-1 pl-2">
            <button
              onClick={() => setCityFilter('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                cityFilter === 'all'
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-foreground hover:bg-muted/50'
              }`}
            >
              <span>{t('allCities')}</span>
              {cityFilter === 'all' && <ChevronRight size={16} />}
            </button>
            <div className="grid grid-cols-2 gap-1">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => setCityFilter(city)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                    cityFilter === city
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground hover:bg-muted/50'
                  }`}
                >
                  <span>{city}</span>
                  {cityFilter === city && <ChevronRight size={14} />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      {(typeFilter !== 'all' || subjectFilter !== 'all' || cityFilter !== 'all') && (
        <button
          onClick={() => {
            setTypeFilter('all')
            setSubjectFilter('all')
            setCityFilter('all')
          }}
          className="w-full text-center text-xs text-primary hover:underline py-2 mt-2"
        >
          {t('resetAll')}
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 max-[640px]:px-3 py-8 max-[640px]:py-6">
        {/* Header */}
        <div className="text-center mb-8 max-[640px]:mb-6">
          <div className="inline-flex items-center gap-2 px-4 max-[640px]:px-3 py-2 rounded-full bg-primary/10 text-primary mb-4 max-[640px]:mb-3">
            <Calendar size={18} className="max-[640px]:size-4" />
            <span className="text-sm max-[640px]:text-xs font-medium">{t('upcomingBadge')}</span>
          </div>
          <h1 className="text-4xl max-[640px]:text-2xl md:text-5xl font-bold text-foreground mb-4 max-[640px]:mb-2">
            {t('pageTitle')}
          </h1>
          <p className="text-lg max-[640px]:text-sm text-muted-foreground max-w-2xl mx-auto">
            {t('pageDescription')}
          </p>
        </div>

        {/* Main Content Area - Sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar Filter - hidden on mobile */}
          <aside className="hidden lg:block lg:w-72 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                <Filter size={16} className="text-primary" />
                <h3 className="font-semibold text-foreground">{t('filters')}</h3>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar - Sort, View Toggle & Mobile Filter Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 lg:mb-4 mb-2">
              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm lg:hidden"
                >
                  <SlidersHorizontal size={14} />
                  {t('filter')}
                  {(typeFilter !== 'all' || subjectFilter !== 'all' || cityFilter !== 'all') && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-xs"
                  >
                    <ArrowUpDown size={12} />
                    {getSelectedSortLabel()}
                    <ChevronDown size={12} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSortOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-30 lg:hidden"
                        onClick={() => setIsSortOpen(false)}
                      />
                      <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-border bg-background shadow-lg z-40">
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value)
                              setIsSortOpen(false)
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-colors ${
                              sortBy === option.value ? 'bg-primary/10 text-primary' : ''
                            }`}
                          >
                            <option.icon size={14} />
                            {option.value === 'date_asc' ? t('sortDateAsc') : t('sortDateDesc')}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-muted/30 backdrop-blur-sm rounded-xl p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-9 px-4 gap-2 max-[640px]:flex-1 max-[640px]:h-8 max-[640px]:px-2 text-xs cursor-pointer ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-md' : ''
                  }`}
                >
                  <Grid3x3 size={14} className="max-[640px]:size-3.5" />
                  <span className="hidden sm:inline">{t('gridView')}</span>
                  <span className="sm:hidden">{t('grid')}</span>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-9 px-4 gap-2 max-[640px]:flex-1 max-[640px]:h-8 max-[640px]:px-2 text-xs cursor-pointer ${
                    viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-md' : ''
                  }`}
                >
                  <List size={14} className="max-[640px]:size-3.5" />
                  <span className="hidden sm:inline">{t('listView')}</span>
                  <span className="sm:hidden">{t('list')}</span>
                </Button>
              </div>
            </div>

            {/* Active filter chips */}
            {(typeFilter !== 'all' || subjectFilter !== 'all' || cityFilter !== 'all') && (
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                <span className="text-[10px] text-muted-foreground">{t('active')}</span>
                {typeFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    {getSelectedTypeLabel()}
                    <X size={10} className="cursor-pointer hover:text-destructive" onClick={() => setTypeFilter('all')} />
                  </span>
                )}
                {subjectFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    {getSelectedSubjectLabel()}
                    <X size={10} className="cursor-pointer hover:text-destructive" onClick={() => setSubjectFilter('all')} />
                  </span>
                )}
                {cityFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    {getSelectedCityLabel()}
                    <X size={10} className="cursor-pointer hover:text-destructive" onClick={() => setCityFilter('all')} />
                  </span>
                )}
                <button
                  onClick={() => {
                    setTypeFilter('all')
                    setSubjectFilter('all')
                    setCityFilter('all')
                  }}
                  className="text-[10px] text-muted-foreground hover:text-primary transition-colors ml-1 cursor-pointer"
                >
                  {t('clearAll')}
                </button>
              </div>
            )}

            {/* Events Content */}
            {viewMode === 'grid' ? (
              <EventsSection 
                typeFilter={typeFilter} 
                subjectFilter={subjectFilter}
                cityFilter={cityFilter}
                sortBy={sortBy}
              />
            ) : (
              <EventsSectionList 
                typeFilter={typeFilter} 
                subjectFilter={subjectFilter}
                cityFilter={cityFilter}
                sortBy={sortBy}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer/Sheet */}
      {isFilterOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          />
          
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-background z-50 lg:hidden shadow-xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-primary" />
                <h2 className="font-semibold text-foreground">{t('filters')}</h2>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
              <FilterContent />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
              <Button 
                className="w-full"
                onClick={() => setIsFilterOpen(false)}
              >
                {t('applyFilters')}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}