// components/navbar/navbar-public.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Menu,
  X,
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
      className={`sticky top-0 z-50 transition-all duration-300 bg-white border-b border-border ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      {/* Top linear accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary/60 via-primary to-primary/60" />
      
      <div className={`max-w-6xl mx-auto ${isOpen ? 'fixed inset-x-0 top-0 bg-white border-b border-primary' : ''}`}>
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0 px-4">
            <div className="relative transition-transform duration-300 group-hover:scale-105 md:w-22 w-24 h-18">
              <img
                src="/compro.png"
                alt="Mentari Partner Logo"
                className="object-contain w-full h-full"
              />
            </div>
          </Link>

          {/* Desktop Navigation - Public Pages */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/help-center">
              <Button
                variant="ghost"
                size="sm"
                className={`group/navlink relative gap-2 transition-all duration-200 cursor-pointer rounded-lg px-4 py-2 ${
                  isActive('/help-center')
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-primary hover:bg-muted'
                }`}
              >
                <FileQuestion size={18} className={isActive('/help-center') ? 'text-primary' : 'text-muted-foreground group-hover/navlink:text-primary'} />
                <span className="font-medium">{t('nav.helpCenter')}</span>
                {isActive('/help-center') && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Button>
            </Link>

            <Link href="/about">
              <Button
                variant="ghost"
                size="sm"
                className={`group/navlink relative gap-2 transition-all duration-200 cursor-pointer rounded-lg px-4 py-2 ${
                  isActive('/about')
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-primary hover:bg-muted'
                }`}
              >
                <Info size={18} className={isActive('/about') ? 'text-primary' : 'text-muted-foreground group-hover/navlink:text-primary'} />
                <span className="font-medium">{t('nav.about')}</span>
                {isActive('/about') && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Button>
            </Link>
          </div>

          {/* Right side - Login + Locale */}
          <div className="flex items-center md:gap-3 gap-0">
            {/* Login Button */}
            <Link href="/login">
              <Button
                size="sm"
                className="hidden sm:flex bg-primary text-white hover:bg-primary-dark rounded-full px-5 gap-2 shadow-md hover:shadow-lg transition-all duration-300 font-semibold h-9"
              >
                <GraduationCap size={15} />
                <span className="text-sm">{t('common.login')}</span>
              </Button>
            </Link>

            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LocalSwitcher changeLocalAction={changeLocalAction} />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isOpen ? <X size={20} className="text-foreground" /> : <Menu size={20} className="text-foreground" />}
            </button>
          </div>
        </div>

        {/* ============ MOBILE NAVIGATION DRAWER ============ */}
        {isOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-white z-40 overflow-y-auto animate-in slide-in-from-top-2 duration-200 shadow-xl">
            <div className="p-4 space-y-2">
              {/* Brand */}
              <div className="flex items-center gap-3 p-4 mb-3 rounded-xl bg-linear-soft border border-primary/20">
                <div className="relative w-12 h-12">
                  <Image
                    src="/compro.png"
                    alt="Mentari Partner Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Mentari Partner</p>
                  <p className="text-xs text-muted-foreground">Education Partnership Platform</p>
                </div>
              </div>

              <Link href="/help-center" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 cursor-pointer rounded-xl py-3 transition-all duration-200 ${
                    isActive('/help-center')
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <FileQuestion size={20} className={isActive('/help-center') ? 'text-primary' : 'text-muted-foreground'} />
                  <span className="font-medium">{t('nav.helpCenter')}</span>
                  {isActive('/help-center') && (
                    <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </Button>
              </Link>

              <Link href="/about" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 cursor-pointer rounded-xl py-3 transition-all duration-200 ${
                    isActive('/about')
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Info size={20} className={isActive('/about') ? 'text-primary' : 'text-muted-foreground'} />
                  <span className="font-medium">{t('nav.about')}</span>
                  {isActive('/about') && (
                    <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </Button>
              </Link>

              <div className="my-3 h-px bg-border" />

              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button
                  className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-3 gap-2 shadow-md font-semibold"
                >
                  <GraduationCap size={20} />
                  <span className="font-medium">{t('common.login')}</span>
                </Button>
              </Link>

              <div className="my-3 h-px bg-border" />

              <div className="flex items-center justify-between px-3 py-3 bg-muted rounded-xl">
                <span className="text-sm text-foreground font-medium">{t('common.language')}</span>
                <LocalSwitcher changeLocalAction={changeLocalAction} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}