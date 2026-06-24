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
  Folder,
  PlayCircle,
  Info,
} from 'lucide-react'
import Image from 'next/image'
import { Locale, useTranslations } from 'next-intl'
import LocalSwitcher from './local-switcher'

const navigationItems = [
  { labelKey: 'nav.dashboard', href: '/dashboard', icon: LayoutDashboard, id: 'nav_dashboard' },
  { labelKey: 'nav.benefits', href: '/benefits', icon: Gift, id: 'nav_benefits' },
  { labelKey: 'nav.events', href: '/events', icon: Calendar, id: 'nav_events' },
  { labelKey: 'nav.profile', href: '/profile', icon: Folder, id: 'nav_profile' },
  { labelKey: 'nav.videoTutorial', href: '/video-tutorial', icon: PlayCircle, id: 'nav_video_tutorial' },
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
          ? 'bg-[#3279FF]/95 backdrop-blur-md shadow-lg' 
          : 'bg-[#3279FF]'
      }`}
    >
      {/* Top gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-white/40 via-white/80 to-white/40" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
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
                      className={`relative gap-2 transition-all duration-200 cursor-pointer rounded-lg px-4 py-2 ${
                        active
                          ? 'bg-white/20 text-white shadow-sm'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon size={18} className={active ? 'text-white' : 'text-white/70'} />
                      <span className="hidden lg:inline font-medium">{t(item.labelKey)}</span>
                      {active && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
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
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[10px] text-white/60 uppercase tracking-wide">{t('common.schoolAccount')}</p>
                  <p className="text-sm font-medium text-white truncate max-w-32">
                    {user?.name || 'Sekolah Example'}
                  </p>
                </div>
                <ChevronDown size={14} className={`hidden lg:block text-white/60 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-100 bg-white shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {/* User Info */}
                    <div className="px-4 py-4 bg-linear-to-r from-[#3279FF] to-[#5e93ff]">
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
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors group/nav1"
                      >
                        <Settings size={16} className="text-gray-400 group-hover/nav1:text-primary transition-colors" />
                        <span>{t('nav.settings')}</span>
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors group/nav2"
                      >
                        <Info size={16} className="text-gray-400 group-hover/nav2:text-primary transition-colors" />
                        <span>{t('nav.about')}</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-200" />

                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} className="text-red-400" />
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
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>
          </div>
        </div>

        {/* ============ MOBILE NAVIGATION DRAWER ============ */}
        {isOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-white z-40 overflow-y-auto animate-in slide-in-from-top-2 duration-200 shadow-xl">
            <div className="p-4 space-y-2">
              {/* User Info Mobile */}
              <div className="flex items-center gap-3 p-4 mb-3 rounded-xl bg-linear-to-r from-[#3279FF]/10 to-[#FFB347]/10 border border-[#3279FF]/20">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <User size={20} className="text-[#3279FF]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name || 'Sekolah Example'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'school@example.com'}</p>
                  <p className="text-xs text-[#3279FF] mt-1 capitalize">{user?.role || 'School'}</p>
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
                          ? 'bg-[#3279FF]/10 text-[#3279FF]'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon size={20} className={active ? 'text-[#3279FF]' : 'text-gray-500'} />
                      <span className="font-medium">{t(item.labelKey)}</span>
                      {active && (
                        <div className="ml-auto w-1.5 h-1.5 bg-[#3279FF] rounded-full" />
                      )}
                    </Button>
                  </Link>
                )
              })}

              <div className="my-3 h-px bg-gray-200" />

              <Link href="/settings" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl py-3 text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <Settings size={20} className="text-gray-500" />
                  <span className="font-medium">{t('nav.settings')}</span>
                </Button>
              </Link>

              <Link href="/about" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl py-3 text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <Info size={20} className="text-gray-500" />
                  <span className="font-medium">{t('nav.about')}</span>
                </Button>
              </Link>

              <div className="my-3 h-px bg-gray-200" />

              <div className="flex items-center justify-between px-3 py-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600 font-medium">{t('common.language')}</span>
                <LocalSwitcher changeLocalAction={changeLocalAction} />
              </div>

              <div className="my-3 h-px bg-gray-200" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut size={20} className="text-red-500" />
                <span className="font-medium">{t('common.logout')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}