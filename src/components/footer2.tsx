// components/footer.tsx
'use client'

import {
    ArrowUp,
    Facebook,
    FileQuestion,
    Headset,
    Heart,
    HelpCircle,
    Info,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    PlayCircle,
    Youtube
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from "next/image"
import Link from "next/link"

const Footer2 = () => {
  const t = useTranslations('2')
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border bg-white relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        
        {/* Main Footer Content - 3 Kolom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative w-14 h-14">
                <Image
                  src="/compro.png"
                  alt="Mentari Partner Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="32px"
                />
              </div>
              <span className="font-semibold text-gray-800 dark:text-white">Mentari Partner</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('brandDescription')}
            </p>
            <div className="flex gap-3 pt-2">
              <a 
                href="https://www.facebook.com/MentariGroups/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-[#1877F2] hover:text-white transition-all duration-200"
              >
                <Facebook size={22} />
              </a>
              <a 
                href="https://www.instagram.com/mentarigroups" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-linear-to-tr from-[#E4405F] to-[#F56040] hover:text-white transition-all duration-200"
              >
                <Instagram size={22} />
              </a>
              <a 
                href="https://id.linkedin.com/company/mentari-group" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-[#0A66C2] hover:text-white transition-all duration-200"
              >
                <Linkedin size={22} />
              </a>
              <a 
                href="https://id.linkedin.com/company/mentari-group" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-[#1DA1F2] hover:text-white transition-all duration-200"
              >
                <Youtube size={22} />
              </a>
            </div>
          </div>
          
          {/* Column 2 - Help & Tutorials */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b md:border-primary/80 border-primary/30 pb-2">
              <HelpCircle size={22} className="text-primary" />
              {t('helpTutorials')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help-center" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#3279FF] transition-colors flex items-center gap-2">
                  <PlayCircle size={14} className="text-[#3279FF]" />
                  {t('videoTutorial')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#3279FF] transition-colors flex items-center gap-2">
                  <Info size={14} className="text-[#3279FF]" />
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#3279FF] transition-colors flex items-center gap-2">
                  <FileQuestion size={14} className="text-[#3279FF]" />
                  {t('faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b md:border-primary/80 border-primary/30 pb-2">
              <Headset size={22} className="text-primary" />
              {t('support')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:support@mentarigroups.com" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#3279FF] transition-colors flex items-center gap-2"
                >
                  <Mail size={14} className="text-[#3279FF]" />
                  support@mentarigroups.com
                </a>
              </li>
              {/* <li>
                <a 
                  href="tel:+622112345678" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#3279FF] transition-colors flex items-center gap-2"
                >
                  <Phone size={14} className="text-[#3279FF]" />
                  +62 21 1234 5678
                </a>
              </li> */}
              <li>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                  <MapPin size={14} className="text-[#3279FF] shrink-0 mt-0.5" />
                  <span>Jakarta, Indonesia</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-4 border-t border-gray-300 py-1 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {currentYear} Mentari Partner. {t('allRightsReserved')}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
              <Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-[#3279FF] transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-[#3279FF] transition-colors">
                {t('termsOfService')}
              </Link>
              <button 
                onClick={scrollToTop}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-[#3279FF] transition-colors cursor-pointer group"
              >
                <span>{t('backToTop')}</span>
                <ArrowUp size={12} className="group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Made with love */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
            {t('madeWith')} 
            <Heart size={10} className="text-[#FFB347] fill-[#FFB347] animate-pulse" /> 
            {t('forEducators')}
          </p>
        </div>
        
      </div>
    </footer>
  )
}

export default Footer2