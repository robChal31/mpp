// components/benefit/benefit-report.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { encodeId } from '@/lib/utils/hash'
import { sanitizeDisplay } from '@/lib/utils/sanitize-string'
import { BenefitGroupV2 } from '@/types/benefit/benefit.type'
import {
    Activity,
    AlertCircle,
    BarChart3,
    CheckCircle,
    Circle,
    Dot,
    Download,
    FileText,
    XCircle,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface BenefitReportData {
    id_benefit_list: string
    benefit_name: string
    total_quota: number
    used_quota: number
    remaining_quota: number
    percentage: number
    status: 'full' | 'partial' | 'empty'
}

interface BenefitGroupByPK {
    pkId: string
    pkName: string
    pkNo: string
    isExpired: boolean
    benefits: BenefitReportData[]
}

interface ListProgramI {
    id: string
    no_pk: string
    program: string
    total_benefit: number
}

const isExpired = (expiredAt: string) => {
    return new Date(expiredAt) < new Date()
}

export function BenefitReport() {
    const [selectedPk, setSelectedPk] = useState<string>('')
    const [listPrograms, setListPrograms] = useState<ListProgramI[]>([])
    const [reportData, setReportData] = useState<BenefitGroupByPK[]>([])
    const [loading, setLoading] = useState(true)
    const t = useTranslations('Benefits')

    const selectedPkData = reportData.find((p) => p.pkId === selectedPk)
    const selectedPkName = selectedPkData?.pkName || ''
    const filteredData = selectedPkData?.benefits || []

    const totalBenefits = filteredData.length
    const totalQuota = filteredData.reduce((acc, d) => acc + d.total_quota, 0)
    const usedQuota = filteredData.reduce((acc, d) => acc + d.used_quota, 0)
    const overallPercentage = totalQuota > 0 ? (usedQuota / totalQuota) * 100 : 0

    useEffect(() => {
        const loadBenefits = async () => {
            try {
                const res = await fetch('/api/mpartner/benefits/benefit', {
                    method: 'POST',
                })
                const data = await res.json()
                if (data.status === 'error') {
                    toast.error(data.message || t('failedToLoad'))
                    setListPrograms([])
                    setReportData([])
                } else {
                    const benefitsData = data.data?.benefits || []

                    const pkMap = new Map<
                        string,
                        {
                            pkId: string
                            pkName: string
                            pkNo: string
                            isExpired: boolean
                            benefits: BenefitReportData[]
                        }
                    >()
                    const programMap = new Map<string, ListProgramI>()

                    benefitsData.forEach((pkg: BenefitGroupV2) => {
                        const pk = pkg.related_pks[0]
                        if (!pk) return

                        const pkId = pk.id
                        const pkExpired = isExpired(pk.expired_at)

                        // 🔥 Loop benefit_detail, ambil active_quota dari benefit
                        pkg.benefit_detail.forEach((benefit) => {
                            const benefitName = sanitizeDisplay(benefit.benefit_name)
                            
                            // 🔥 active_quota sekarang di benefit, bukan di pk
                            const activeQuota = benefit.active_quota || { total: 0, used: 0, available: 0 }
                            
                            const totalQuotaPerBenefit = activeQuota.total || 0
                            const usedQuotaPerBenefit = activeQuota.used || 0
                            const remainingQuota = activeQuota.available || 0
                            const percentage =
                                totalQuotaPerBenefit > 0 ? (usedQuotaPerBenefit / totalQuotaPerBenefit) * 100 : 0

                            let status: 'full' | 'partial' | 'empty' = 'empty'
                            if (remainingQuota === 0 && totalQuotaPerBenefit > 0) {
                                status = 'full'
                            } else if (remainingQuota > 0 && usedQuotaPerBenefit > 0) {
                                status = 'partial'
                            } else {
                                status = 'empty'
                            }

                            if (!pkMap.has(pkId)) {
                                pkMap.set(pkId, {
                                    pkId,
                                    pkName: sanitizeDisplay(pk.program) || pk.no_pk,
                                    pkNo: pk.no_pk,
                                    isExpired: pkExpired,
                                    benefits: [],
                                })
                            }

                            const pkGroup = pkMap.get(pkId)!

                            const existingBenefit = pkGroup.benefits.find(
                                (b) => b.id_benefit_list === benefit.id_benefit_list
                            )

                            if (!existingBenefit) {
                                pkGroup.benefits.push({
                                    id_benefit_list: benefit.id_benefit_list,
                                    benefit_name: benefitName,
                                    total_quota: totalQuotaPerBenefit,
                                    used_quota: usedQuotaPerBenefit,
                                    remaining_quota: remainingQuota,
                                    percentage,
                                    status,
                                })
                            }
                        })

                        if (!programMap.has(pkId)) {
                            programMap.set(pkId, {
                                id: pkId,
                                program: sanitizeDisplay(pk.program) || pk.no_pk,
                                no_pk: pk.no_pk,
                                total_benefit: pkg.benefit_detail.length,
                            })
                        }
                    })

                    const reportDataArray = Array.from(pkMap.values())
                    const programArray = Array.from(programMap.values())

                    setReportData(reportDataArray)
                    setListPrograms(programArray)

                    if (programArray.length > 0 && !selectedPk) {
                        setSelectedPk(programArray[0].id)
                    }
                }
            } catch (err) {
                console.error(err)
                toast.error(t('failedToLoad'))
            } finally {
                setLoading(false)
            }
        }
        loadBenefits()
    }, [t])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8 sm:py-12">
                <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-b-2 border-primary" />
            </div>
        )
    }

    if (listPrograms.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-white py-8 text-center sm:py-12">
                <FileText size={28} className="mx-auto mb-2 text-muted-foreground/20 sm:mb-3 sm:text-[36px]" />
                <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                    {t('noProgramsAvailable')}
                </p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-6xl space-y-4 px-3 sm:space-y-5 sm:px-4 md:px-0">
            {/* Header */}
            <div className="space-y-0.5">
                <div className="flex items-center gap-3">
                    <p className="text-xs font-bold tracking-widest text-primary uppercase">
                        {t('reportLabel')}
                    </p>
                    <div className="h-0.5 w-12 rounded-full bg-linear-to-r from-primary to-secondary sm:w-16" />
                </div>
                <h2 className="text-xl font-bold leading-tight text-foreground sm:text-2xl lg:text-3xl">
                    {t('reportTitle')}
                </h2>
                <p className="text-xs text-muted-foreground sm:text-sm">{t('reportDescription')}</p>
            </div>

            {/* Program Selector */}
            <div className="relative rounded-xl border border-border bg-linear-to-r from-primary/5 via-white to-secondary/5 p-3 sm:p-5">
                <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/5 blur-2xl sm:h-24 sm:w-24" />
                <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-secondary/5 blur-2xl sm:h-24 sm:w-24" />

                <div className="relative flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2">
                                <BarChart3 size={16} className="text-primary sm:text-[18px]" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground sm:text-lg">
                                {t('programList')}
                            </h3>
                        </div>
                        <span className="text-[10px] text-muted-foreground sm:text-xs">
                            {listPrograms.length} {t('programs')}
                        </span>
                    </div>

                    {/* Mobile: Dropdown */}
                    <div className="block sm:hidden">
                        <Select value={selectedPk} onValueChange={setSelectedPk}>
                            <SelectTrigger className="h-9 w-full rounded-lg border-border bg-white px-3 py-1.5 text-xs focus:ring-primary">
                                <SelectValue placeholder={t('selectProgram')} />
                            </SelectTrigger>
                            <SelectContent>
                                {listPrograms.map((program) => (
                                    <SelectItem
                                        key={program.id}
                                        value={program.id}
                                        className="cursor-pointer text-xs hover:bg-primary/10 hover:text-primary"
                                    >
                                        {program.program} ({program.total_benefit}{' '}
                                        {t('benefits')})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Desktop: Card Grid */}
                    <div className="hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                        {listPrograms.map((program) => {
                            const isSelected = selectedPk === program.id
                            const progData = reportData.find((p) => p.pkId === program.id)
                            const progBenefits = progData?.benefits || []
                            const totalQ = progBenefits.reduce((acc, b) => acc + b.total_quota, 0)
                            const usedQ = progBenefits.reduce((acc, b) => acc + b.used_quota, 0)
                            const pct = totalQ > 0 ? (usedQ / totalQ) * 100 : 0

                            return (
                                <div
                                    key={program.id}
                                    onClick={() => setSelectedPk(program.id)}
                                    className={`cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 sm:p-4 ${
                                        isSelected
                                            ? 'border-primary bg-linear-to-br from-primary/5 via-white to-secondary/5 shadow-md'
                                            : 'border-border bg-white hover:border-primary/30'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p
                                                className={`text-sm font-semibold ${
                                                    isSelected ? 'text-primary' : 'text-foreground'
                                                }`}
                                            >
                                                {program.program}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {program.total_benefit} {t('benefits')}
                                            </p>
                                        </div>
                                        <div className={`text-right ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                                            <p className="text-base font-bold sm:text-lg">{pct.toFixed(0)}%</p>
                                            <p className="text-[8px] uppercase tracking-wider">{t('used')}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted sm:mt-3">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${
                                                isSelected ? 'bg-primary' : 'bg-primary/40'
                                            }`}
                                            style={{ width: `${Math.min(pct, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <p className="text-[10px] text-muted-foreground sm:text-xs">
                        {selectedPkName} • {totalBenefits} {t('benefits')}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="rounded-xl border border-border bg-linear-to-r from-primary/5 to-secondary/5 p-3 sm:p-4">
                <div className="mb-2 flex flex-col gap-1 xs:flex-row xs:items-center xs:justify-between">
                    <div className="flex items-center gap-2">
                        <Activity size={14} className="text-primary" />
                        <span className="text-xs font-medium text-foreground">{t('quotaUsage')}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">{usedQuota}</span> {t('used')}
                        </span>
                        <span className="text-muted-foreground">
                            {t('from')} <span className="font-medium text-foreground">{totalQuota}</span>
                        </span>
                        <span className="font-bold text-primary">{overallPercentage.toFixed(1)}%</span>
                    </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-primary/20 sm:h-2.5">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${Math.min(overallPercentage, 100)}%` }}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-[10px] sm:text-sm">
                        <thead>
                            <tr className="border-b border-border bg-primary text-white">
                                <th className="min-w-25 w-3/5 px-2 py-2 text-left text-[9px] font-semibold sm:min-w-40 sm:px-4 sm:py-3 sm:text-xs">
                                    {t('benefitName')}
                                </th>
                                <th className="px-2 py-2 text-center text-[9px] font-semibold sm:px-4 sm:py-3 sm:text-xs">
                                    {t('totalQuota')}
                                </th>
                                <th className="px-2 py-2 text-center text-[9px] font-semibold sm:px-4 sm:py-3 sm:text-xs">
                                    {t('remaining')}
                                </th>
                                <th className="px-2 py-2 text-center text-[9px] font-semibold sm:px-4 sm:py-3 sm:text-xs">
                                    {t('percentage')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredData.length > 0 ? (
                                filteredData.map((data, index) => (
                                    <tr
                                        key={data.id_benefit_list}
                                        className={`transition-colors hover:bg-muted/20 ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-muted/5'
                                        }`}
                                    >
                                        <td className="px-2 py-2 sm:px-4 sm:py-3">
                                            <Link 
                                                href={`/benefits/${encodeId(Number(data.id_benefit_list))}`} 
                                                className="flex items-center gap-1.5 sm:gap-2 hover:gap-3 group/linktd"
                                            >
                                                <Dot size={14} className="text-primary md:inline hidden transition-transform duration-300 group-hover/linktd:scale-110" />
                                                <span className="group-hover/linktd:text-primary group-hover/linktd:scale-[1.02] group-hover/linktd:translate-x-0.5 transition-all duration-300 line-clamp-3 text-[9px] font-medium text-foreground sm:text-sm">
                                                    {data.benefit_name}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-2 py-2 text-center text-[9px] font-medium text-foreground sm:px-4 sm:py-3 sm:text-sm">
                                            {data.total_quota}
                                        </td>
                                        <td className="px-2 py-2 text-center text-[9px] font-medium text-foreground sm:px-4 sm:py-3 sm:text-sm">
                                            {data.remaining_quota}
                                        </td>
                                        <td className="px-2 py-2 text-center sm:px-4 sm:py-3">
                                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                                                <span className="text-[9px] font-medium text-primary sm:text-sm">
                                                    {data.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-2 py-8 text-center text-muted-foreground sm:px-4 sm:py-12">
                                        <FileText size={24} className="mx-auto mb-2 text-muted-foreground/20 sm:mb-3 sm:text-[36px]" />
                                        <p className="text-[10px] font-medium sm:text-sm">{t('noBenefitsData')}</p>
                                        <p className="mt-1 text-[9px] text-muted-foreground/70 sm:text-xs">
                                            {t('selectAnotherProgram')}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-1 px-1 text-[8px] text-muted-foreground sm:gap-2 sm:text-[10px]">
                <span>
                    {t('showingBenefitsFrom', {
                        count: filteredData.length,
                        program: selectedPkName,
                    })}
                </span>
            </div>
        </div>
    )
}