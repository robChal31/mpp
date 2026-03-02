'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileText, Download, Filter, Search, Eye } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Loading from './loading'

interface Document {
  id: number
  title: string
  type: 'contract' | 'policy' | 'guideline' | 'report'
  year: number
  uploadDate: string
  size: string
  description: string
}

const mockDocuments: Document[] = [
  {
    id: 1,
    title: 'Partnership Agreement - 2025',
    type: 'contract',
    year: 2025,
    uploadDate: 'Jan 5, 2025',
    size: '2.4 MB',
    description: 'Annual partnership contract outlining terms, benefits, and obligations for 2025.',
  },
  {
    id: 2,
    title: 'Benefit Usage Policy',
    type: 'policy',
    year: 2025,
    uploadDate: 'Dec 15, 2024',
    size: '1.8 MB',
    description: 'Comprehensive policy document defining benefit usage rules and compliance requirements.',
  },
  {
    id: 3,
    title: 'Digital Learning Platform Guidelines',
    type: 'guideline',
    year: 2025,
    uploadDate: 'Jan 1, 2025',
    size: '3.2 MB',
    description: 'Step-by-step guidelines for implementing and utilizing the digital learning platform.',
  },
  {
    id: 4,
    title: 'Annual Impact Report - 2024',
    type: 'report',
    year: 2024,
    uploadDate: 'Jan 10, 2025',
    size: '5.6 MB',
    description: 'Comprehensive report showcasing the impact of partnerships and benefits in 2024.',
  },
  {
    id: 5,
    title: 'Partnership Agreement - 2024',
    type: 'contract',
    year: 2024,
    uploadDate: 'Jan 15, 2024',
    size: '2.1 MB',
    description: 'Previous year partnership contract for reference and historical records.',
  },
  {
    id: 6,
    title: 'Teacher Training Manual',
    type: 'guideline',
    year: 2024,
    uploadDate: 'Oct 1, 2024',
    size: '4.2 MB',
    description: 'Complete manual for training teachers on new educational programs and tools.',
  },
  {
    id: 7,
    title: 'Program Implementation Best Practices',
    type: 'guideline',
    year: 2025,
    uploadDate: 'Dec 28, 2024',
    size: '2.9 MB',
    description: 'Best practices document for effectively implementing MBS programs in schools.',
  },
  {
    id: 8,
    title: 'Annual Impact Report - 2023',
    type: 'report',
    year: 2023,
    uploadDate: 'Jan 20, 2024',
    size: '6.1 MB',
    description: 'Previous year impact report demonstrating long-term benefits and growth.',
  },
]

export default function DocumentsPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | Document['type']>('all')
  const [yearFilter, setYearFilter] = useState<'all' | number>('all')

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || doc.type === typeFilter
    const matchesYear = yearFilter === 'all' || doc.year === yearFilter

    return matchesSearch && matchesType && matchesYear
  })

  const getTypeColor = (type: Document['type']) => {
    switch (type) {
      case 'contract':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'policy':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'guideline':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'report':
        return 'bg-orange-100 text-orange-800 border-orange-300'
    }
  }

  const getTypeLabel = (type: Document['type']) => {
    switch (type) {
      case 'contract':
        return 'Contract'
      case 'policy':
        return 'Policy'
      case 'guideline':
        return 'Guideline'
      case 'report':
        return 'Report'
    }
  }

  const years = [...new Set(mockDocuments.map((d) => d.year))].sort((a, b) => b - a)

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <FileText className="text-primary" size={32} />
            Document Archive
          </h1>
          <p className="text-muted-foreground">
            Access partnership contracts, policies, guidelines, and reports.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search size={20} className="text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search documents by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Filter size={20} className="text-muted-foreground mt-2" />
            <div className="flex flex-wrap gap-2 flex-1">
              {/* Type Filter */}
              <Button
                variant={typeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('all')}
                className={typeFilter === 'all' ? 'bg-primary text-primary-foreground' : ''}
                size="sm"
              >
                All Types
              </Button>
              {['contract', 'policy', 'guideline', 'report'].map((type) => (
                <Button
                  key={type}
                  variant={typeFilter === type as Document['type'] ? 'default' : 'outline'}
                  onClick={() => setTypeFilter(type as Document['type'])}
                  className={
                    typeFilter === type ? 'bg-primary text-primary-foreground' : ''
                  }
                  size="sm"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={yearFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setYearFilter('all')}
              className={yearFilter === 'all' ? 'bg-primary text-primary-foreground' : ''}
              size="sm"
            >
              All Years
            </Button>
            {years.map((year) => (
              <Button
                key={year}
                variant={yearFilter === year ? 'default' : 'outline'}
                onClick={() => setYearFilter(year)}
                className={yearFilter === year ? 'bg-primary text-primary-foreground' : ''}
                size="sm"
              >
                {year}
              </Button>
            ))}
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="p-5 border border-border hover:shadow-md hover:border-primary/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className="p-3 bg-primary/10 rounded-lg h-fit">
                      <FileText className="text-primary" size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap mb-2">
                        <h3 className="text-lg font-bold text-foreground">
                          {doc.title}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold border whitespace-nowrap ${getTypeColor(doc.type)}`}>
                          {getTypeLabel(doc.type)}
                        </span>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {doc.year}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {doc.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>Uploaded: {doc.uploadDate}</span>
                        <span>Size: {doc.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Eye size={16} />
                      Preview
                    </Button>
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                      size="sm"
                    >
                      <Download size={16} />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 border border-border text-center">
              <FileText className="mx-auto text-muted-foreground mb-3" size={32} />
              <p className="text-muted-foreground">No documents found matching your criteria.</p>
            </Card>
          )}
        </div>

        {/* Stats */}
        <Card className="p-6 border border-border bg-secondary/50">
          <h3 className="text-lg font-bold text-foreground mb-4">Archive Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Documents</p>
              <p className="text-2xl font-bold text-foreground">
                {mockDocuments.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Contracts</p>
              <p className="text-2xl font-bold text-foreground">
                {mockDocuments.filter((d) => d.type === 'contract').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Policies</p>
              <p className="text-2xl font-bold text-foreground">
                {mockDocuments.filter((d) => d.type === 'policy').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Years Covered</p>
              <p className="text-2xl font-bold text-foreground">{years.length}</p>
            </div>
          </div>
        </Card>
      </div>
    </Suspense>
  )
}
