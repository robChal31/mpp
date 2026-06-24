// src/app/(main)/programs/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  FileText,
  User,
  Folder,
  Loader2,
  Sparkles,
  Clock,
  Award
} from 'lucide-react'
import { formatDate } from '@/lib/utils/date'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { sanitizeDisplay } from '@/lib/utils/sanitize-string'

interface PKDocument {
  id: string
  name: string
  pk: {
    no_pk: string
    id_draft?: string
    start_at: string
    expired_at: string
    status: 'active' | 'expired'
  }
  pic: {
    name: string
    position: string
    email: string
    phone: string
  }
}

export default function DocumentPage() {
  const t = useTranslations('Programs')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [pkDocuments, setPkDocuments] = useState<PKDocument[]>([])
  const [loading, setLoading] = useState(true)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  useEffect(() => {
    const loadPKDocuments = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/mpartner/benefits/document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        
        if (data.status === 'error') {
          toast.error(data.message || t('failedToLoad'))
          setPkDocuments([])
        } else {
          const documents = data.data?.documents?.pk_documents || []
          setPkDocuments(documents)
          if (documents.length > 0) {
            setExpandedId(documents[0].id)
          }
        }
      } catch (err) {
        console.error(err)
        toast.error(t('failedToLoad'))
        setPkDocuments([])
      } finally {
        setLoading(false)
      }
    }
    loadPKDocuments()
  }, [t])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-r from-[#3279FF]/20 to-[#FFB347]/20 rounded-full blur-xl animate-pulse" />
          <Loader2 className="h-12 w-12 animate-spin text-[#3279FF] relative z-10" />
        </div>
      </div>
    )
  }

  if (pkDocuments.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 rounded-2xl bg-linear-to-br from-[#3279FF]/10 to-[#FFB347]/10">
            <Folder className="text-[#3279FF]" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('description')}</p>
          </div>
        </div>
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Folder size={40} className="text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">{t('noData')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-linear-to-br from-[#3279FF]/10 to-[#FFB347]/10">
            <Folder className="text-[#3279FF]" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('description')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
          <Sparkles size={12} className="text-[#FFB347]" />
          <span>{pkDocuments.length} {t('programsCount')}</span>
        </div>
      </div>

      {/* Program Cards - Grid 2 kolom dengan collapse */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {pkDocuments.map((program) => {
          const isExpanded = expandedId === program.id
          const isActive = program.pk.status === 'active'
          const cleanNoPk = program.pk.no_pk ? sanitizeDisplay(program.pk.no_pk) : ''
          const hasPIC = program.pic?.name && program.pic.name !== '-'

          return (
            <Card 
              key={program.id} 
              className={`overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300 ${
                isActive 
                  ? 'hover:border-[#3279FF]/30 hover:shadow-md' 
                  : 'opacity-75'
              } ${isExpanded ? 'border-[#3279FF]/30 shadow-md' : ''}`}
            >
              
              <div className="p-5 pt-1">
                {/* Header: PK Number + Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-gray-400" />
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {cleanNoPk}
                    </span>
                  </div>
                  <Badge 
                    className={`text-[10px] font-semibold ${
                      isActive 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' 
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <CheckCircle size={10} className="mr-1" />
                        {t('active')}
                      </>
                    ) : (
                      t('expired')
                    )}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-12 capitalize">
                  {sanitizeDisplay(program.name) || program.name}
                </h3>

                {/* Date Range */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#3279FF]" />
                    {formatDate(program.pk.start_at)}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">→</span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-[#FFB347]" />
                    {formatDate(program.pk.expired_at)}
                  </span>
                </div>

                {/* PIC + Action */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#3279FF]/10 flex items-center justify-center">
                      <User size={16} className="text-[#3279FF]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {t('pic')}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {hasPIC ? program.pic.name : t('noPIC')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(program.id)}
                    className="gap-1 text-xs font-medium text-[#3279FF] hover:bg-[#3279FF]/10 rounded-full px-4 py-1.5 h-8"
                  >
                    {isExpanded ? t('hide') : t('details')}
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </Button>
                </div>

                {/* Expanded: PIC Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 duration-200">
                    {hasPIC ? (
                      <div className="space-y-3">
                        {program.pic.position && program.pic.position !== '-' && (
                          <div className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg">
                            <Award size={14} className="text-[#3279FF]" />
                            <div>
                              <p className="text-[10px] text-gray-400">{t('position')}</p>
                              <p className="text-sm font-medium text-gray-800 dark:text-white">
                                {program.pic.position}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-3">
                          {program.pic.email && program.pic.email !== '-' && (
                            <a
                              href={`mailto:${program.pic.email}`}
                              className="flex items-center gap-2 text-sm text-[#3279FF] hover:underline bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-lg transition-colors hover:bg-[#3279FF]/5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Mail size={14} />
                              <span className="truncate">{program.pic.email}</span>
                            </a>
                          )}
                          {program.pic.phone && program.pic.phone !== '-' && program.pic.phone !== '0' && (
                            <a
                              href={`tel:${program.pic.phone}`}
                              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#3279FF] bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-lg transition-colors hover:bg-[#3279FF]/5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone size={14} />
                              <span>{program.pic.phone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                        {t('noPICDetail')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
      
    </div>
  )
}