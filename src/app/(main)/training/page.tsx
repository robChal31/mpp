'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  BookOpen,
  Send,
  CheckCircle,
  Clock,
  User,
  Calendar,
  MapPin,
  ArrowRight,
} from 'lucide-react'

type TrainingStatus = 'submitted' | 'reviewed' | 'approved' | 'scheduled'

interface TrainingRequest {
  id: number
  businessUnit: string
  topic: string
  preferredDate: string
  status: TrainingStatus
  submittedDate: string
  participants: number
  notes?: string
}

const mockRequests: TrainingRequest[] = [
  {
    id: 1,
    businessUnit: 'English Department',
    topic: 'Advanced Grammar Teaching Methods',
    preferredDate: 'Mar 10-15, 2025',
    status: 'approved',
    submittedDate: 'Jan 15, 2025',
    participants: 12,
    notes: 'Focus on latest teaching methodologies',
  },
  {
    id: 2,
    businessUnit: 'Science Department',
    topic: 'Lab Safety & Modern Experiments',
    preferredDate: 'Feb 20-22, 2025',
    status: 'scheduled',
    submittedDate: 'Jan 10, 2025',
    participants: 8,
  },
  {
    id: 3,
    businessUnit: 'Mathematics Department',
    topic: 'Digital Tools for Math Teaching',
    preferredDate: 'Apr 2025',
    status: 'reviewed',
    submittedDate: 'Jan 20, 2025',
    participants: 15,
  },
]

const trainingTopics = [
  'Advanced Grammar Teaching Methods',
  'Digital Tools for Math Teaching',
  'Lab Safety & Modern Experiments',
  'Student Assessment & Evaluation',
  'Inclusive Education Practices',
  'Technology Integration in Classroom',
  'Leadership & Management Skills',
  'Curriculum Development',
  'Student Motivation Strategies',
  'Online Teaching Methods',
]

const businessUnits = [
  'English Department',
  'Mathematics Department',
  'Science Department',
  'Social Studies Department',
  'Physical Education',
  'Arts & Music',
  'Administration',
  'All Staff',
]

export default function TrainingPage() {
  const [view, setView] = useState<'list' | 'form'>('list')
  const [formData, setFormData] = useState({
    businessUnit: '',
    topic: '',
    preferredDate: '',
    notes: '',
    participants: '5',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submission
    alert('Training request submitted successfully!')
    setFormData({
      businessUnit: '',
      topic: '',
      preferredDate: '',
      notes: '',
      participants: '5',
    })
    setView('list')
  }

  const getStatusColor = (status: TrainingStatus) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-300'
    }
  }

  const getStatusIcon = (status: TrainingStatus) => {
    switch (status) {
      case 'submitted':
        return <Clock size={16} />
      case 'reviewed':
        return <User size={16} />
      case 'approved':
        return <CheckCircle size={16} />
      case 'scheduled':
        return <Calendar size={16} />
    }
  }

  if (view === 'form') {
    return (
      <div className="space-y-8">
        <Button
          variant="outline"
          onClick={() => setView('list')}
          className="gap-2"
        >
          ← Back to Requests
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">New Training Request</h1>
          <p className="text-muted-foreground">
            Submit a training request for your teachers and staff.
          </p>
        </div>

        <Card className="p-8 border border-border max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Unit */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Business Unit / Department
              </label>
              <select
                value={formData.businessUnit}
                onChange={(e) =>
                  setFormData({ ...formData, businessUnit: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a department...</option>
                {businessUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            {/* Training Topic */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Training Topic
              </label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a topic...</option>
                {trainingTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            {/* Participants */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Number of Participants
              </label>
              <Input
                type="number"
                min="1"
                value={formData.participants}
                onChange={(e) =>
                  setFormData({ ...formData, participants: e.target.value })
                }
                required
                className="w-full"
              />
            </div>

            {/* Preferred Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Preferred Schedule (Approximate)
              </label>
              <Input
                type="text"
                placeholder="e.g., Mar 10-15, 2025 or April 2025"
                value={formData.preferredDate}
                onChange={(e) =>
                  setFormData({ ...formData, preferredDate: e.target.value })
                }
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Provide your preferred dates or timeframe
              </p>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special requests or additional information..."
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 flex-1"
              >
                <Send size={18} />
                Submit Request
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setView('list')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <BookOpen className="text-primary" size={32} />
            Training & Development
          </h1>
          <p className="text-muted-foreground">
            Request and track training sessions for your teachers and staff.
          </p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setView('form')}
        >
          New Request
        </Button>
      </div>

      {/* Training Requests */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Your Requests</h2>
        <div className="space-y-4">
          {mockRequests.map((request) => (
            <Card
              key={request.id}
              className="p-6 border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-foreground">
                      {request.topic}
                    </h3>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border whitespace-nowrap ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Department:</span>{' '}
                      {request.businessUnit}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Participants:</span>{' '}
                      {request.participants} people
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Preferred Date:</span>{' '}
                      {request.preferredDate}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Submitted:</span>{' '}
                      {request.submittedDate}
                    </p>
                  </div>

                  {request.notes && (
                    <p className="text-sm text-muted-foreground mt-3 italic">
                      "{request.notes}"
                    </p>
                  )}
                </div>

                <Button variant="outline" className="gap-2 whitespace-nowrap bg-transparent">
                  View Details <ArrowRight size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <Card className="p-6 border border-border bg-primary/5">
        <h3 className="text-lg font-bold text-foreground mb-3">How to Request Training</h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Click "New Request" to start a training request form</li>
          <li>Select your department and preferred training topic</li>
          <li>Specify the number of participants and preferred dates</li>
          <li>Add any special requirements or notes</li>
          <li>Submit and track the status of your request</li>
          <li>Receive confirmation once your request is scheduled</li>
        </ol>
      </Card>
    </div>
  )
}
