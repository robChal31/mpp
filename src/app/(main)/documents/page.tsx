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
  UserCircle,
  Folder,
  Loader2
} from 'lucide-react'
import { formatDate } from '@/lib/utils/date'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

// Tipe data sesuai API
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

interface ApiResponse {
  status: string
  message: string
  data: {
    user: {
      id: string
      name: string
      email: string
      institution_id: string
    }
    pk_documents: PKDocument[]
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
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await res.json()
        
        if (data.status === 'error') {
          toast.error(data.message || t('failedToLoad'))
          setPkDocuments([])
        } else {
          // Perbaiki pengambilan data - sesuai dengan struktur response
          const documents = data.data?.documents?.pk_documents || []
          if (documents.length > 0) {
            setPkDocuments(documents)
            // Expand card pertama
            setExpandedId(documents[0].id)
          } else {
            setPkDocuments([])
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
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (pkDocuments.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-primary/10">
            <Folder className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
            <p className="text-sm text-muted-foreground">{t('description')}</p>
          </div>
        </div>
        <div className="text-center py-16">
          <Folder size={48} className="mx-auto text-muted-foreground mb-4 opacity-30" />
          <p className="text-muted-foreground">{t('noData')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-primary/10">
          <Folder className="text-primary" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
      </div>

      {/* Program Cards */}
      <div className="space-y-4">
        {pkDocuments.map((program) => {
          const isExpanded = expandedId === program.id
          const isActive = program.pk.status === 'active'
          // Bersihkan no_pk dari karakter aneh seperti &#39;
          const cleanNoPk = program.pk.no_pk?.replace(/&#39;/, "'") || program.pk.no_pk

          return (
            <Card 
              key={program.id} 
              className={`overflow-hidden transition-all duration-200 ${
                isActive ? 'hover:border-primary/40' : 'opacity-70'
              }`}
            >
              <div className="p-5 pt-2">
                {/* PK Number + Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText size={12} className="text-muted-foreground" />
                    <span className="text-xs font-mono text-muted-foreground">
                      {cleanNoPk}
                    </span>
                  </div>
                  {isActive ? (
                    <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 bg-green-50">
                      <CheckCircle size={10} className="mr-1" />
                      {t('active')}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-red-600 border-red-200 bg-red-50">
                      {t('expired')}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {program.name}
                </h3>

                {/* Validity Period */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 pb-3 border-b border-border/30">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(program.pk.start_at)} — {formatDate(program.pk.expired_at)}
                  </span>
                </div>

                {/* PIC Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCircle size={16} className="text-primary" />
                    <span className="text-sm text-muted-foreground">{t('pic')}:</span>
                    <span className="text-sm font-medium text-foreground">
                      {program.pic?.name && program.pic.name !== '-' ? program.pic.name : t('noPIC')}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(program.id)}
                    className="gap-1 text-xs h-8"
                  >
                    {isExpanded ? t('hide') : t('details')}
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </Button>
                </div>

                {/* Expanded: PIC Details */}
                {isExpanded && program.pic?.name && program.pic.name !== '-' && (
                  <div className="mt-4 pt-3 border-t border-border/30">
                    <div className="space-y-2">
                      {program.pic.position && program.pic.position !== '-' && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">{t('position')}:</span>{' '}
                          <span className="text-foreground">{program.pic.position}</span>
                        </p>
                      )}
                      <div className="flex gap-4 flex-wrap">
                        {program.pic.email && program.pic.email !== '-' && (
                          <a
                            href={`mailto:${program.pic.email}`}
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail size={14} />
                            {program.pic.email}
                          </a>
                        )}
                        {program.pic.phone && program.pic.phone !== '-' && program.pic.phone !== '0' && (
                          <a
                            href={`tel:${program.pic.phone}`}
                            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone size={14} />
                            {program.pic.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tampilkan pesan kalau tidak ada detail PIC */}
                {isExpanded && (!program.pic?.name || program.pic.name === '-') && (
                  <div className="mt-4 pt-3 border-t border-border/30">
                    <p className="text-sm text-muted-foreground text-center">
                      {t('noPICDetail')}
                    </p>
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