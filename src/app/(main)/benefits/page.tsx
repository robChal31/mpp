// app/benefits/page.tsx
'use client'

import { useState, useEffect, JSX, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Gift,
  BookOpen,
  Users,
  Calendar,
  CheckCircle,
  Loader2,
  TrendingUp,
  Trophy,
  Briefcase,
  Globe,
  Mic,
  Star,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  Eye,
  Clock,
  Tag,
  Award,
  Sparkles,
  Zap,
  GraduationCap,
  Target,
  Heart,
  Lightbulb,
  FileText,
  Ticket,
} from 'lucide-react'
import { formatDate } from '@/lib/utils/date'
import { BenefitGroupV2, FlattenedBenefit, PK } from '@/types/benefit/benefit.type'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import OnBoardingTour from '@/components/OnboardingTour'
import { encodeId } from '@/lib/utils/hash'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { sanitizeDisplay } from '@/lib/utils/sanitize-string'

// Enhanced icon mapping with better matching
const getBenefitIcon = (type: string, size: number = 16) => {
  const icons: Record<string, JSX.Element> = {
    'Curriculum & Training': <BookOpen size={size} />,
    'Guest English Teacher': <Mic size={size} />,
    'Pengembangan Pimpinan': <Briefcase size={size} />,
    'Training Kolektif Online': <Globe size={size} />,
    'Training Kolektif Offline': <Users size={size} />,
    'Masterclass Digital': <TrendingUp size={size} />,
    'Pelajar Berkreasi': <Trophy size={size} />,
    'Jambore': <Star size={size} />,
    'Ujian Cambridge': <GraduationCap size={size} />,
    'Dana Pengembangan': <Target size={size} />,
    'Kesejahteraan': <Heart size={size} />,
  }
  return icons[type] || <Award size={size} />
}

const getBenefitColor = (type: string) => {
  const colors: Record<string, string> = {
    'Curriculum & Training': 'from-blue-100 to-blue-200',
    'Guest English Teacher': 'from-purple-100 to-purple-200',
    'Pengembangan Pimpinan': 'from-indigo-100 to-indigo-200',
    'Training Kolektif Online': 'from-cyan-100 to-cyan-200',
    'Training Kolektif Offline': 'from-emerald-100 to-emerald-200',
    'Masterclass Digital': 'from-amber-100 to-amber-200',
    'Pelajar Berkreasi': 'from-yellow-100 to-yellow-200',
    'Jambore': 'from-orange-100 to-orange-200',
    'Ujian Cambridge': 'from-teal-100 to-teal-200',
    'Dana Pengembangan': 'from-rose-100 to-rose-200',
    'Kesejahteraan': 'from-pink-100 to-pink-200',
  }
  return colors[type] || 'from-gray-100 to-gray-200'
}

const getBenefitTextColor = (type: string) => {
  const colors: Record<string, string> = {
    'Curriculum & Training': 'text-blue-600',
    'Guest English Teacher': 'text-purple-600',
    'Pengembangan Pimpinan': 'text-indigo-600',
    'Training Kolektif Online': 'text-cyan-600',
    'Training Kolektif Offline': 'text-emerald-600',
    'Masterclass Digital': 'text-amber-600',
    'Pelajar Berkreasi': 'text-yellow-600',
    'Jambore': 'text-orange-600',
    'Ujian Cambridge': 'text-teal-600',
    'Dana Pengembangan': 'text-rose-600',
    'Kesejahteraan': 'text-pink-600',
  }
  return colors[type] || 'text-gray-600'
}

const isExpired = (expiredAt: string) => {
  return new Date(expiredAt) < new Date()
}

interface BenefitGroupByPK {
  pk: PK
  benefits: FlattenedBenefit[]
  isExpired: boolean
}

interface ProgramOption {
  id: string
  programName: string
  totalBenefits: number
  pkIds: string[]
}

export default function BenefitsPage() {
  const t = useTranslations('Benefits')
  const tour = useTranslations('tour')
  const [benefitGroups, setBenefitGroups] = useState<BenefitGroupByPK[]>([])
  const [filteredGroups, setFilteredGroups] = useState<BenefitGroupByPK[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [selectedProgram, setSelectedProgram] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    const loadBenefits = async () => {
      try {
        const res = await fetch('/api/mpartner/benefits/benefit', {
          method: 'POST',
        })
        const data = await res.json()
        if (data.status === 'error') {
          toast.error(data.message || t('failedToLoad'))
          setBenefitGroups([])
        } else {
          const groupsMap = new Map<string, BenefitGroupByPK>()
          
          data.data.benefits.forEach((pkg: BenefitGroupV2) => {
            const pk = pkg.related_pks[0]
            const pkId = pk.id
            const pkExpired = isExpired(pk.expired_at)
            const activeQuota = pk.active_quota
            const flattenedBenefits: FlattenedBenefit[] = []
            pkg.benefit_detail.forEach((benefit) => {
              flattenedBenefits.push({
                id_benefit_list: benefit.id_benefit_list,
                benefit_name: sanitizeDisplay(benefit.benefit_name),
                subbenefit: benefit.subbenefit,
                description: benefit.description,
                qty: benefit.qty,
                qty2: benefit.qty2,
                qty3: benefit.qty3,
                active_qty: activeQuota.available,
                active_year: activeQuota.year,
                pelaksanaan: benefit.pelaksanaan,
                type: benefit.type,
                redeemable: benefit.redeemable,
                keterangan: benefit.keterangan,
                packageId: pkg.benefit_id,
                pk: pk,
                subject_benefit: benefit.subject_benefit,
                subbenefit_group: benefit.subbenefit_group
              })
            })
            
            if (groupsMap.has(pkId)) {
              const existing = groupsMap.get(pkId)!
              existing.benefits.push(...flattenedBenefits)
            } else {
              groupsMap.set(pkId, {
                pk: {...pk, program: sanitizeDisplay(pk.program)},
                benefits: flattenedBenefits,
                isExpired: pkExpired
              })
            }
          })
          
          const groups = Array.from(groupsMap.values())
          setBenefitGroups(groups)
          setFilteredGroups(groups)
          
          const initialExpanded: Record<string, boolean> = {}
          groups.forEach(group => {
            initialExpanded[group.pk.id] = true
          })
          setExpandedGroups(initialExpanded)
        }
        
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadBenefits()
  }, [t])

  const programOptions = useMemo(() => {
    const programMap = new Map<string, ProgramOption>()
    
    benefitGroups.forEach(group => {
      const programName = group.pk.program ?? group.pk.no_pk
      
      if (!programMap.has(programName)) {
        programMap.set(programName, {
          id: programName,
          programName: programName,
          totalBenefits: 0,
          pkIds: []
        })
      }
      
      const programOption = programMap.get(programName)!
      programOption.totalBenefits += group.benefits.length
      programOption.pkIds.push(group.pk.id)
    })
    
    return Array.from(programMap.values())
  }, [benefitGroups])

  useEffect(() => {
    let filtered = [...benefitGroups]
    
    if (selectedProgram !== 'all') {
      filtered = filtered.filter(group => 
        group.pk.program === selectedProgram
      )
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.map(group => ({
        ...group,
        benefits: group.benefits.filter(benefit => 
          benefit.benefit_name.toLowerCase().includes(query) ||
          benefit.description?.toLowerCase().includes(query) ||
          benefit.subbenefit?.toLowerCase().includes(query)
        )
      })).filter(group => group.benefits.length > 0)
    }
    
    setFilteredGroups(filtered)
  }, [selectedProgram, searchQuery, benefitGroups])

  const toggleGroup = (pkId: string) => {
    setExpandedGroups(prev => ({ ...prev, [pkId]: !prev[pkId] }))
  }

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {}
    filteredGroups.forEach(group => {
      allExpanded[group.pk.id] = true
    })
    setExpandedGroups(allExpanded)
  }

  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {}
    filteredGroups.forEach(group => {
      allCollapsed[group.pk.id] = false
    })
    setExpandedGroups(allCollapsed)
  }

  const clearFilters = () => {
    setSelectedProgram('all')
    setSearchQuery('')
  }

  const steps = useMemo(() => [
    {
      target: "main",
      title: tour('welcome.title'),
      content: tour('welcome.content'),
      disableBeacon: false,
      placement: "center",
    },
    {
      target: "#benefits-filter-section",
      title: tour('filter.title'),
      content: tour('filter.content'),
      placement: "bottom",
    },
    {
      target: "#benefits-program-select",
      title: tour('pkFilter.title'),
      content: tour('pkFilter.content'),
      placement: "bottom",
    },
    {
      target: "#benefits-search-input",
      title: tour('search.title'),
      content: tour('search.content'),
      placement: "top",
    },
    {
      target: "#benefits-expand-buttons",
      title: tour('expandCollapse.title'),
      content: tour('expandCollapse.content'),
      placement: "top",
    },
    {
      target: "#benefits-list",
      title: tour('benefitList.title'),
      content: tour('benefitList.content'),
      placement: "top",
    },
  ], [t])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-primary/10 rounded-full blur-xl animate-pulse" />
          <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
        </div>
      </div>
    )
  }

  const totalBenefits = filteredGroups.reduce((acc, g) => acc + g.benefits.length, 0)

  return (
    <div className="min-h-screen">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-6 sm:space-y-8">
        <OnBoardingTour pageName='benefits' steps={steps} />
        
        {/* Hero Header */}
        <div className="relative text-center space-y-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 via-primary/80 to-gray-900 dark:from-white dark:via-primary/60 dark:to-white bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mt-2">
              {t('description')}
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div 
          id="benefits-filter-section" 
          className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/50 p-5 sticky top-4 z-20"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between pt-4">
            {/* Filter by Program */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 shrink-0">
                <Filter size={18} className="text-primary" />
                <span className="text-xs md:text-sm font-semibold text-foreground hidden md:block">{t('filterByProgram')}</span>
              </div>
              
              <div className="relative flex-1 lg:flex-initial">
                <Select
                  value={selectedProgram}
                  onValueChange={(value) => setSelectedProgram(value)}
                >
                  <SelectTrigger className="w-full lg:w-80 px-4 py-2.5 text-xs md:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary font-medium shadow-sm">
                    <SelectValue placeholder={t('allPrograms')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg" style={{ width: 'auto', minWidth: '200px', maxWidth: '600px' }}>
                    <SelectItem value="all" className="cursor-pointer hover:bg-primary/10">
                      📁 {t('allPrograms')} ({benefitGroups.reduce((acc, g) => acc + g.benefits.length, 0)})
                    </SelectItem>
                    {programOptions.map((program) => (
                      <SelectItem key={program.id} value={program.programName} className="cursor-pointer hover:bg-primary/10">
                        📄 {program.programName} ({program.totalBenefits})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Search & Actions */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <input
                  id="benefits-search-input"
                  type="text"
                  placeholder={t('searchBenefits')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 text-xs md:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X size={14} className="text-muted-foreground hover:text-red-500 transition-colors" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2" id="benefits-expand-buttons">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={expandAll}
                  className="h-10 px-3 text-xs gap-1.5 bg-gray-100 transition-all"
                >
                  <ChevronDown size={14} />
                  <span className="hidden sm:inline">{t('expandAll')}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={collapseAll}
                  className="h-10 px-3 text-xs gap-1.5 bg-gray-100 transition-all"
                >
                  <ChevronUp size={14} />
                  <span className="hidden sm:inline">{t('collapseAll')}</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Active Filters & Results */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">{t('activeFilters')} {(selectedProgram == 'all' && !searchQuery) && <Badge className="text-[11px] gap-1.5 py-1 px-4 rounded-full">None</Badge> }</span>
              {(selectedProgram !== 'all' || searchQuery) && (
                <>
                  {selectedProgram !== 'all' && (
                    <Badge className="text-[11px] gap-1.5 py-1 px-4 rounded-full">
                      {selectedProgram.length > 20 ? selectedProgram.slice(0, 20) + '...' : selectedProgram}
                      <button onClick={() => setSelectedProgram('all')}>
                        <X size={12} className="cursor-pointer hover:text-red-500 transition-colors" />
                      </button>
                    </Badge>
                  )}
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')}>
                      <Badge className="text-[11px] gap-1.5 py-1.5 px-3 rounded-full">
                        {t('search')}: {searchQuery}
                        <X size={12} className="cursor-pointer hover:text-red-500 transition-colors" />
                      </Badge>
                    </button>
                  )}
                </>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground bg-linear-to-r from-primary/10 to-primary/5 px-4 py-1.5 rounded-full font-medium">
              ✨ {t('showingBenefits', { count: totalBenefits, pkCount: filteredGroups.length })}
            </div>
          </div>
        </div>

        {/* Benefits List */}
        {filteredGroups.length > 0 ? (
          <div id="benefits-list" className="space-y-6">
            {filteredGroups.map((group, idx) => {
              const isGroupExpanded = expandedGroups[group.pk.id] || false
              const claimableCount = group.benefits.filter(b => b.redeemable === '1' && !group.isExpired).length
              
              return (
                <Card 
                  key={group.pk.id} 
                  className="overflow-hidden border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* PK Header */}
                  <div className="relative p-6 cursor-pointer group border-b border-gray-200" onClick={() => toggleGroup(group.pk.id)}>
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b ${!group.isExpired ? 'from-green-500 to-emerald-500' : 'from-red-500 to-orange-500'} rounded-l-2xl`} />
                    
                    <div className="flex items-start justify-between gap-4 pl-3">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 shadow-lg group-hover:scale-105 transition-transform duration-300 hidden md:block">
                          <FileText size={20} className="text-primary hidden md:block" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                              {group.pk.program}
                            </h3>
                            {group.isExpired ? (
                              <Badge variant="destructive" className="text-[10px] gap-1 rounded-full">
                                <Clock size={10} /> {t('expired')}
                              </Badge>
                            ) : (
                              <Badge variant="default" className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1 rounded-full">
                                <Zap size={10} /> {t('active')}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={12} />
                              {formatDate(group.pk.start_at)} - {formatDate(group.pk.expired_at)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users size={12} />
                              {group.benefits.length} {group.benefits.length !== 1 ? t('benefitsPlural') : t('benefitsSingular')}
                            </span>
                            {!group.isExpired && claimableCount > 0 && (
                              <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                                <CheckCircle size={12} />
                                {claimableCount} {t('claimable')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/10 transition-colors">
                          {isGroupExpanded ? (
                            <ChevronUp size={20} className="text-muted-foreground" />
                          ) : (
                            <ChevronDown size={20} className="text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benefits Grid */}
                  {isGroupExpanded && (
                    <div className="p-6 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {group.benefits.map((benefit) => {
                          const expired = group.isExpired
                          const gradientColor = getBenefitColor(benefit.type)
                          const iconColor = getBenefitTextColor(benefit.type)
                          const isRedeemable = benefit.redeemable == '1'

                          // SEMUA benefit bisa diklik, tanpa param apapun
                          const detailUrl = `/benefits/${encodeId(Number(benefit.id_benefit_list))}`
                          
                          return (
                            <Link href={detailUrl} key={benefit.id_benefit_list}>
                              <div 
                                className={`group/card relative bg-gray-100/50 dark:bg-gray-800 rounded-2xl p-5 transition-all duration-300 overflow-hidden shadow-lg h-full flex flex-col cursor-pointer hover:shadow-2xl hover:-translate-y-1`}
                              >
                                {/* Gradient border on hover */}
                                <div className={`absolute inset-0 bg-linear-to-r ${gradientColor} opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 rounded-2xl`} style={{ padding: '2px' }} />
                                
                                <div className="relative flex flex-col h-full">
                                  {/* Header: Icon + Badge */}
                                  <div className="flex items-start justify-between mb-4">
                                    <div className={`p-2.5 rounded-xl bg-linear-to-r ${isRedeemable ? 'from-emerald-100 to-emerald-200' : gradientColor} shadow-md ${isRedeemable ? 'text-emerald-600' : iconColor}`}>
                                      {isRedeemable ? <Ticket size={18} /> : getBenefitIcon(benefit.type, 18)}
                                    </div>
                                    {expired ? (
                                      // <Badge variant="destructive" className="text-[10px] gap-1 rounded-full">
                                      //   <Clock size={10} /> {t('expired')}
                                      // </Badge>
                                      <Badge variant="outline" className="bg-white text-[10px] gap-1 rounded-full">
                                        <Eye size={10} /> {t('viewOnly')}
                                      </Badge>
                                    ) : isRedeemable ? (
                                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] gap-1 rounded-full">
                                        <CheckCircle size={10} /> {t('claimable')}
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="bg-white text-[10px] gap-1 rounded-full">
                                        <Eye size={10} /> {t('viewOnly')}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {/* Content: Title & Description */}
                                  <div className="flex-1">
                                    <h4 className="font-bold text-foreground text-base mb-2 line-clamp-2">
                                      {benefit.benefit_name}
                                    </h4>
                                    
                                    {benefit.subbenefit && (
                                      <p className="text-xs text-primary/70 mb-2 font-medium">
                                        {benefit.subbenefit}
                                      </p>
                                    )}
                                    
                                    <p style={{ whiteSpace: 'pre-line' }} className="whitespace-pre-line text-xs text-muted-foreground line-clamp-4 mb-4 leading-relaxed">
                                      {benefit.description?.replace(/\s+(\d+\.)/g, '\n$1').replace(/^\n/, '') || '-'}
                                    </p>
                                  </div>
                                  
                                  {/* Footer: Info dengan border top */}
                                  <div className="mt-auto pt-4 border-t border-gray-300 dark:border-gray-700">
                                    <div className="flex flex-wrap gap-2">
                                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-gray-50 dark:bg-gray-900/50 px-2.5 py-1 rounded-full">
                                        <Users size={12} /> {benefit.active_qty} {t('slots')}
                                      </span>
                                      {benefit.subject_benefit && (
                                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-gray-50 dark:bg-gray-900/50 px-2.5 py-1 rounded-full">
                                          <Tag size={12} /> {benefit.subject_benefit}
                                        </span>
                                      )}
                                      {benefit.pelaksanaan && (
                                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-gray-50 dark:bg-gray-900/50 px-2.5 py-1 rounded-full">
                                          <Calendar size={12} /> {benefit.pelaksanaan.length > 30 ? benefit.pelaksanaan.slice(0, 30) + '...' : benefit.pelaksanaan}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                      
                      {group.benefits.length === 0 && (
                        <div className="text-center py-16 text-muted-foreground">
                          <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                            <FileText size={48} className="opacity-30" />
                          </div>
                          <p className="text-sm">{t('noBenefitsFound')}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-20 text-center border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="p-5 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full">
                <FileText size={56} className="text-muted-foreground opacity-40" />
              </div>
              <p className="text-muted-foreground text-lg">{t('noBenefitsAvailable')}</p>
              {(selectedProgram !== 'all' || searchQuery) && (
                <Button variant="default" onClick={clearFilters} className="mt-2 shadow-lg hover:shadow-xl transition-all">
                  {t('clearFilters')}
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}