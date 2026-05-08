'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, Clock, AlertCircle, Download } from 'lucide-react'
import { useState } from 'react'

type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'processing'

interface Claim {
  id: string
  benefitName: string
  claimDate: string
  status: ClaimStatus
  completionDate?: string
  details: string
  reference: string
}

interface ClaimStatusProps {
  benefitId: number
  benefitName: string
}

export function ClaimStatus({ benefitId, benefitName }: ClaimStatusProps) {
  const [claims] = useState<Claim[]>([
    {
      id: '1',
      benefitName: benefitName,
      claimDate: 'Jan 20, 2025',
      status: 'approved',
      completionDate: 'Jan 22, 2025',
      details: 'Benefit claim has been approved and verified.',
      reference: `CLM-${benefitId}-001`,
    },
  ])

  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getStatusIcon = (status: ClaimStatus) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} />
      case 'approved':
        return <CheckCircle size={20} />
      case 'rejected':
        return <AlertCircle size={20} />
      case 'processing':
        return <Clock size={20} />
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Claim History</h3>
      {claims.length > 0 ? (
        claims.map((claim) => (
          <Card key={claim.id} className={`p-4 border ${getStatusColor(claim.status)}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3 flex-1">
                <div className="mt-1">{getStatusIcon(claim.status)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{claim.benefitName}</p>
                  <p className="text-sm opacity-90 mb-1">{claim.details}</p>
                  <div className="text-xs opacity-75 space-y-1">
                    <p>Reference: {claim.reference}</p>
                    <p>
                      Claimed: {claim.claimDate}
                      {claim.completionDate && ` | Completed: ${claim.completionDate}`}
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2 shrink-0 bg-transparent">
                <Download size={16} />
                Certificate
              </Button>
            </div>
          </Card>
        ))
      ) : (
        <Card className="p-4 border border-border text-center text-muted-foreground">
          <p>No claims yet for this benefit</p>
        </Card>
      )}
    </div>
  )
}
