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
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Eye,
  FileText,
  Loader2,
  Search,
  X
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
  const [selectedProgram, setSelectedProgram] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Pagination states - Pagination per PK
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(1)

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

  // Filter logic
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
    setCurrentPage(1)
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
    setCurrentPage(1)
  }

  // ============ PAGINATION PER PK ============
  const totalPKs = filteredGroups.length
  const totalPages = Math.ceil(totalPKs / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentGroups = filteredGroups.slice(startIndex, endIndex)
  
  // Total benefits from filtered groups
  const totalBenefits = filteredGroups.reduce((acc, g) => acc + g.benefits.length, 0)
  const currentTotalBenefits = currentGroups.reduce((acc, g) => acc + g.benefits.length, 0)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
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
          
          {/* Ilustrasi - absolute di pojok kanan */}
          <div className="absolute right-10 md:top-1/2 top-1/2 -translate-y-1/2 md:block pointer-events-none">
            <img 
              src="/illustrations/trophy.png" 
              alt="benefits" 
              className="md:w-42 w-52 lg:w-62 h-auto md:opacity-40 opacity-20"
            />
          </div>
        </div>

        {/* Filter Section */}
        <div id="benefits-filter-section" className="bg-white rounded-lg border border-border p-4 mb-6 shadow-lg">
          {/* Desktop: yang kamu suka */}
          <div className="hidden md:flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {t('filterByProgram')}
              </span>
              
              <Select
                value={selectedProgram}
                onValueChange={(value) => setSelectedProgram(value)}
              >
                <SelectTrigger className="w-56 md:w-72 px-3 py-2 text-xs rounded-lg border-border bg-white focus:ring-primary">
                  <SelectValue placeholder={t('allPrograms')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer hover:bg-primary/10">
                    {t('allPrograms')} ({benefitGroups.reduce((acc, g) => acc + g.benefits.length, 0)} {t('benefits')})
                  </SelectItem>
                  {programOptions.map((program) => (
                    <SelectItem key={program.id} value={program.programName} className="cursor-pointer hover:bg-primary/10">
                      {program.programName} ({program.totalBenefits} {t('benefits')})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="benefits-search-input"
                  type="text"
                  placeholder={t('searchBenefits')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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

          {/* Mobile: compact yang kamu suka */}
          <div className="flex md:hidden flex-col gap-2">
            <div className="flex flex-col xs:flex-row gap-2 xs:items-center">
              <span className="text-xs font-medium text-foreground whitespace-nowrap">
                {t('filterByProgram')}
              </span>
              
              <Select
                value={selectedProgram}
                onValueChange={(value) => setSelectedProgram(value)}
              >
                <SelectTrigger className="w-full xs:w-48 px-2 py-1.5 text-xs rounded-lg border-border bg-white focus:ring-primary h-8">
                  <SelectValue placeholder={t('allPrograms')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer hover:bg-primary/10 text-xs">
                    {t('allPrograms')} ({benefitGroups.reduce((acc, g) => acc + g.benefits.length, 0)} {t('benefits')})
                  </SelectItem>
                  {programOptions.map((program) => (
                    <SelectItem key={program.id} value={program.programName} className="cursor-pointer hover:bg-primary/10 text-xs">
                      {program.programName} ({program.totalBenefits} {t('benefits')})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <>
            <div id="benefits-list" className="space-y-3 sm:space-y-4">
              {currentGroups.map((group) => {
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
                              {/* <Clock size={8} className="mr-0.5 sm:mr-1" /> */}
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
                              {/* <th className="text-left text-[10px] sm:text-xs font-medium text-muted-foreground px-2 sm:px-4 py-1.5 sm:py-2 w-8 sm:w-12">#</th> */}
                              <th className="text-left text-[10px] sm:text-xs font-medium text-white px-2 sm:px-4 py-1.5 sm:py-2 min-w-20 sm:min-w-30">{t('benefitName')}</th>
                              <th className="text-left text-[10px] sm:text-xs font-medium text-white px-2 sm:px-4 py-1.5 sm:py-2 hidden md:table-cell">{t('type')}</th>
                              {/* <th className="text-left text-[10px] sm:text-xs font-medium text-white px-2 sm:px-4 py-1.5 sm:py-2 hidden lg:table-cell">{t('subBenefit')}</th> */}
                              <th className="text-left text-[10px] sm:text-xs font-medium text-white px-2 sm:px-4 py-1.5 sm:py-2 hidden md:table-cell">{t('totalQuota')}</th>
                              <th className="text-left text-[10px] sm:text-xs font-medium text-white px-2 sm:px-4 py-1.5 sm:py-2 hidden md:table-cell">{t('remaining')}</th>
                              <th className="text-center text-[10px] sm:text-xs font-medium text-white px-2 sm:px-4 py-1.5 sm:py-2">{t('detail')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {group.benefits.map((benefit, index) => {
                              const detailUrl = `/benefits/${encodeId(Number(benefit.id_benefit_list))}`
                              
                              return (
                                <tr key={benefit.id_benefit_list} className="hover:bg-muted/10 transition-colors">
                                  {/* <td className="px-2 sm:px-4 py-1.5 sm:py-3 text-[10px] sm:text-xs text-muted-foreground">
                                    {index + 1}
                                  </td> */}
                                  <td className="px-2 sm:px-4 py-1.5 sm:py-3">
                                    <div>
                                      <div className="font-medium text-foreground text-[11px] sm:text-sm hover:text-primary transition-colors">
                                        <Link href={detailUrl}>{benefit.benefit_name}</Link>
                                      </div>
                                      {benefit.description && (
                                        <div className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5 md:block hidden">
                                          <p style={{ whiteSpace: 'pre-line' }} className="whitespace-pre-line text-xs text-muted-foreground line-clamp-4 mb-4 leading-relaxed">
                                            {benefit.description?.replace(/\s+(\d+\.)/g, '\n$1').replace(/^\n/, '') || '-'}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-2 sm:px-4 py-1.5 sm:py-3 hidden md:table-cell">
                                    <Badge className="text-[9px] bg-accent/10 text-accent border-gray-50 px-1.5 sm:px-2 py-0 sm:py-1">
                                      {benefit.subbenefit || '-'}
                                    </Badge>
                                  </td>
                                  {/* <td className="px-2 sm:px-4 py-1.5 sm:py-3 hidden lg:table-cell">
                                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                                      {benefit.subbenefit || '-'}
                                    </span>
                                  </td> */}
                                  <td className="px-2 sm:px-4 py-1.5 sm:py-3 hidden md:table-cell">
                                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                                      {benefit.active_quota?.total || 0}
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

            {/* Pagination Section */}
            {totalPKs > 0 && (
              <div className="flex flex-wrap items-center md:justify-between justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border">
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <span className="text-[10px] md:text-xs text-muted-foreground">{t('show')}</span>
                  <Select
                    value={String(itemsPerPage)}
                    onValueChange={handleItemsPerPageChange}
                  >
                    <SelectTrigger className="w-12 md:w-16 px-1.5 md:px-2 py-0.5 sm:py-1 text-[10px] md:text-xs rounded-lg border-border bg-white focus:ring-primary h-6 sm:h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 5, 10].map((item) => (
                        <SelectItem key={item} value={String(item)} className="text-xs sm:text-sm">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-xs md:text-xs text-muted-foreground hidden xs:inline">
                    {t('ofPKs', { total: totalPKs })}
                  </span>
                  <span className="text-xs text-muted-foreground xs:hidden">
                    / {totalPKs}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {/* Pagination */}
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-6 sm:h-8 px-1.5 sm:px-3 text-[11px] border-border hover:bg-primary/10 hover:text-primary disabled:opacity-50"
                    >
                      <ChevronLeft size={13} />
                      <span className="hidden sm:inline">{t('previous')}</span>
                    </Button>
                    
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className={`h-6 w-6 sm:h-8 sm:w-8 text-[11px] ${
                              currentPage === pageNum 
                                ? 'bg-primary text-white hover:bg-primary-dark' 
                                : 'border-border hover:bg-primary/10 hover:text-primary'
                            }`}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="text-[11px] text-muted-foreground">...</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            className="h-6 w-6 sm:h-8 sm:w-8 text-[11px] border-border hover:bg-primary/10 hover:text-primary"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-6 sm:h-8 px-1.5 sm:px-3 text-[11px] border-border hover:bg-primary/10 hover:text-primary disabled:opacity-50"
                    >
                      <span className="hidden sm:inline">{t('next')}</span>
                      <ChevronRight size={13} />
                    </Button>
                  </div>


                </div>
              </div>
            )}

            {/* Info Range - di samping pagination (1 baris) */}
            <div className="justify-center mt-2 flex items-center text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
              {t('showingPKRange', { 
                start: startIndex + 1, 
                end: Math.min(endIndex, totalPKs), 
                total: totalPKs,
                benefits: currentTotalBenefits
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8 sm:py-12 border border-border rounded-lg bg-white">
            <FileText size={32} className="text-muted-foreground/30 mx-auto mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base text-muted-foreground">{t('noBenefitsAvailable')}</p>
            {(selectedProgram !== 'all' || searchQuery) && (
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