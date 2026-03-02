'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Gift,
  BookOpen,
  Calendar,
  FileText,
  LogOut,
  Menu,
  X,
  Settings,
} from 'lucide-react'

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Benefits',
    href: '/benefits',
    icon: Gift,
  },
  {
    label: 'Training',
    href: '/training',
    icon: BookOpen,
  },
  {
    label: 'Events',
    href: '/events',
    icon: Calendar,
  },
  {
    label: 'Documents',
    href: '/documents',
    icon: FileText,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [schoolName] = useState('Sekolah Example')

  const handleLogout = () => {
    localStorage.removeItem('mpp_session')
    window.location.href = '/'
  }

  const isActive = (href: string) => pathname === href

  return (
    <nav className="bg-sidebar text-sidebar-foreground border-b border-sidebar-border sticky top-0 z-40">
      <div className="max-w-full px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-sidebar-primary">MPP</h1>
              <p className="text-xs text-sidebar-foreground/60 hidden sm:block">Mentari Premium Partner</p>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={active ? 'default' : 'ghost'}
                      size="sm"
                      className={`gap-2 ${
                        active
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/30'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side - School info and logout */}
          <div className="flex items-center gap-4">
            {/* School Info - hidden on small screens */}
            <div className="hidden sm:block text-right text-sm">
              <p className="text-sidebar-foreground/60 text-xs">School Account</p>
              <p className="font-semibold text-sidebar-foreground truncate max-w-xs">{schoolName}</p>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-sidebar-accent/30"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-sidebar-border/50 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={active ? 'default' : 'ghost'}
                    size="sm"
                    className={`w-full justify-start gap-2 ${
                      active
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/30'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
