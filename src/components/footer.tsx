// components/footer.tsx (Client Component)
'use client'

import Link from "next/link"
import { useState } from "react"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  ArrowUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (!email) return
    // TODO: Implement subscribe logic
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <footer className="border-t border-border bg-muted/20 mt-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MPP</span>
              </div>
              <span className="font-semibold text-foreground">Mentari Premium Partner</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering schools with premium partnership benefits, training, and educational resources.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/benefits" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Benefits
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@mentarigroups.com" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Mail size={14} />
                  support@mentarigroups.com
                </a>
              </li>
              <li>
                <a href="tel:+622112345678" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Phone size={14} />
                  +62 21 1234 5678
                </a>
              </li>
              <li>
                <div className="text-sm text-muted-foreground flex items-start gap-2">
                  <MapPin size={14} className="shrink-0 mt-0.5" />
                  <span>Jakarta, Indonesia</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter / Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest updates about new benefits and events.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="sm" className="shrink-0" onClick={handleSubscribe}>
                  Subscribe
                </Button>
              </div>
              {subscribed && (
                <p className="text-xs text-green-600">Subscribed successfully!</p>
              )}
              <p className="text-[10px] text-muted-foreground">
                By subscribing, you agree to our Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Mentari Premium Partner. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact Us
            </Link>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Back to top
            <ArrowUp size={12} />
          </button>
        </div>

        {/* Made with love */}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart size={10} className="text-red-500 fill-red-500" /> for Indonesian educators
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer