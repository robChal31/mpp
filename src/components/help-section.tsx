// components/help-section.tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  MessageCircle,
  ExternalLink,
  FileText
} from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface HelpSectionProps {
  title?: string
  description?: string
  faqItems?: FAQItem[]
  showContact?: boolean
}

export function HelpSection({ 
  title = "Need Help?",
  description = "Find answers to common questions or contact our support team",
  faqItems = [],
  showContact = true
}: HelpSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const defaultFAQs: FAQItem[] = [
    {
      question: "How do I claim my benefits?",
      answer: "Go to the Benefits section, find an active benefit, and click 'Claim'. You can then select an eligible event to use your benefit."
    },
    {
      question: "What happens when a benefit expires?",
      answer: "Expired benefits cannot be claimed. Make sure to claim your benefits before the expiry date shown on each benefit card."
    },
    {
      question: "How do I know which events are eligible?",
      answer: "When viewing a benefit detail, check the 'Events' tab to see all eligible events you can use this benefit for."
    },
    {
      question: "Can I transfer my benefits to another school?",
      answer: "Benefits are tied to your institution and cannot be transferred. Please contact support if you have special circumstances."
    }
  ]

  const items = faqItems.length > 0 ? faqItems : defaultFAQs

  return (
    <div className="space-y-6 max-[640px]:space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 max-[640px]:w-10 max-[640px]:h-10 rounded-full bg-primary/10 mb-3 max-[640px]:mb-2">
          <HelpCircle className="text-primary size-6 max-[640px]:size-5" />
        </div>
        <h2 className="text-xl max-[640px]:text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm max-[640px]:text-xs text-muted-foreground mt-1">{description}</p>
      </div>

      {/* FAQ Section */}
      <div className="space-y-3 max-[640px]:space-y-2">
        <h3 className="text-sm max-[640px]:text-xs font-medium text-foreground flex items-center gap-2">
          <FileText size={16} className="text-primary max-[640px]:size-3.5" />
          Frequently Asked Questions
        </h3>
        
        <div className="space-y-2">
          {items.map((item, index) => (
            <Card 
              key={index}
              className="border-border overflow-hidden hover:border-primary/30 transition-all duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 max-[640px]:p-3 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="font-medium text-foreground text-sm max-[640px]:text-xs max-[640px]:pr-2">
                  {item.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp size={16} className="text-muted-foreground shrink-0 max-[640px]:size-3.5" />
                ) : (
                  <ChevronDown size={16} className="text-muted-foreground shrink-0 max-[640px]:size-3.5" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-4 pb-4 pt-0 max-[640px]:px-3 max-[640px]:pb-3 border-t border-border/50">
                  <p className="text-sm max-[640px]:text-xs text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Support Section */}
      {showContact && (
        <Card className="p-5 max-[640px]:p-4 bg-linear-to-r from-primary/5 to-transparent border-primary/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-[640px]:gap-3">
            <div className="flex items-center gap-3 max-[640px]:gap-2">
              <div className="p-2 rounded-full bg-primary/10 max-[640px]:p-1.5">
                <MessageCircle size={18} className="text-primary max-[640px]:size-4" />
              </div>
              <div>
                <p className="text-sm max-[640px]:text-xs font-medium text-foreground">Still have questions?</p>
                <p className="text-xs max-[640px]:text-[10px] text-muted-foreground">Our support team is ready to help you</p>
              </div>
            </div>
            <div className="flex gap-2 max-[640px]:w-full max-[640px]:flex-col">
              <Button variant="outline" size="sm" className="gap-2 max-[640px:w-full max-[640px]:text-xs max-[640px]:h-8" asChild>
                <a href="mailto:support@mentarigroups.com">
                  <Mail size={14} className="max-[640px]:size-3" />
                  <span className="max-[640px]:text-xs">Email Support</span>
                </a>
              </Button>
              <Button variant="outline" size="sm" className="gap-2 max-[640px:w-full max-[640px]:text-xs max-[640px]:h-8" asChild>
                <a href="https://wa.me/628558881948" target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={14} className="max-[640px]:size-3" />
                  <span className="max-[640px]:text-xs">WhatsApp</span>
                </a>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}