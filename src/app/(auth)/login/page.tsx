'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, ArrowRight, Mail, Lock, GraduationCap, Building, Shield, HelpCircle, Info, FileQuestion, PlayCircle } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
      window.location.href = redirectTo || "/dashboard"
    } else {
      toast.error("Invalid email or password")
    }
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-[#FCF6E4]">
      
      {/* Blur backgrounds */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#3279FF]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFB347]/20 rounded-full blur-3xl" />
      </div>

      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3279FF 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[65%_35%] w-full h-full">
        
        {/* LEFT SIDE */}
        <div className="hidden md:flex relative h-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=800&fit=crop&crop=center"
            alt="Education background"
            className="absolute inset-0 w-full h-full object-cover scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-linear-to-br from-[#3279FF]/85 via-[#4a7dff]/75 to-[#3279FF]/80" />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          
          <div className="relative z-10 w-full h-full p-12 flex flex-col justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <GraduationCap size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Mentari Partner</p>
                <p className="text-white/50 text-[10px]">Education Platform</p>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center -mt-6">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/20">
                <GraduationCap size={36} className="text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white leading-tight">
                Welcome to <span className="text-[#FFB347]">MP Portal</span>
              </h1>
              <p className="text-white/80 text-sm mt-3 max-w-sm leading-relaxed">
                Your one-stop platform to manage partnership benefits, discover events, and track your school's progress.
              </p>
              <div className="flex gap-3 mt-5">
                <span className="px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs border border-white/20">
                  🎓 Exclusive benefits
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs border border-white/20">
                  🔒 Secure access
                </span>
              </div>
            </div>
          </div>
        </div>
                
        {/* RIGHT SIDE */}
        <div className="relative bg-background md:bg-white flex items-center justify-center h-full overflow-hidden p-8 md:p-10">
          
          {/* Background garis */}
          <div className="absolute inset-0 bg-linear-to-br from-[#3279FF]/2 via-white to-[#FFB347]/2 pointer-events-none" />
          
          {/* Garis dekoratif */}
          <svg className="absolute top-0 left-0 w-1/2 h-1/2 pointer-events-none opacity-15">
            <path d="M0 0 Q100 50, 200 100 T350 180" stroke="#3279FF" strokeWidth="2" fill="none" strokeDasharray="6 10" />
            <path d="M0 20 Q120 70, 220 130 T380 200" stroke="#FFB347" strokeWidth="1.5" fill="none" strokeDasharray="4 12" />
            <path d="M0 40 Q80 80, 150 140 T300 220" stroke="#3279FF" strokeWidth="1" fill="none" strokeDasharray="8 6" />
          </svg>
          <svg className="absolute top-0 right-0 w-1/2 h-1/2 pointer-events-none opacity-15">
            <path d="M100% 0 Q80% 50, 60% 100 T45% 180" stroke="#FFB347" strokeWidth="2" fill="none" strokeDasharray="6 10" />
            <path d="M100% 20 Q75% 70, 55% 130 T40% 200" stroke="#3279FF" strokeWidth="1.5" fill="none" strokeDasharray="4 12" />
          </svg>
          <svg className="absolute bottom-0 left-0 w-1/2 h-1/2 pointer-events-none opacity-12">
            <path d="M0 100% Q100 80%, 200 60% T350 40%" stroke="#3279FF" strokeWidth="2" fill="none" strokeDasharray="6 10" />
            <path d="M0 90% Q120 70%, 220 50% T380 30%" stroke="#FFB347" strokeWidth="1.5" fill="none" strokeDasharray="4 12" />
          </svg>
          <svg className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none opacity-12">
            <path d="M100% 100% Q80% 80%, 60% 60% T45% 40%" stroke="#FFB347" strokeWidth="2" fill="none" strokeDasharray="6 10" />
            <path d="M100% 90% Q75% 70%, 55% 50% T40% 30%" stroke="#3279FF" strokeWidth="1.5" fill="none" strokeDasharray="4 12" />
          </svg>
          <svg className="absolute top-1/2 left-0 w-full h-12 pointer-events-none opacity-10 -translate-y-1/2">
            <path d="M0 0 Q200 -15, 400 0 T800 5 T1200 -5" stroke="#3279FF" strokeWidth="1.5" fill="none" strokeDasharray="8 8" />
          </svg>
          
          {/* Decorative dots */}
          <div className="absolute top-[8%] left-[15%] w-2 h-2 rounded-full bg-[#3279FF]/30 animate-pulse" />
          <div className="absolute top-[15%] right-[20%] w-1.5 h-1.5 rounded-full bg-[#FFB347]/25" />
          <div className="absolute bottom-[20%] left-[12%] w-1.5 h-1.5 rounded-full bg-[#3279FF]/20" />
          <div className="absolute bottom-[12%] right-[18%] w-2 h-2 rounded-full bg-[#FFB347]/30 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[45%] left-[8%] w-1 h-1 rounded-full bg-[#3279FF]/15" />
          <div className="absolute top-[55%] right-[10%] w-1 h-1 rounded-full bg-[#FFB347]/15" />
          
          {/* GIF */}
          <div className="absolute top-12 right-4 w-48 h-48 hidden lg:block">
            <img
              src="/illustrations/gif3.gif"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* ============ CONTENT ============ */}
          <div className="relative z-10 w-full max-w-sm mx-auto md:border md:border-slate-200 md:rounded-xl md:shadow-sm md:bg-white md:p-8 md:pb-16">

            {/* Header - Sign In */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/5 mb-3">
                <div className="relative w-20 h-20">
                  <Image
                    src="/compro2.png"
                    alt="Mentari Partner Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
              <p className="text-slate-500 text-sm mt-1">
                Access your partnership dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="school@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-slate-200 focus:border-primary focus:ring-primary rounded-xl py-2.5"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-[#3279FF] hover:underline font-medium">
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
                    className="w-full pr-10 border-slate-200 focus:border-primary focus:ring-primary rounded-xl py-2.5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#3279FF] hover:bg-[#2b66d9] text-white font-semibold gap-2 shadow-lg shadow-[#3279FF]/20 rounded-xl py-6 text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
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
        
      </div>

      {/* FOOTER - Video Tutorial, About, FAQ ditempatkan di sini (sebelum copyright) */}
      <div className="absolute md:bottom-16 bottom-12 left-0 right-0 text-center z-10">
        <div className="flex items-center justify-center gap-6">
          <Link href="/video-tutorial" className="flex items-center gap-1.5 text-xs md:text-sm md:text-gray-50 md:hover:text-white text-gray-600 hover:text-gray-700 transition-colors">
            <PlayCircle size={13} />
            Video Tutorial
          </Link>
          <div className="w-px h-3 bg-slate-300" />
          <Link href="/about" className="flex items-center gap-1.5 text-xs md:text-sm md:text-gray-50 md:hover:text-white text-gray-600 hover:text-gray-700 transition-colors">
            <Info size={13} />
            About
          </Link>
          <div className="w-px h-3 bg-slate-300" />
          <Link href="/faq" className="flex items-center gap-1.5 text-xs md:text-sm md:text-gray-50 md:hover:text-white text-gray-600 hover:text-gray-700 transition-colors">
            <FileQuestion size={13} />
            FAQ
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400 px-4">
        <p>© 2026 Mentari Partner. All rights reserved.</p>
      </div>
    </div>
  )
}