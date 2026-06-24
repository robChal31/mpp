// components/navbar/navbar-public.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Menu,
  X,
  HelpCircle,
  Info,
  FileQuestion,
  GraduationCap,
  PlayCircle,
} from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import LocalSwitcher from './local-switcher'

interface NavbarPublicProps {
  changeLocalAction: (locale: string) => Promise<void>
}

export function NavbarPublic({ changeLocalAction }: NavbarPublicProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => pathname === href

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#3279FF]/95 backdrop-blur-md shadow-lg' 
          : 'bg-[#3279FF]'
      }`}
    >
      {/* Top gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-white/40 via-white/80 to-white/40" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative w-28 h-28 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/compro2.png"
                alt="Mentari Partner Logo"
                fill
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation - Public Pages (tengah) */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/video-tutorial">
              <Button
                variant="ghost"
                size="sm"
                className={`relative gap-2 transition-all duration-200 cursor-pointer rounded-lg px-4 py-2 ${
                  isActive('/video-tutorial')
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <PlayCircle size={18} />
                <span className="font-medium">Video Tutorial</span>
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="ghost"
                size="sm"
                className={`relative gap-2 transition-all duration-200 cursor-pointer rounded-lg px-4 py-2 ${
                  isActive('/about')
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Info size={18} />
                <span className="font-medium">About</span>
              </Button>
            </Link>

            <Link href="/faq">
              <Button
                variant="ghost"
                size="sm"
                className={`relative gap-2 transition-all duration-200 cursor-pointer rounded-lg px-4 py-2 ${
                  isActive('/faq')
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileQuestion size={18} />
                <span className="font-medium">FAQ</span>
              </Button>
            </Link>
          </div>

          {/* Right side - Login + Locale */}
          <div className="flex items-center gap-3">
            {/* Login Button - di sebelah kiri locale */}
            <Link href="/login">
              <Button
                size="sm"
                className="hidden sm:flex bg-white text-[#3279FF] hover:bg-white/90 rounded-full px-5 gap-2 shadow-md hover:shadow-lg transition-all duration-300 font-semibold h-9"
              >
                <GraduationCap size={15} />
                <span className="text-sm">Login</span>
              </Button>
            </Link>

            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LocalSwitcher changeLocalAction={changeLocalAction} />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>
          </div>
        </div>

        {/* ============ MOBILE NAVIGATION DRAWER ============ */}
        {isOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-white z-40 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200 overflow-y-auto">
            <div className="p-5 space-y-2">
              {/* Brand */}
              <div className="flex items-center gap-3 p-4 mb-2 rounded-xl bg-linear-to-r from-[#3279FF]/10 to-[#FFB347]/10 border border-[#3279FF]/20">
                <div className="relative w-10 h-10">
                  <Image
                    src="/compro2.png"
                    alt="Mentari Partner Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Mentari Partner</p>
                  <p className="text-xs text-gray-500">Education Partnership Platform</p>
                </div>
              </div>

              <Link href="/video-tutorial" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 cursor-pointer rounded-xl py-3 ${
                    isActive('/video-tutorial')
                      ? 'bg-[#3279FF]/10 text-[#3279FF]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <PlayCircle size={20} className={isActive('/video-tutorial') ? 'text-[#3279FF]' : 'text-gray-500'} />
                  <span className="font-medium">Video Tutorials</span>
                </Button>
              </Link>

              <Link href="/about" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 cursor-pointer rounded-xl py-3 ${
                    isActive('/about')
                      ? 'bg-[#3279FF]/10 text-[#3279FF]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Info size={20} className={isActive('/about') ? 'text-[#3279FF]' : 'text-gray-500'} />
                  <span className="font-medium">About</span>
                </Button>
              </Link>

              <Link href="/faq" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 cursor-pointer rounded-xl py-3 ${
                    isActive('/faq')
                      ? 'bg-[#3279FF]/10 text-[#3279FF]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileQuestion size={20} className={isActive('/faq') ? 'text-[#3279FF]' : 'text-gray-500'} />
                  <span className="font-medium">FAQ</span>
                </Button>
              </Link>

              <div className="my-3 h-px bg-gray-200" />

              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button
                  className="w-full bg-[#3279FF] hover:bg-[#2b66d9] text-white rounded-xl py-3 gap-2 shadow-md font-semibold"
                >
                  <GraduationCap size={20} />
                  <span className="font-medium">Login</span>
                </Button>
              </Link>

              <div className="my-3 h-px bg-gray-200" />

              <div className="flex items-center justify-between px-3 py-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600 font-medium">{t('common.language')}</span>
                <LocalSwitcher changeLocalAction={changeLocalAction} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}