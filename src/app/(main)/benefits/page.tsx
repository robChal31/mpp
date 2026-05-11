// app/benefits/page.tsx
'use client'

import { useState, useEffect, JSX } from 'react'
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
  X
} from 'lucide-react'
import { formatDate } from '@/lib/utils/date'
import { BenefitGroupV2, FlattenedBenefit, PK } from '@/types/benefit/benefit.type'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const getBenefitIcon = (type: string, size: number = 20) => {
  const icons: Record<string, JSX.Element> = {
    'Curriculum & Training': <BookOpen size={size} />,
    'Guest English Teacher': <Mic size={size} />,
    'Pengembangan Pimpinan': <Briefcase size={size} />,
    'Training Kolektif Online': <Globe size={size} />,
    'Training Kolektif Offline': <Users size={size} />,
    'Masterclass Digital': <TrendingUp size={size} />,
    'Pelajar Berkreasi': <Trophy size={size} />,
    'Jambore': <Star size={size} />
  }
  return icons[type] || <Gift size={size} />
}

const getBenefitColor = (type: string) => {
  const colors: Record<string, string> = {
    'Curriculum & Training': 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
    'Guest English Teacher': 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
    'Pengembangan Pimpinan': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400',
    'Training Kolektif Online': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-400',
    'Training Kolektif Offline': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    'Masterclass Digital': 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    'Pelajar Berkreasi': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
    'Jambore': 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400'
  }
  return colors[type] || 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
}

const isExpired = (expiredAt: string) => {
  return new Date(expiredAt) < new Date()
}

// Interface untuk benefit group berdasarkan PK
interface BenefitGroupByPK {
  pk: PK
  benefits: FlattenedBenefit[]
  isExpired: boolean
}

// ============ MAIN COMPONENT ============
export default function BenefitsPage() {
  const t = useTranslations('Benefits')
  const [benefitGroups, setBenefitGroups] = useState<BenefitGroupByPK[]>([])
  const [filteredGroups, setFilteredGroups] = useState<BenefitGroupByPK[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [selectedPK, setSelectedPK] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Fetch benefits
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
          // Group by PK (benefit_id)
          const groupsMap = new Map<string, BenefitGroupByPK>()
          
          data.data.benefits.forEach((pkg: BenefitGroupV2) => {
            const pk = pkg.related_pks[0]
            const pkId = pk.id
            const pkExpired = isExpired(pk.expired_at)
            
            // Flatten benefits untuk PK ini
            const flattenedBenefits: FlattenedBenefit[] = []
            pkg.benefit_detail.forEach((benefit) => {
              flattenedBenefits.push({
                id_benefit_list: benefit.id_benefit_list,
                benefit_name: benefit.benefit_name,
                subbenefit: benefit.subbenefit,
                description: benefit.description,
                qty: benefit.qty,
                qty2: benefit.qty2,
                qty3: benefit.qty3,
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
            
            // Cek apakah sudah ada group dengan PK ini
            if (groupsMap.has(pkId)) {
              const existing = groupsMap.get(pkId)!
              existing.benefits.push(...flattenedBenefits)
            } else {
              groupsMap.set(pkId, {
                pk: pk,
                benefits: flattenedBenefits,
                isExpired: pkExpired
              })
            }
          })
          
          const groups = Array.from(groupsMap.values())
          setBenefitGroups(groups)
          setFilteredGroups(groups)
          
          // Set initial expanded state (expand all by default)
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

  // Apply filters
  useEffect(() => {
    let filtered = [...benefitGroups]
    
    // Filter by PK
    if (selectedPK !== 'all') {
      filtered = filtered.filter(group => group.pk.id === selectedPK)
    }
    
    // Filter by search query (cari di benefit_name)
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
  }, [selectedPK, searchQuery, benefitGroups])

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
    setSelectedPK('all')
    setSearchQuery('')
  }

  // Get unique PKs for filter
  const uniquePKs = Array.from(new Map(benefitGroups.map(group => [group.pk.id, group])).values())

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground text-sm">
          {t('description')}
        </p>
      </div>

      {/* Filter Section */}
      <div className="space-y-3">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{t('filterByPK')}</span>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedPK === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPK('all')}
                className="h-7 px-3 text-xs"
              >
                {t('allPKs')}
              </Button>
              {uniquePKs.map((group) => (
                <Button
                  key={group.pk.id}
                  variant={selectedPK === group.pk.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPK(group.pk.id)}
                  className="h-7 px-3 text-xs"
                >
                  {group.pk.no_pk.replace(/&#39;/, "'").slice(0, 15)}...
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <input
              type="text"
              placeholder={t('searchBenefits')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-48"
            />
            
            {/* Expand/Collapse Buttons */}
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={expandAll}
                className="h-8 px-2 text-xs"
                title={t('expandAll')}
              >
                <ChevronDown size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={collapseAll}
                className="h-8 px-2 text-xs"
                title={t('collapseAll')}
              >
                <ChevronUp size={14} />
              </Button>
            </div>
            
            {/* Clear Filters */}
            {(selectedPK !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 text-xs gap-1 text-red-500 hover:text-red-600"
              >
                <X size={14} />
                {t('clear')}
              </Button>
            )}
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(selectedPK !== 'all' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground">{t('activeFilters')}</span>
            {selectedPK !== 'all' && (
              <Badge variant="secondary" className="text-xs gap-1">
                PK: {uniquePKs.find(g => g.pk.id === selectedPK)?.pk.no_pk.replace(/&#39;/, "'").slice(0, 15)}...
                <X 
                  size={10} 
                  className="cursor-pointer hover:text-red-500" 
                  onClick={() => setSelectedPK('all')}
                />
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="text-xs gap-1">
                {t('search')}: {searchQuery}
                <X 
                  size={10} 
                  className="cursor-pointer hover:text-red-500" 
                  onClick={() => setSearchQuery('')}
                />
              </Badge>
            )}
          </div>
        )}
        
        {/* Results Count */}
        <div className="text-xs text-muted-foreground">
          {t('showingBenefits', { 
            count: filteredGroups.reduce((acc, g) => acc + g.benefits.length, 0),
            pkCount: filteredGroups.length 
          })}
        </div>
      </div>

      {/* Benefits List - Grouped by PK */}
      <div className="space-y-4">
        {filteredGroups.map((group) => {
          const isGroupExpanded = expandedGroups[group.pk.id] || false
          const hasActiveBenefits = group.benefits.some(b => b.redeemable === '1' && !group.isExpired)
          
          return (
            <Card key={group.pk.id} className="overflow-hidden border-border">
              {/* PK Header */}
              <div 
                className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                  !hasActiveBenefits ? 'opacity-80' : ''
                }`}
                onClick={() => toggleGroup(group.pk.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Gift size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">
                          PK: {group.pk.no_pk.replace(/&#39;/, "'")}
                        </h3>
                        {group.isExpired ? (
                          <Badge variant="destructive" className="text-[10px]">{t('expired')}</Badge>
                        ) : (
                          <Badge variant="default" className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            {t('active')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {t('valid')}: {formatDate(group.pk.start_at)} - {formatDate(group.pk.expired_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={10} />
                          {group.benefits.length} {group.benefits.length !== 1 ? t('benefitsPlural') : t('benefitsSingular')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!group.isExpired && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1 text-[10px]">
                        <CheckCircle size={10} />
                        {group.benefits.filter(b => b.redeemable === '1').length} {t('claimable')}
                      </Badge>
                    )}
                    {isGroupExpanded ? (
                      <ChevronUp size={18} className="text-muted-foreground" />
                    ) : (
                      <ChevronDown size={18} className="text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {/* Benefits List - Collapsible */}
              {isGroupExpanded && (
                <div className="p-4 space-y-3">
                  {group.benefits.map((benefit) => {
                    const expired = group.isExpired
                    const colorClass = getBenefitColor(benefit.type)
                    const isRedeemable = benefit.redeemable === '1'
                    const canClick = isRedeemable && !expired
                    
                    return (
                      <Card 
                        key={benefit.id_benefit_list}
                        className={`p-4 transition-all ${
                          canClick 
                            ? 'cursor-pointer hover:shadow-md hover:border-primary' 
                            : 'opacity-75'
                        }`}
                        onClick={() => {
                          if (canClick) {
                            window.location.href = `/benefits/${benefit.id_benefit_list}`
                          }
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${colorClass} shrink-0`}>
                            {getBenefitIcon(benefit.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className={`flex flex-wrap items-center gap-2 ${benefit.subject_benefit ? '' : 'mb-1'}`}>
                              <h4 className="font-semibold">{benefit.benefit_name}</h4>
                              {benefit.subbenefit && (
                                <span className="text-xs text-muted-foreground">
                                  {benefit.subbenefit}
                                </span>
                              )}
                            </div>
                            {benefit.subject_benefit && (
                              <p className='text-[11px] text-gray-500 mb-1'>
                                {t('subject')}: <span className='font-bold'>{benefit.subject_benefit}</span>
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {benefit.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2">
                              <span className="flex items-center gap-1">
                                <Users size={12} /> {benefit.qty} {t('slots')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={12} /> {benefit.pelaksanaan}
                              </span>
                            </div>
                          </div>
                          
                          <div className="shrink-0">
                            {expired ? (
                              <Badge variant="destructive">{t('expired')}</Badge>
                            ) : !isRedeemable ? (
                              <></>
                            ) : (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                                <CheckCircle size={12} /> {t('claimable')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                  
                  {group.benefits.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {t('noBenefitsFound')}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {filteredGroups.length === 0 && (
        <Card className="p-12 text-center text-muted-foreground">
          {t('noBenefitsAvailable')}
        </Card>
      )}
    </div>
  )
}