// app/benefits/page.tsx
'use client'

import { BenefitsCTA } from '@/components/benefit/benefits-cta'
import OnBoardingTour from '@/components/OnboardingTour'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/lib/utils/date'
import { encodeId } from '@/lib/utils/hash'
import { sanitizeDisplay } from '@/lib/utils/sanitize-string'
import { BenefitGroupV2, FlattenedBenefit, PK } from '@/types/benefit/benefit.type'
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  FileText,
  Loader2,
  Search,
  X,
  Check,
  ChevronRight
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

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
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const loadBenefits = async () => {
      try {
        const res = await fetch('/api/mpartner/benefits/benefit', {
          method: 'POST',
        })
        const data = await res.json()
        console.log('data', data)
        if (data.status === 'error') {
          toast.error(data.message || t('failedToLoad'))
          setBenefitGroups([])
        } else {
          const groupsMap = new Map<string, BenefitGroupByPK>()
          
          data.data.benefits.forEach((pkg: BenefitGroupV2) => {
            const pk = pkg.related_pks[0]
            const pkId = pk.id
            const pkExpired = isExpired(pk.expired_at)
            const flattenedBenefits: FlattenedBenefit[] = []
            pkg.benefit_detail.forEach((benefit) => {
              const activeQuota = benefit.active_quota
              flattenedBenefits.push({
                id_benefit_list: benefit.id_benefit_list,
                benefit_name: sanitizeDisplay(benefit.benefit_name),
                subbenefit: benefit.subbenefit,
                description: benefit.description,
                qty: benefit.qty,
                qty2: benefit.qty2,
                qty3: benefit.qty3,
                active_quota: activeQuota,
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

  // Filter logic - Multiple programs
  useEffect(() => {
    let filtered = [...benefitGroups]
    
    // Filter by multiple programs
    if (selectedPrograms.length > 0) {
      filtered = filtered.filter(group => 
        selectedPrograms.includes(group.pk.program ?? group.pk.no_pk)
      )
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.map(group => ({
        ...group,
        benefits: group.benefits.filter(benefit => 
          benefit.benefit_name.toLowerCase().includes(query)
        )
      })).filter(group => group.benefits.length > 0)
    }
    
    setFilteredGroups(filtered)
  }, [selectedPrograms, searchQuery, benefitGroups])

  const toggleProgram = (programName: string) => {
    setSelectedPrograms(prev => {
      if (prev.includes(programName)) {
        return prev.filter(p => p !== programName)
      } else {
        return [...prev, programName]
      }
    })
  }

  const selectAllPrograms = () => {
    setSelectedPrograms([])
  }

  const isAllSelected = selectedPrograms.length === 0

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
    setSelectedPrograms([])
    setSearchQuery('')
  }

  const removeProgramFilter = (programName: string) => {
    setSelectedPrograms(prev => prev.filter(p => p !== programName))
  }

  const totalBenefits = filteredGroups.reduce((acc, g) => acc + g.benefits.length, 0)

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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-[80vh]">
      <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-6xl mx-auto">
        <OnBoardingTour pageName='benefits' steps={steps} />
        
        {/* Header */}
        <div className="mb-4 sm:mb-6 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between relative">
          <div className="flex-1 backdrop-blur-4xl md:backdrop-blur-none">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground"><span>{t('title1')}</span> <span className="text-primary">{t('title2')}</span></h1>
            <p className="text-sm sm:text-md text-muted-foreground mt-1 whitespace-pre-line max-w-2xl">
              {t('description')}
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div id="benefits-filter-section" className="bg-white rounded-lg border border-border p-4 mb-6 shadow-lg">
          {/* Desktop: Multiple Select */}
          <div className="hidden md:flex flex-row items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-xs font-medium text-foreground whitespace-nowrap pt-2">
                {t('filterByProgram')}
              </span>
              
              <div className="relative flex-1 max-w-md">
                <div 
                  className="w-full min-h-10 px-3 py-1.5 text-xs rounded-lg border border-border bg-white focus:ring-primary cursor-pointer flex flex-wrap items-center gap-1"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedPrograms.length === 0 ? (
                    <span className="text-muted-foreground text-xs py-1">{t('allPrograms')}</span>
                  ) : (
                    selectedPrograms.map((program) => (
                      <Badge 
                        key={program} 
                        className="bg-primary/10 text-primary border-primary/20 text-[10px] px-2 py-0.5 flex items-center gap-1"
                      >
                        {program.length > 20 ? program.slice(0, 20) + '...' : program}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            removeProgramFilter(program)
                          }}
                          className="hover:text-destructive cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))
                  )}
                  <ChevronDown size={14} className="ml-auto text-muted-foreground" />
                </div>
                
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                      <div 
                        className="px-3 py-2 hover:bg-muted/50 cursor-pointer flex items-center gap-2 border-b border-border"
                        onClick={() => {
                          selectAllPrograms()
                          setIsDropdownOpen(false)
                        }}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isAllSelected ? 'bg-primary border-primary' : 'border-border'}`}>
                          {isAllSelected && <Check size={12} className="text-white" />}
                        </div>
                        <span className="text-xs font-medium">{t('allPrograms')}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          ({benefitGroups.reduce((acc, g) => acc + g.benefits.length, 0)} {t('benefits')})
                        </span>
                      </div>
                      {programOptions.map((program) => {
                        const isSelected = selectedPrograms.includes(program.programName)
                        return (
                          <div 
                            key={program.id} 
                            className="px-3 py-2 hover:bg-muted/50 cursor-pointer flex items-center gap-2 border-b border-border/50 last:border-0"
                            onClick={() => toggleProgram(program.programName)}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-border'}`}>
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                            <span className="text-sm">{program.programName}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              ({program.totalBenefits} {t('benefits')})
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="benefits-search-input"
                  type="text"
                  placeholder={t('searchBenefits')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 text-xs rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <X size={14} className="text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-1" id="benefits-expand-buttons">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={expandAll}
                  className="border! border-accent/10 bg-accent/5 text-accent/80 h-8 px-2 text-xs hover:text-accent hover:bg-white"
                >
                  <ChevronDown size={14} />
                  <span className="hidden sm:inline">{t('expandAll')}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={collapseAll}
                  className="border! border-accent/10 bg-accent/5 text-accent/80 h-8 px-2 text-xs hover:text-accent hover:bg-white"
                >
                  <ChevronUp size={14} />
                  <span className="hidden sm:inline">{t('collapseAll')}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile: compact */}
          <div className="flex md:hidden flex-col gap-2">
            <div className="flex flex-col xs:flex-row gap-2 xs:items-center">
              <span className="text-xs font-medium text-foreground whitespace-nowrap">
                {t('filterByProgram')}
              </span>
              
              <div className="relative flex-1">
                <div 
                  className="w-full min-h-8 px-2 py-1 text-xs rounded-lg border border-border bg-white focus:ring-primary cursor-pointer flex flex-wrap items-center gap-1"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedPrograms.length === 0 ? (
                    <span className="text-muted-foreground text-xs py-0.5">{t('allPrograms')}</span>
                  ) : (
                    selectedPrograms.slice(0, 2).map((program) => (
                      <Badge 
                        key={program} 
                        className="bg-primary/10 text-primary border-primary/20 text-[8px] px-1.5 py-0 flex items-center gap-0.5"
                      >
                        {program.length > 10 ? program.slice(0, 10) + '...' : program}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            removeProgramFilter(program)
                          }}
                          className="hover:text-destructive"
                        >
                          <X size={10} />
                        </button>
                      </Badge>
                    ))
                  )}
                  {selectedPrograms.length > 2 && (
                    <Badge className="bg-muted text-muted-foreground text-[8px] px-1.5 py-0">
                      +{selectedPrograms.length - 2}
                    </Badge>
                  )}
                  <ChevronDown size={12} className="ml-auto text-muted-foreground" />
                </div>
                
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                      <div 
                        className="px-3 py-2 hover:bg-muted/50 cursor-pointer flex items-center gap-2 border-b border-border"
                        onClick={() => {
                          selectAllPrograms()
                          setIsDropdownOpen(false)
                        }}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isAllSelected ? 'bg-primary border-primary' : 'border-border'}`}>
                          {isAllSelected && <Check size={12} className="text-white" />}
                        </div>
                        <span className="text-xs font-medium">{t('allPrograms')}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          ({benefitGroups.reduce((acc, g) => acc + g.benefits.length, 0)} {t('benefits')})
                        </span>
                      </div>
                      {programOptions.map((program) => {
                        const isSelected = selectedPrograms.includes(program.programName)
                        return (
                          <div 
                            key={program.id} 
                            className="px-3 py-2 hover:bg-muted/50 cursor-pointer flex items-center gap-2 border-b border-border/50 last:border-0"
                            onClick={() => toggleProgram(program.programName)}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-border'}`}>
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                            <span className="text-sm">{program.programName}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              ({program.totalBenefits} {t('benefits')})
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-2 items-stretch xs:items-center">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="benefits-search-input"
                  type="text"
                  placeholder={t('searchBenefits')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-7 py-1.5 text-xs rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-8"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <X size={13} className="text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-1" id="benefits-expand-buttons">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={expandAll}
                  className="border! border-accent/10 bg-accent/5 text-accent/80 h-8 px-2 text-xs hover:text-accent hover:bg-white"
                >
                  <ChevronDown size={11} />
                  <span className="hidden xs:inline">{t('expandAll')}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={collapseAll}
                  className="border! border-accent/10 bg-accent/5 text-accent/80 h-8 px-2 text-xs hover:text-accent hover:bg-white"
                >
                  <ChevronUp size={11} />
                  <span className="hidden xs:inline">{t('collapseAll')}</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
            <span className="md:text-xs text-[10px] text-muted-foreground">
              {t('showingPKs', { 
                pkCount: filteredGroups.length,
                benefitCount: totalBenefits
              })}
            </span>
            {searchQuery && (
              <span className="md:text-xs text-[10px] text-muted-foreground">
                {t('searchResults', { count: totalBenefits })}
              </span>
            )}
          </div>
        </div>

        {/* Benefits List */}
        {filteredGroups.length > 0 ? (
          <div id="benefits-list" className="space-y-3 sm:space-y-4">
            {filteredGroups.map((group) => {
              const isGroupExpanded = expandedGroups[group.pk.id] || false
              
              return (
                <div key={group.pk.id} className="border border-border rounded-lg overflow-hidden bg-white shadow-md">
                  {/* PK Header */}
                  <div 
                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-muted/30 transition-colors border-b border-border"
                    onClick={() => toggleGroup(group.pk.id)}
                  >
                    <button className="shrink-0">
                      {isGroupExpanded ? (
                        <ChevronDown size={14} className="text-muted-foreground sm:hidden" />
                      ) : (
                        <ChevronRight size={14} className="text-muted-foreground sm:hidden" />
                      )}
                      {isGroupExpanded ? (
                        <ChevronDown size={16} className="text-muted-foreground hidden sm:block" />
                      ) : (
                        <ChevronRight size={16} className="text-muted-foreground hidden sm:block" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="font-semibold text-foreground text-xs sm:text-sm">
                          {group.pk.program}
                        </span>
                        {group.isExpired ? (
                          <Badge variant="outline" className="text-[8px] sm:text-[10px] text-destructive border-destructive/30 px-1.5 sm:px-2 py-0 sm:py-0.5 bg-primary/5">
                            {t('expired')}
                          </Badge>
                        ) : (
                          <Badge className="text-[8px] sm:text-[10px] bg-green-50 text-green-600 border-green-200 px-1.5 sm:px-2 py-0 sm:py-0.5">
                            {t('active')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                        <span>{formatDate(group.pk.start_at)} - {formatDate(group.pk.expired_at)}</span>
                        <span className="hidden xs:inline">•</span>
                        <span>{group.benefits.length} {t('benefits')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits Rows - Table */}
                  {isGroupExpanded && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm min-w-123 sm:min-w-150">
                        <thead>
                          <tr className="bg-primary border-b border-border">
                            <th className="text-left text-[10px] sm:text-xs font-medium text-white px-2 sm:px-4 py-1.5 sm:py-2 min-w-20 sm:min-w-30">{t('benefitName')}</th>
                            <th className="text-left text-[10px] sm:text-xs font-medium text-white px-2 sm:px-4 py-1.5 sm:py-2 hidden md:table-cell">{t('totalQuota')}</th>
                            <th className="text-left text-[10px] sm:text-xs font-medium text-white px-2 sm:px-4 py-1.5 sm:py-2 hidden md:table-cell">{t('used')}</th>
                            <th className="text-left text-[10px] sm:text-xs font-medium text-white px-2 sm:px-4 py-1.5 sm:py-2 hidden md:table-cell">{t('remaining')}</th>
                            <th className="text-center text-[10px] sm:text-xs font-medium text-white px-2 sm:px-4 py-1.5 sm:py-2">{t('detail')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {group.benefits.map((benefit) => {
                            const detailUrl = `/benefits/${encodeId(Number(benefit.id_benefit_list))}`
                            
                            return (
                              <tr key={benefit.id_benefit_list} className="hover:bg-muted/10 transition-colors">
                                <td className="px-2 sm:px-4 py-1.5 sm:py-3">
                                  <div>
                                    <div className="font-medium text-foreground text-[11px] sm:text-sm hover:text-primary transition-colors">
                                      <Link href={detailUrl}>{benefit.benefit_name}</Link>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-2 sm:px-4 py-1.5 sm:py-3 hidden md:table-cell">
                                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                                    {benefit.active_quota?.total || 0}
                                  </span>
                                </td>
                                <td className="px-2 sm:px-4 py-1.5 sm:py-3 hidden md:table-cell">
                                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                                    {benefit.active_quota?.used || 0}
                                  </span>
                                </td>
                                <td className="px-2 sm:px-4 py-1.5 sm:py-3 hidden md:table-cell">
                                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                                    {benefit.active_quota?.available || 0}
                                  </span>
                                </td>
                                <td className="px-2 sm:px-4 py-1.5 sm:py-3 text-right">
                                  <Link href={detailUrl}>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-6 sm:h-7 md:text-[11px] text-[10px] text-primary hover:text-primary-dark hover:bg-primary/10"
                                    >
                                      <span className="md:hidden inline">{t('view')}</span>
                                      <span className="md:inline hidden">{t('viewDetail')}</span>
                                      <Eye size={12} />
                                    </Button>
                                  </Link>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 border border-border rounded-lg bg-white">
            <FileText size={32} className="text-muted-foreground/30 mx-auto mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base text-muted-foreground">{t('noBenefitsAvailable')}</p>
            {(selectedPrograms.length > 0 || searchQuery) && (
              <Button 
                variant="outline" 
                onClick={clearFilters} 
                className="mt-2 sm:mt-3 border-primary text-primary hover:bg-primary/10 text-xs sm:text-sm"
              >
                {t('clearFilters')}
              </Button>
            )}
          </div>
        )}
        <BenefitsCTA />
      </div>
    </div>

  )
}