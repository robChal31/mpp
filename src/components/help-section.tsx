'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HelpCircle, MessageCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface HelpSectionProps {
  title?: string
  faqItems?: FAQItem[]
}

const defaultFAQItems: FAQItem[] = [
  {
    question: 'How do I claim a benefit?',
    answer:
      'Navigate to the Benefits page, select the benefit you want to claim, and click the "Claim Benefit" button. Your claim will be processed within 2-3 business days.',
  },
  {
    question: 'What is the grace period?',
    answer:
      'The grace period is the time between when a benefit becomes valid and when it can be claimed. You can only claim a benefit after the grace period ends.',
  },
  {
    question: 'Can I redeem multiple benefits at once?',
    answer:
      'Yes, you can claim or redeem multiple benefits. Simply go to each benefit and submit your request. There is no limit to the number of benefits you can manage simultaneously.',
  },
  {
    question: 'How long does the benefit verification process take?',
    answer:
      'Benefit verification typically takes 2-5 business days. You will receive email notifications at each step of the process.',
  },
  {
    question: 'Can I modify my training request after submission?',
    answer:
      'Yes, you can modify your training request before it is approved. Once approved or scheduled, contact support to make changes.',
  },
  {
    question: 'How do I access event registration details?',
    answer:
      'Go to the Events page, select an event, and click "Register for Event". You will receive a confirmation with all registration details and requirements.',
  },
]

export function HelpSection({ title = 'Frequently Asked Questions', faqItems = defaultFAQItems }: HelpSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-4">
          <HelpCircle className="text-primary" size={28} />
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        {faqItems.map((item, index) => (
          <Card
            key={index}
            className="border border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full p-4 flex items-start justify-between gap-4 bg-background hover:bg-secondary/50 transition-colors"
            >
              <p className="text-left font-semibold text-foreground">{item.question}</p>
              <span className="text-primary flex-shrink-0 text-xl">
                {expandedIndex === index ? '−' : '+'}
              </span>
            </button>
            {expandedIndex === index && (
              <div className="p-4 bg-secondary/30 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border border-border">
          <div className="flex items-start gap-3 mb-3">
            <MessageCircle className="text-primary flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-foreground">Still have questions?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Our support team is here to help with any questions about benefits and programs.
              </p>
              <Button className="mt-3 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Contact Support
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="text-accent flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-foreground">Important Notice</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Always review benefit terms and conditions before claiming. Some benefits have specific requirements.
              </p>
              <Button
                variant="outline"
                className="mt-3 gap-2 bg-transparent"
                onClick={() => (window.location.href = '/documents')}
              >
                View Documents
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
