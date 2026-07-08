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
  Search,
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
        
        {/* Hero Header - Seperti di gambar */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t('description')}
          </p>
          <p className="text-xs text-muted-foreground/60">
            {t('clickToViewDetail')}
          </p>
        </div>

        {/* Filter Section - Seperti di gambar */}
        <div 
          id="benefits-filter-section" 
          className="bg-white rounded-xl border border-border shadow-sm p-4 space-y-4"
        >
          {/* Filter by Program */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <Filter size={16} className="text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('filterByProgram')}
              </span>
            </div>
            
            <div className="flex-1">
              <Select
                value={selectedProgram}
                onValueChange={(value) => setSelectedProgram(value)}
              >
                <SelectTrigger className="w-full px-3 py-2 text-sm rounded-lg border-border bg-white focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder={t('allPrograms')} />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border bg-white shadow-lg">
                  <SelectItem value="all" className="cursor-pointer hover:bg-primary/10">
                    {t('allPrograms')} ({benefitGroups.reduce((acc, g) => acc + g.benefits.length, 0)})
                  </SelectItem>
                  {programOptions.map((program) => (
                    <SelectItem key={program.id} value={program.programName} className="cursor-pointer hover:bg-primary/10">
                      {program.programName} ({program.totalBenefits})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="benefits-search-input"
                type="text"
                placeholder={t('searchBenefits')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                className="h-9 px-3 text-xs gap-1.5 border-border hover:bg-muted"
              >
                <ChevronDown size={14} />
                <span>{t('expandAll')}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={collapseAll}
                className="h-9 px-3 text-xs gap-1.5 border-border hover:bg-muted"
              >
                <ChevronUp size={14} />
                <span>{t('collapseAll')}</span>
              </Button>
            </div>
          </div>

          {/* Results Counter */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {t('showingBenefits', { count: totalBenefits, pkCount: filteredGroups.length })}
              </span>
            </div>
            
            {(selectedProgram !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
              >
                <X size={12} className="mr-1" />
                {t('clearFilters')}
              </Button>
            )}
          </div>
        </div>

        {/* Benefits List */}
        {filteredGroups.length > 0 ? (
          <div id="benefits-list" className="space-y-4">
            {filteredGroups.map((group, idx) => {
              const isGroupExpanded = expandedGroups[group.pk.id] || false
              const claimableCount = group.benefits.filter(b => b.redeemable === '1' && !group.isExpired).length
              
              return (
                <Card 
                  key={group.pk.id} 
                  className="overflow-hidden border border-border shadow-sm bg-white transition-all duration-300 hover:shadow-md"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* PK Header - Seperti di gambar */}
                  <div 
                    className="px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors flex items-center justify-between"
                    onClick={() => toggleGroup(group.pk.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-base">
                          {group.pk.program}
                        </h3>
                        {group.isExpired ? (
                          <Badge variant="outline" className="text-[10px] text-red-500 border-red-200 bg-red-50 rounded-full">
                            <Clock size={10} className="mr-1" /> {t('expired')}
                          </Badge>
                        ) : (
                          <Badge className="text-[10px] bg-green-100 text-green-700 border-green-200 rounded-full">
                            <Zap size={10} className="mr-1" /> {t('active')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(group.pk.start_at)} - {formatDate(group.pk.expired_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Gift size={12} />
                          {group.benefits.length} {t('benefits')}
                        </span>
                        {!group.isExpired && claimableCount > 0 && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle size={12} />
                            {claimableCount} {t('claimable')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="shrink-0 ml-4">
                      <div className="p-1.5 rounded-full bg-muted/50 group-hover:bg-muted transition-colors">
                        {isGroupExpanded ? (
                          <ChevronUp size={16} className="text-muted-foreground" />
                        ) : (
                          <ChevronDown size={16} className="text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Benefits Grid - Seperti di gambar */}
                  {isGroupExpanded && (
                    <div className="px-5 pb-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {group.benefits.map((benefit) => {
                          const expired = group.isExpired
                          const gradientColor = getBenefitColor(benefit.type)
                          const iconColor = getBenefitTextColor(benefit.type)
                          const isRedeemable = benefit.redeemable == '1'

                          const detailUrl = `/benefits/${encodeId(Number(benefit.id_benefit_list))}`
                          
                          return (
                            <Link href={detailUrl} key={benefit.id_benefit_list}>
                              <div 
                                className="group/card relative bg-gray-50/80 rounded-xl p-4 transition-all duration-300 border border-border/50 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 h-full flex flex-col cursor-pointer"
                              >
                                <div className="flex flex-col h-full">
                                  {/* Title */}
                                  <h4 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
                                    {benefit.benefit_name}
                                  </h4>
                                  
                                  {/* Subbenefit */}
                                  {benefit.subbenefit && (
                                    <p className="text-xs text-primary/70 mb-1.5 font-medium">
                                      {benefit.subbenefit}
                                    </p>
                                  )}
                                  
                                  {/* Description */}
                                  <p className="text-xs text-muted-foreground line-clamp-3 mb-3 flex-1">
                                    {benefit.description?.replace(/\s+(\d+\.)/g, '\n$1').replace(/^\n/, '') || '-'}
                                  </p>
                                  
                                  {/* Footer Info */}
                                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
                                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-white px-2 py-0.5 rounded-full">
                                      <Users size={10} /> {benefit.active_qty} {t('slots')}
                                    </span>
                                    {benefit.pelaksanaan && (
                                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-white px-2 py-0.5 rounded-full">
                                        <Calendar size={10} /> {benefit.pelaksanaan.length > 20 ? benefit.pelaksanaan.slice(0, 20) + '...' : benefit.pelaksanaan}
                                      </span>
                                    )}
                                    {expired ? (
                                      <Badge variant="outline" className="text-[9px] gap-1 rounded-full ml-auto">
                                        <Eye size={9} /> {t('viewOnly')}
                                      </Badge>
                                    ) : isRedeemable ? (
                                      <Badge className="bg-green-100 text-green-700 text-[9px] gap-1 rounded-full ml-auto">
                                        <CheckCircle size={9} /> {t('claimable')}
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-[9px] gap-1 rounded-full ml-auto">
                                        <Eye size={9} /> {t('viewOnly')}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-12 text-center border border-border shadow-sm bg-white">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-muted rounded-full">
                <Gift size={40} className="text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground text-base">{t('noBenefitsAvailable')}</p>
              {(selectedProgram !== 'all' || searchQuery) && (
                <Button variant="default" onClick={clearFilters} className="mt-2">
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