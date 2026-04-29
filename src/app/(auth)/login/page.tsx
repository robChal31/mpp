'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Eye, EyeOff, Sparkles, ArrowRight, Building, Shield, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'

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
      window.location.href = "/dashboard"
    } else {
      toast.error("Invalid email or password")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-slate-100">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Branding */}
            <div className="hidden md:block space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <GraduationCap size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary">Mentari Premium Partner</span>
              </div>
              
              <h1 className="text-5xl font-bold leading-tight text-slate-900">
                Welcome to{' '}
                <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  MPP Portal
                </span>
              </h1>
              
              <p className="text-slate-600 text-lg">
                Your one-stop platform to manage partnership benefits, 
                discover events, and track your school's progress.
              </p>

              <div className="flex flex-col gap-3 pt-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building size={18} className="text-primary" />
                  </div>
                  <span className="text-sm">Exclusive partner benefits</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield size={18} className="text-primary" />
                  </div>
                  <span className="text-sm">Secure access for schools</span>
                </div>
              </div>

              {/* Testimonial/Card */}
              <div className="mt-8 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Sekolah Unggulan</p>
                    <p className="text-xs text-slate-500">Partner since 2024</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  "MPP membantu kami mengelola benefit dengan mudah dan efisien."
                </p>
              </div>
            </div>

            {/* Right Side - Login Card */}
            <div>
              <Card className="p-8 border-slate-200 bg-white/80 backdrop-blur-sm shadow-xl">
                {/* Mobile Logo */}
                <div className="text-center md:hidden mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <GraduationCap className="text-primary" size={24} />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">MPP</h1>
                  <p className="text-slate-500 text-sm">Mentari Premium Partner</p>
                </div>

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <Sparkles className="text-primary" size={24} />
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
                      className="w-full border-slate-200 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pr-10 border-slate-200 focus:border-primary focus:ring-primary"
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
                    className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold gap-2 shadow-lg shadow-primary/20"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                    {!isLoading && <ArrowRight size={16} />}
                  </Button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-400">
                    Demo: Use any email and password to proceed
                  </p>
                </div>
              </Card>

              {/* Footer */}
              <div className="mt-6 text-center text-xs text-slate-400">
                <p>© 2026 Mentari Premium Partner. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}