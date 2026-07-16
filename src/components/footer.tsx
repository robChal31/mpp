// components/footer2.tsx
'use client'

import {
    ArrowUp,
    Globe,
    Instagram,
    Mail,
    Youtube
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from "next/link"
import { usePathname } from 'next/navigation'

const Footer = () => {
  const t = useTranslations('Footer')
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const isItHome = pathname === '/'
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border bg-primary">
      <div className={`${isItHome ? 'max-w-7xl' : 'max-w-6xl'} mx-auto lg:px-6 py-2`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="md:text-xs text-[11px] font-semibold text-white">
              © {currentYear} Mentari Partner. {t('allRightsReserved')}
            </p>

            <div className="flex gap-6 items-center">
                <div className="flex gap-2">
                    <a 
                        href="https://mentarigroups.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-white text-primary hover:bg-orange-500 to-[#E4405F] hover:text-primary transition-all duration-200"
                    >
                        <Globe size={12} />
                    </a>
                    <a 
                        href="https://www.instagram.com/mentarigroups" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-white text-primary hover:bg-linear-to-tr from-[#E4405F] to-[#F56040] hover:text-primary transition-all duration-200"
                    >
                        <Instagram size={12} />
                    </a>
                    <a 
                        href="https://id.linkedin.com/company/mentari-group" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-white text-primary hover:bg-[#1DA1F2] hover:text-primary transition-all duration-200"
                    >
                        <Youtube size={12} />
                    </a>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                    <Link href="/help-venter" className="text-white hover:text-primary transition-colors">
                        {t('helpCenter')}
                    </Link>
                    <a 
                        href="mailto:support@mentarigroups.com" 
                        className="group/contact md:flex hidden items-center gap-1 text-white hover:text-primary transition-colors cursor-pointer group justify-center"
                    >
                        <Mail size={12} className="text-white group-hover/contact:text-primary group-hover/contact:-translate-y-1 transition-transform" />
                        {t('contactUs')}
                    </a>
                    
                    <button 
                        onClick={scrollToTop}
                        className="flex items-center gap-1 text-white hover:text-primary transition-colors cursor-pointer group"
                    >
                        <span>{t('backToTop')}</span>
                        <ArrowUp size={12} className="group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
              
            </div>
        </div>
        
      </div>
    </footer>
  )
}

export default Footer