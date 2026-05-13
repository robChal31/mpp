// components/navbar/navbar-client.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Gift,
  Calendar,
  LogOut,
  Menu,
  X,
  Settings,
  ChevronDown,
  User,
  HelpCircle,
  Folder,
} from 'lucide-react'
import Image from 'next/image'
import { Locale, useTranslations } from 'next-intl'
import LocalSwitcher from './local-switcher'

const navigationItems = [
  { labelKey: 'nav.dashboard', href: '/dashboard', icon: LayoutDashboard, id: 'nav_dashboard' },
  { labelKey: 'nav.benefits', href: '/benefits', icon: Gift, id: 'nav_benefits' },
  { labelKey: 'nav.events', href: '/events', icon: Calendar, id: 'nav_events' },
  { labelKey: 'nav.documents', href: '/documents', icon: Folder, id: 'nav_documents' },
]

interface NavbarClientProps {
  user: { name: string; email: string; role: string } | null
  changeLocalAction: (locale: Locale) => Promise<void>
}

export function NavbarClient({ user, changeLocalAction }: NavbarClientProps) {
  const t = useTranslations()
  const pathname = usePathname()
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

  // Close dropdown when clicking outside
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-md border-b border-border' 
          : 'bg-background border-b border-border'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
              <div className="relative w-28 h-28">
                <Image
                  src="/compro2.png"
                  alt="Mentari Partner Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div id="navbar-section" className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href} id={item.id}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-2 transition-all duration-200 cursor-pointer ${
                        active
                          ? 'bg-primary/10 text-primary hover:bg-primary/15'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon size={16} className={active ? 'text-primary' : ''} />
                      <span className="hidden lg:inline">{t(item.labelKey)}</span>
                      {active && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                      )}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <User size={14} className="text-primary" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs text-muted-foreground">{t('common.schoolAccount')}</p>
                  <p className="text-sm font-medium text-foreground truncate max-w-32">
                    {user?.name || 'Sekolah Example'}
                  </p>
                </div>
                <ChevronDown size={14} className={`hidden md:block text-muted-foreground transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-background shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {/* User Info */}
                    <div className="p-3 border-b border-border bg-muted/20">
                      <p className="font-medium text-foreground">{user?.name || 'Sekolah Example'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email || 'school@example.com'}</p>
                      <p className="text-xs text-primary mt-1 capitalize">{user?.role || 'School'}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-1">
                      <Link
                        href="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                      >
                        <Settings size={16} />
                        {t('nav.settings')}
                      </Link>
                      <Link
                        href="/help"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                      >
                        <HelpCircle size={16} />
                        Help Center
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border my-1" />

                    {/* Logout */}
                    <div className="p-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <LogOut size={16} />
                        {t('common.logout')}
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
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-background z-40 border-t border-border animate-in slide-in-from-top-2 duration-200 overflow-y-auto">
            <div className="p-4 space-y-1">
              {/* User Info Mobile */}
              <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-muted/20">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{user?.name || 'Sekolah Example'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || 'school@example.com'}</p>
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
                      className={`w-full justify-start gap-3 cursor-pointer ${
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted/50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon size={18} className={active ? 'text-primary' : ''} />
                      <span>{t(item.labelKey)}</span>
                      {active && (
                        <ChevronDown size={14} className="ml-auto -rotate-90" />
                      )}
                    </Button>
                  </Link>
                )
              })}

              {/* Settings in mobile */}
              <Link href="/settings" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-foreground hover:bg-muted/50 cursor-pointer"
                >
                  <Settings size={18} />
                  {t('nav.settings')}
                </Button>
              </Link>

              <Link href="/help" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-foreground hover:bg-muted/50 cursor-pointer"
                >
                  <HelpCircle size={18} />
                  Help Center
                </Button>
              </Link>

              {/* Divider */}
              <div className="my-3 h-px bg-border" />

              {/* Language Switcher Mobile */}
              <div className="px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('common.language')}</span>
                  <LocalSwitcher changeLocalAction={changeLocalAction} />
                </div>
              </div>

              {/* Divider */}
              <div className="my-2 h-px bg-border" />

              {/* Logout Mobile */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
              >
                <LogOut size={18} />
                {t('common.logout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}