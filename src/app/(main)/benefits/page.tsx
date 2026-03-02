'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Gift,
  BookOpen,
  Users,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

type BenefitStatus = 'active' | 'upcoming' | 'expired'
type BenefitCategory = 'MPP' | 'HY' | 'Training' | 'Other'

interface Benefit {
  id: number
  name: string
  description: string
  category: BenefitCategory
  status: BenefitStatus
  validFrom: string
  validUntil: string
  gracePeriodUntil?: string
  usageRules: string[]
}

const mockBenefits: Benefit[] = [
  {
    id: 1,
    name: 'Digital Learning Platform Access',
    description: 'Full access to our comprehensive digital learning platform for all teachers and students.',
    category: 'MPP',
    status: 'active',
    validFrom: 'Jan 15, 2025',
    validUntil: 'Dec 31, 2025',
    usageRules: [
      'Available for all staff members',
      'Up to 500 concurrent users',
      'Monthly reporting available',
      'Technical support included',
    ],
  },
  {
    id: 2,
    name: 'Book Collection Package',
    description: 'Curated collection of 500+ educational books for library integration.',
    category: 'HY',
    status: 'active',
    validFrom: 'Jan 1, 2025',
    validUntil: 'Mar 31, 2026',
    gracePeriodUntil: 'Jan 31, 2025',
    usageRules: [
      'Physical books will be delivered in 2 shipments',
      'Can select from approved catalog',
      'Returns allowed within 30 days',
    ],
  },
  {
    id: 3,
    name: 'Teacher Development Program',
    description: 'Annual teacher training and professional development sessions.',
    category: 'Training',
    status: 'active',
    validFrom: 'Feb 1, 2025',
    validUntil: 'Jan 31, 2026',
    usageRules: [
      'Up to 10 training sessions per year',
      'Can customize curriculum topics',
      'Certificates issued upon completion',
    ],
  },
  {
    id: 4,
    name: 'Science Lab Equipment Bundle',
    description: 'Complete bundle of science lab equipment for physics and chemistry labs.',
    category: 'MPP',
    status: 'upcoming',
    validFrom: 'Mar 1, 2025',
    validUntil: 'Feb 28, 2026',
    gracePeriodUntil: 'Mar 15, 2025',
    usageRules: [
      'Equipment delivery in Q1 2025',
      'Installation support included',
      'Maintenance warranty for 2 years',
    ],
  },
  {
    id: 5,
    name: 'Student Competition Registration',
    description: 'Free registration for student competitions and events throughout the year.',
    category: 'HY',
    status: 'active',
    validFrom: 'Jan 1, 2025',
    validUntil: 'Dec 31, 2025',
    usageRules: [
      'Includes up to 50 student registrations',
      'Access to all competition tiers',
      'Mentorship support available',
    ],
  },
  {
    id: 6,
    name: 'Online Assessment Platform',
    description: 'Comprehensive online assessment and exam management system.',
    category: 'MPP',
    status: 'active',
    validFrom: 'Feb 1, 2025',
    validUntil: 'Jan 31, 2026',
    usageRules: [
      'Unlimited assessments and quizzes',
      'Detailed analytics and reporting',
      'Mobile app access included',
    ],
  },
]

export default function BenefitsPage() {
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<BenefitCategory | 'all'>('all')

  const filteredBenefits = mockBenefits.filter(
    (b) => categoryFilter === 'all' || b.category === categoryFilter
  )

  const getStatusColor = (status: BenefitStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: BenefitStatus) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} />
      case 'upcoming':
        return <Clock size={16} />
      case 'expired':
        return <AlertCircle size={16} />
    }
  }

  const getCategoryIcon = (category: BenefitCategory) => {
    switch (category) {
      case 'MPP':
        return <BookOpen size={20} />
      case 'HY':
        return <Users size={20} />
      case 'Training':
        return <Users size={20} />
      default:
        return <Gift size={20} />
    }
  }

  if (selectedBenefit) {
    const isInGracePeriod = selectedBenefit.gracePeriodUntil && new Date() < new Date(selectedBenefit.gracePeriodUntil)
    
    return (
      <div className="space-y-8">
        <Button
          variant="outline"
          onClick={() => setSelectedBenefit(null)}
          className="gap-2"
        >
          ← Back to Benefits
        </Button>

        {/* Benefit Detail */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {selectedBenefit.name}
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(selectedBenefit.status)}`}>
                    {getStatusIcon(selectedBenefit.status)}
                    {selectedBenefit.status.charAt(0).toUpperCase() +
                      selectedBenefit.status.slice(1)}
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium">
                    {getCategoryIcon(selectedBenefit.category)}
                    {selectedBenefit.category}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              {selectedBenefit.description}
            </p>
          </div>

          {/* Grace Period Alert */}
          {isInGracePeriod && (
            <Alert className="border-l-4 border-l-accent bg-accent/5">
              <Clock className="h-4 w-4 text-accent" />
              <AlertDescription className="text-foreground">
                <strong>Grace Period Active:</strong> This benefit is in a grace period until{' '}
                {selectedBenefit.gracePeriodUntil}. You can start using it after this date.
              </AlertDescription>
            </Alert>
          )}

          {/* Validity Information */}
          <Card className="p-6 border border-border bg-secondary/50">
            <h3 className="text-lg font-bold text-foreground mb-4">Validity Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Valid From</p>
                <p className="text-lg font-semibold text-foreground">
                  {selectedBenefit.validFrom}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Valid Until</p>
                <p className="text-lg font-semibold text-foreground">
                  {selectedBenefit.validUntil}
                </p>
              </div>
              {selectedBenefit.gracePeriodUntil && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Grace Period Until</p>
                  <p className="text-lg font-semibold text-accent">
                    {selectedBenefit.gracePeriodUntil}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Usage Rules */}
          <Card className="p-6 border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Usage Rules & Conditions</h3>
            <ul className="space-y-3">
              {selectedBenefit.usageRules.map((rule, index) => (
                <li key={index} className="flex gap-3 text-foreground">
                  <CheckCircle
                    className="text-primary flex-shrink-0"
                    size={20}
                  />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isInGracePeriod || selectedBenefit.status !== 'active'}
            >
              Claim Benefit
            </Button>
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={selectedBenefit.status !== 'active'}
            >
              Redeem Benefit
            </Button>
            <Button variant="outline">
              Download Details
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Benefits</h1>
        <p className="text-muted-foreground">
          Manage and claim all benefits available to your school.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={categoryFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setCategoryFilter('all')}
          className={categoryFilter === 'all' ? 'bg-primary text-primary-foreground' : ''}
        >
          All Benefits
        </Button>
        {['MPP', 'HY', 'Training', 'Other'].map((cat) => (
          <Button
            key={cat}
            variant={categoryFilter === cat as BenefitCategory ? 'default' : 'outline'}
            onClick={() => setCategoryFilter(cat as BenefitCategory)}
            className={categoryFilter === cat ? 'bg-primary text-primary-foreground' : ''}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredBenefits.map((benefit) => (
          <Card
            key={benefit.id}
            className="p-6 border border-border hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => setSelectedBenefit(benefit)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                {getCategoryIcon(benefit.category)}
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(benefit.status)}`}>
                {getStatusIcon(benefit.status)}
                {benefit.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {benefit.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {benefit.description}
            </p>

            <div className="space-y-2 text-sm mb-4">
              <p className="text-muted-foreground flex items-center gap-2">
                <Calendar size={16} />
                Valid: {benefit.validFrom} to {benefit.validUntil}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedBenefit(benefit)
              }}
            >
              View Details <ArrowRight size={14} />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
