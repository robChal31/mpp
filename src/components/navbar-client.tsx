// components/navbar/navbar-client.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  Calendar,
  ChevronDown,
  Folder,
  Gift,
  HelpCircle,
  Info,
  LogOut,
  Menu,
  Settings,
  User,
  X
} from 'lucide-react'
import { Locale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import LocalSwitcher from './local-switcher'

const navigationItems = [
  { labelKey: 'nav.benefits', href: '/benefits', icon: Gift, id: 'nav_benefits' },
  { labelKey: 'nav.events', href: '/events', icon: Calendar, id: 'nav_events' },
  { labelKey: 'nav.overview', href: '/overview', icon: Folder, id: 'nav_overview' },
  { labelKey: 'nav.helpCenter', href: '/help-center', icon: HelpCircle, id: 'nav_help-center' },
]

interface NavbarClientProps {
  user: { name: string; email: string; role: string } | null
  changeLocalAction: (locale: Locale) => Promise<void>
}

export function NavbarClient({ user, changeLocalAction }: NavbarClientProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const isItHome = pathname === '/'
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.profile-dropdown')) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  const isActive = (href: string) => pathname === href

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 bg-white border-b border-border ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      {/* Top linear accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary/60 via-primary to-primary/60" />
      
      <div className={`${isItHome ? 'max-w-7xl' : 'max-w-6xl'} mx-auto ${isOpen ? 'fixed inset-x-0 top-0 bg-white border-b border-primary' : ''}`}>
        <div className="flex items-center justify-between h-18">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative md:w-22 w-34 h-18 md:p-1 px-4 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/compro.png"
                  alt="Mentari Partner Logo"
                  className="object-contain w-full h-full"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div id="navbar-section" className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href} id={item.id}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`group/navlink relative gap-2 transition-all duration-200 cursor-pointer rounded-lg px-4 py-2 ${
                        active
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-muted-foreground hover:text-primary hover:bg-muted'
                      }`}
                    >
                      <Icon size={18} className={active ? 'text-primary group-hover/navlink:text-white' : 'text-muted-foreground group-hover/navlink:text-primary'} />
                      <span className="hidden lg:inline font-medium">{t(item.labelKey)}</span>
                      {active && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                      )}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center md:gap-3 gap-0">
            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-all duration-200"
              >
                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={14} className="text-primary" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{t('common.schoolAccount')}</p>
                  <p className="text-sm font-medium text-foreground truncate max-w-32">
                    {user?.name || 'Sekolah Example'}
                  </p>
                </div>
                <ChevronDown size={14} className={`hidden lg:block text-muted-foreground transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-white shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {/* User Info */}
                    <div className="px-4 py-4 bg-primary">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <User size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user?.name || 'Sekolah Example'}</p>
                          <p className="text-xs text-white/80 truncate">{user?.email || 'school@example.com'}</p>
                          <p className="text-xs text-white/90 mt-1 capitalize inline-block px-2 py-0.5 bg-white/20 rounded-full">
                            {user?.role || 'School'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors group/nav1"
                      >
                        <Settings size={16} className="text-muted-foreground group-hover/nav1:text-primary transition-colors" />
                        <span>{t('nav.settings')}</span>
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors group/nav2"
                      >
                        <Info size={16} className="text-muted-foreground group-hover/nav2:text-primary transition-colors" />
                        <span>{t('nav.about')}</span>
                      </Link>
                    </div>

                    <div className="border-t border-border" />

                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      >
                        <LogOut size={16} className="text-destructive/70" />
                        <span>{t('common.logout')}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Language Switcher - Desktop */}
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
              {/* User Info Mobile */}
              <div className="flex items-center gap-3 p-4 mb-3 rounded-xl bg-linear-soft border border-primary/20">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{user?.name || 'Sekolah Example'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email || 'school@example.com'}</p>
                  <p className="text-xs text-primary mt-1 capitalize">{user?.role || 'School'}</p>
                </div>
              </div>

              {/* Navigation Items */}
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 cursor-pointer rounded-xl py-3 transition-all duration-200 ${
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon size={20} className={active ? 'text-primary' : 'text-muted-foreground'} />
                      <span className="font-medium">{t(item.labelKey)}</span>
                      {active && (
                        <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                      )}
                    </Button>
                  </Link>
                )
              })}

              <div className="my-3 h-px bg-border" />

              <Link href="/settings" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl py-3 text-foreground hover:bg-muted cursor-pointer"
                >
                  <Settings size={20} className="text-muted-foreground" />
                  <span className="font-medium">{t('nav.settings')}</span>
                </Button>
              </Link>

              <Link href="/about" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl py-3 text-foreground hover:bg-muted cursor-pointer"
                >
                  <Info size={20} className="text-muted-foreground" />
                  <span className="font-medium">{t('nav.about')}</span>
                </Button>
              </Link>

              <div className="my-3 h-px bg-border" />

              <div className="flex items-center justify-between px-3 py-3 bg-muted rounded-xl">
                <span className="text-sm text-foreground font-medium">{t('common.language')}</span>
                <LocalSwitcher changeLocalAction={changeLocalAction} />
              </div>

              <div className="my-3 h-px bg-border" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              >
                <LogOut size={20} className="text-destructive/70" />
                <span className="font-medium">{t('common.logout')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}