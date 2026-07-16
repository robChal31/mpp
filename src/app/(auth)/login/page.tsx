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
    <div className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden bg-[url(/illustrations/login-banner.png)] bg-cover bg-no-repeat">

      <div className="absolute inset-0 w-full h-full bg-linear-to-r from-primary/40 via-primary/10 to-primary/5" />

      {/* LEFT SIDE - Brand Panel (Desktop Only) */}
      <div className="hidden lg:flex w-[55%] justify-center items-center overflow-hidden">
        <div className="z-10 flex h-full w-full flex-col justify-end max-h-9/12 px-16">
          <div className="flex items-center gap-5 backdrop-blur-xs p-2">
            <div>
              <p className="text-4xl font-medium uppercase tracking-[0.15em] text-white">
                Welcome to
              </p>
              <h1 className="text-7xl mb-4 font-black leading-none tracking-[0.05em] text-white">
                Mentari Partner
              </h1>
              <p className="max-w-lg text-xl leading-8 text-white">
                Manage partnership benefits, school programs, events, and educational
                resources in one modern platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex-1 lg:w-[45%] p-4 sm:p-6 md:p-8 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md mx-auto bg-amber-50/95 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-white/20 xl:min-h-8/12 md:h-10/12 flex flex-col justify-between">
          <div className="w-full">
            {/* Logo */}
            <div className="flex flex-col items-center py-4 sm:py-6">
              <img 
                src="/compro2.png" 
                alt="Mentari Partner" 
                className="object-contain w-32 sm:w-40 md:w-48 h-auto"
              />
            </div>
            
            <div className="mb-6 text-center flex flex-col justify-center items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-primary">SIGN IN</h2>
              <div className="h-0.5 rounded-full bg-linear-to-r from-primary to-secondary w-24 sm:w-32" />
              <p className="text-muted-foreground/70 text-xs sm:text-sm mt-1">
                Access your partnership dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
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
                    className="w-full border-border focus:border-primary focus:ring-primary rounded-xl py-2.5 pl-10 bg-muted text-sm"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                </div>
              </div>

              <div className="space-y-1.5">
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
                    className="w-full px-10 border-border focus:border-primary focus:ring-primary rounded-xl py-2.5 bg-muted text-sm"
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

              <Button 
                type="submit"
                variant="default"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <>
                    SIGN IN
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs text-muted-foreground">
                <Link href="/help-center" className="flex items-center gap-1.5 hover:text-primary transition-colors group">
                  <CircleHelp size={13} className="group-hover:scale-110 transition-transform text-primary" />
                  <span>Help Center</span>
                </Link>
                <span className="w-px h-3 bg-border hidden xs:block" />
                <Link href="/about" className="flex items-center gap-1.5 hover:text-primary transition-colors group">
                  <Info size={13} className="group-hover:scale-110 transition-transform text-primary" />
                  <span>About</span>
                </Link>
                <span className="w-px h-3 bg-border hidden xs:block" />
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                © {currentYear} Mentari Partner
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}