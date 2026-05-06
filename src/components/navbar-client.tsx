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
  Sparkles,
  ChevronDown,
  User,
} from 'lucide-react'
import Image from 'next/image'

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Benefits', href: '/benefits', icon: Gift },
  { label: 'Events', href: '/events', icon: Calendar },
  { label: 'Settings', href: '/settings', icon: Settings },
]

interface NavbarClientProps {
  user: { name: string; email: string; role: string } | null
}

export function NavbarClient({ user }: NavbarClientProps) {
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
      <div className="max-w-full px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="relative w-28 h-28">
                <Image
                  src="/compro2.png"
                  alt="Mentari Partner Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {/* Teks MPP & tagline dihapus */}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href}>
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
                      <span className="hidden lg:inline">{item.label}</span>
                      {active && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                      )}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side - School info and logout */}
          <div className="flex items-center gap-4">
            {/* School Info */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">School Account</p>
                <p className="text-sm font-medium text-foreground truncate max-w-37.5">
                  {user?.name || 'Sekolah Example'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <User size={14} className="text-primary" />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-border" />

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 cursor-pointer"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-1 border-t border-border animate-in slide-in-from-top-2 duration-200">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={18} className={active ? 'text-primary' : ''} />
                    <span>{item.label}</span>
                    {active && (
                      <ChevronDown size={14} className="ml-auto -rotate-90" />
                    )}
                  </Button>
                </Link>
              )
            })}
            
            {/* Divider in mobile */}
            <div className="my-3 h-px bg-border" />
            
            {/* School Info in mobile */}
            <div className="flex items-center justify-between px-3 py-2">
              <div>
                <p className="text-xs text-muted-foreground">School Account</p>
                <p className="text-sm font-medium text-foreground">
                  {user?.name || 'Sekolah Example'}
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="gap-2 text-destructive hover:bg-destructive/10"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}