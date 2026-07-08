'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, ArrowRight, GraduationCap, Info, FileQuestion, PlayCircle, CheckCircle, CircleHelp, Lock } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const t = useTranslations('Footer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const currentYear = new Date().getFullYear()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      toast.success("Login successful")
      const urlParams = new URLSearchParams(window.location.search)
      const redirectTo = urlParams.get('redirect')
      window.location.href = redirectTo || "/"
    } else {
      toast.error("Invalid email or password")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen max-h-screen flex overflow-hidden">
      
      {/* LEFT SIDE - Brand Panel */}
      <div className="hidden lg:flex relative w-[55%] overflow-hidden bg-primary">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1400&h=1600&fit=crop&crop=center"
          className="absolute inset-0 h-full w-full object-cover"
          alt=""
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/40 via-primary/20 to-primary/5" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Decorative Blobs */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-secondary/30 blur-[120px]" />
        <div className="absolute -bottom-40 -left-32 h-112.5 w-112.5 rounded-full bg-white/10 blur-[140px]" />

        {/* Content */}
        <div className="relative z-10 flex h-full w-full flex-col justify-center px-16">
          <div className="flex items-center gap-5 backdrop-blur-xs p-2">
            <div>
              <p className="text-2xl font-bold uppercase tracking-[0.25em] text-accent">
                Welcome to
              </p>
              <h1 className="text-7xl mb-4 font-black leading-none tracking-[0.05em] text-white">
                Mentari Partner
              </h1>
              <p className="max-w-lg text-xl leading-8 text-muted/90">
                Manage partnership benefits, school programs, events, and educational
                resources in one modern platform.
              </p>
            </div>
          </div>



          {/* Stats */}
          {/* <div className="mt-12 flex gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-5 backdrop-blur-xl">
              <p className="text-3xl font-bold text-white">200+</p>
              <p className="text-sm text-white/60">Partner Schools</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-5 backdrop-blur-xl">
              <p className="text-3xl font-bold text-white">5K+</p>
              <p className="text-sm text-white/60">Students</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-5 backdrop-blur-xl">
              <p className="text-3xl font-bold text-white">100+</p>
              <p className="text-sm text-white/60">Events</p>
            </div>
          </div> */}
        </div>

        {/* Bottom Wave */}
        <svg
          className="absolute -bottom-12 left-0 w-full h-70 opacity-75"
          viewBox="0 0 1440 280"
          preserveAspectRatio="none"
        >
          <path
            fill="#97262C"
            d="
              M0,140
              C120,90
              250,40
              360,100
              C500,190
              610,195
              720,195
              C830,195
              940,170
              1080,100
              C1190,40
              1320,30
              1440,90
              L1440,280
              L0,280
              Z
            "
          />
        </svg>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full md:w-[45%] p-6 md:p-8 flex flex-col relative md:bg-secondary/5 bg-secondary/15">
        {/* Logo Desktop */}
        {/* <div className="md:flex hidden">
          <img src="/compro.png" alt="Mentari Partner" width={150} height={150} className="object-contain" />
        </div> */}

        <div className="flex-1 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            {/* Logo Mobile */}
            <div className="flex flex-col items-center mb-8">
              <img 
                src="/compro.png" 
                alt="Mentari Partner" 
                width={250} 
                height={250} 
                className="object-contain md:w-72 md:h-64"
              />
              <div className="-mt-10 md:-mt-18 h-1 w-20 rounded-full bg-linear-to-r from-primary to-secondary md:w-30" />
            </div>
            
            <div className="mb-4 border-b border-primary/30 pb-1">
              <h2 className="text-2xl font-bold text-primary">Sign In</h2>
              <p className="text-muted-foreground/70 text-sm mt-1">
                Access your partnership dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="school@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border-border focus:border-primary focus:ring-primary rounded-xl py-2.5 pl-10 bg-muted"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-10 border-border focus:border-primary focus:ring-primary rounded-xl py-2.5 bg-muted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Lock size={18} /></span>
                </div>
              </div>

              {/* Remember Me */}
              {/* <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    rememberMe ? 'bg-primary border-primary' : 'border-accent'
                  }`}
                >
                  {rememberMe && <CheckCircle size={12} className="text-white" />}
                </button>
                <label className="text-sm text-muted-foreground cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                  Remember me
                </label>
              </div> */}

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold gap-2 rounded-xl py-6 text-base transition-all duration-300 hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer - Unified untuk semua device */}
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs text-muted-foreground">
              <Link href="/help-center" className="flex items-center gap-1.5 hover:text-primary transition-colors group">
                <CircleHelp size={13} className="group-hover:scale-110 transition-transform" />
                <span>Pusat Bantuan</span>
              </Link>
              <span className="w-px h-3 bg-border hidden xs:block" />
              <Link href="/about" className="flex items-center gap-1.5 hover:text-primary transition-colors group">
                <Info size={13} className="group-hover:scale-110 transition-transform" />
                <span>About</span>
              </Link>
              <span className="w-px h-3 bg-border hidden xs:block" />
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              © {currentYear} Mentari Partner. {t('allRightsReserved')}
            </p>
          </div>
        </div>
      </div>
      
    </div>
  )
}