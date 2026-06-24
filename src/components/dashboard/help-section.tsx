'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  MessageCircle,
  Headphones,
  Gift,
  Calendar,
  Settings,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useTranslations } from 'next-intl'

export function HelpSection() {
  const t = useTranslations('Help')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = [
    { 
      question: t('faq1.question'), 
      answer: t('faq1.answer'),
      icon: Gift
    },
    { 
      question: t('faq2.question'), 
      answer: t('faq2.answer'),
      icon: Clock
    },
    { 
      question: t('faq3.question'), 
      answer: t('faq3.answer'),
      icon: Calendar
    },
    { 
      question: t('faq4.question'), 
      answer: t('faq4.answer'),
      icon: Settings
    },
  ]

  return (
    <div className="my-12">
      
      {/* Split Layout: Left (Contact) + Right (FAQ) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-2xl p-6 text-center bg-white/80 dark:bg-gray-900 border-l-4 border-[#FFB347] shadow-lg hover:shadow-xl transition-all duration-300">
          
          <div className="w-16 h-16 mx-auto rounded-full bg-linear-to-br from-[#3279FF] to-[#5e93ff] flex items-center justify-center shadow-lg mb-4">
            <MessageCircle size={28} className="text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t('contactTitle')}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {t('contactDescription')}
          </p>
          
          <div className="space-y-3">
            <Button className="w-full gap-2 justify-center bg-[#3279FF] hover:bg-[#2b66d9] text-white rounded-xl py-2.5 shadow-md hover:shadow-lg transition-all duration-200" asChild>
              <a href="mailto:support@mentarigroups.com">
                <Mail size={16} />
                {t('emailSupport')}
              </a>
            </Button>
            
            {/* <Button className="w-full gap-2 justify-center bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl py-2.5 shadow-md hover:shadow-lg transition-all duration-200" asChild>
              <a href="https://wa.me/628558881948" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} />
                {t('whatsappSupport')}
              </a>
            </Button> */}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <CheckCircle size={12} className="text-[#3279FF]" />
              <span>{t('responseTime')}</span>
            </div>
          </div>
        </div>
      </div>
        
        {/* Right Side - FAQ List */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <HelpCircle size={20} className="text-[#3279FF]" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {t('faqTitle')}
            </h2>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const Icon = faq.icon
              const isOpen = openIndex === index
              
              return (
                <div
                  key={index}
                  className={`rounded-xl border transition-all duration-300 cursor-pointer ${
                    isOpen 
                      ? 'border-[#3279FF]/40 bg-linear-to-r from-[#3279FF]/5 to-transparent shadow-md' 
                      : 'border-gray-100 dark:border-gray-800 hover:border-[#3279FF]/20 hover:shadow-sm'
                  }`}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl transition-all duration-300 ${
                          isOpen 
                            ? 'bg-[#3279FF] text-white shadow-sm' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800'
                        }`}>
                          <Icon size={18} />
                        </div>
                        <h3 className={`font-semibold text-gray-800 dark:text-white transition-colors ${
                          isOpen ? 'text-[#3279FF]' : ''
                        }`}>
                          {faq.question}
                        </h3>
                      </div>
                      <div className={`p-1 rounded-full transition-all duration-300 ${
                        isOpen ? 'bg-[#3279FF]/10' : 'bg-gray-50 dark:bg-gray-800'
                      }`}>
                        {isOpen ? (
                          <ChevronUp size={16} className="text-[#3279FF]" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {isOpen && (
                      <div className="mt-4 ml-14 pl-4 border-l-2 border-[#3279FF]/30">
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
      </div>
    </div>
  )
}