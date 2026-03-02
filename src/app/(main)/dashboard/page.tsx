'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { HelpSection } from '@/components/help-section'
import {
  Gift,
  Clock,
  AlertCircle,
  Calendar,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'

export default function DashboardPage() {
  // Mock data
  const stats = {
    activeBenefits: 8,
    expiringsoon: 2,
    pendingActions: 3,
  }

  const upcomingEvents = [
    {
      id: 1,
      name: 'Math Competition 2025',
      type: 'Competition',
      startDate: 'Feb 15, 2025',
      endDate: 'Feb 20, 2025',
      description: 'National mathematics competition for secondary students',
    },
    {
      id: 2,
      name: 'Teacher Professional Development',
      type: 'Training',
      startDate: 'Mar 1, 2025',
      endDate: 'Mar 5, 2025',
      description: 'Online training for English and Science teachers',
    },
    {
      id: 3,
      name: 'Science Fair Exhibition',
      type: 'Event',
      startDate: 'Apr 10, 2025',
      endDate: 'Apr 12, 2025',
      description: 'Student science projects exhibition and showcase',
    },
  ]

  const expiringBenefits = [
    {
      id: 1,
      name: 'Digital Learning Pack',
      expiryDate: 'Feb 28, 2025',
      daysLeft: 40,
    },
    {
      id: 2,
      name: 'Library Access Premium',
      expiryDate: 'Mar 15, 2025',
      daysLeft: 55,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your school account.
        </p>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border border-border hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Active Benefits
              </p>
              <p className="text-3xl font-bold text-foreground">{stats.activeBenefits}</p>
              <p className="text-xs text-muted-foreground mt-2">Currently available</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Gift className="text-primary" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Expiring Soon
              </p>
              <p className="text-3xl font-bold text-foreground">{stats.expiringsoon}</p>
              <p className="text-xs text-muted-foreground mt-2">Next 60 days</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <Clock className="text-accent" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Pending Actions
              </p>
              <p className="text-3xl font-bold text-foreground">{stats.pendingActions}</p>
              <p className="text-xs text-muted-foreground mt-2">Require attention</p>
            </div>
            <div className="p-3 bg-destructive/10 rounded-lg">
              <AlertCircle className="text-destructive" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <Alert className="border-l-4 border-l-accent bg-accent/5">
        <AlertCircle className="h-4 w-4 text-accent" />
        <AlertDescription className="text-foreground">
          <strong>2 benefits expiring soon:</strong> Digital Learning Pack expires on Feb 28, 2025.
          Review your benefits to claim or renew before expiry.
        </AlertDescription>
      </Alert>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="text-primary" size={28} />
            Active Events & Competitions
          </h2>
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={() => (window.location.href = '/events')}
          >
            View All <ArrowRight size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {upcomingEvents.map((event) => (
            <Card
              key={event.id}
              className="p-6 border border-border hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group"
            >
              <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
                <span className="text-xs font-semibold text-primary">{event.type}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {event.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">{event.startDate}</span> -{' '}
                  {event.endDate}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 gap-2 bg-transparent"
                onClick={() => (window.location.href = '/events')}
              >
                View Details <ArrowRight size={14} />
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="text-primary" size={28} />
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
            <h3 className="text-lg font-bold text-foreground mb-2">Claim Benefits</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start claiming your available benefits and unlock value for your school.
            </p>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => (window.location.href = '/benefits')}
            >
              Go to Benefits
            </Button>
          </Card>

          <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
            <h3 className="text-lg font-bold text-foreground mb-2">Request Training</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Submit a training request for teachers and staff professional development.
            </p>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => (window.location.href = '/training')}
            >
              Request Training
            </Button>
          </Card>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-16 pt-8 border-t border-border">
        <HelpSection
          title="Quick Help & FAQ"
          faqItems={[
            {
              question: 'How do I get started with my benefits?',
              answer:
                'Log in to your account, navigate to the Benefits section to view all available benefits for your school. Click on any benefit to see details, validity periods, and claim options.',
            },
            {
              question: 'What is the difference between claiming and redeeming?',
              answer:
                'Claiming a benefit registers your interest and initiates verification. Redeeming allows you to actually use or receive the benefit after it has been approved.',
            },
            {
              question: 'How do I track my submitted requests?',
              answer:
                'All your requests (training, benefits, etc.) are tracked in their respective sections. You can view the current status, submission date, and any updates from our team.',
            },
          ]}
        />
      </div>
    </div>
  )
}
