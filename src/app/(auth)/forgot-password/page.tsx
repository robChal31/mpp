// app/(auth)/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { 
  ArrowLeft, 
  Mail, 
  CheckCircle, 
  Loader2,
  Sparkles,
  Shield,
  GraduationCap
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function ForgotPasswordPage() {
  const t = useTranslations('ForgotPassword')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error(t('emailRequired'))
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok && data.status === "success") {
        setIsSubmitted(true)
        toast.success(t('successMessage'))
      } else {
        toast.error(data.message || t('errorMessage'))
      }
    } catch (error) {
      toast.error(t('errorMessage'))
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCF6E4] px-4">
        <div className="w-full max-w-md">
          <Card className="p-8 text-center border border-gray-200 bg-white shadow-xl rounded-2xl">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('checkEmail')}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {t('checkEmailDescription')}
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 break-all">
                <span className="font-medium">{t('sentTo')}</span> {email}
              </p>
            </div>
            <Link href="/login">
              <Button className="w-full bg-[#3279FF] hover:bg-[#2b66d9] text-white rounded-xl py-5 gap-2">
                <ArrowLeft size={16} />
                {t('backToLogin')}
              </Button>
            </Link>
            <p className="text-xs text-gray-400 mt-4">
              {t('resendHint')}{' '}
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-[#3279FF] hover:underline"
              >
                {t('tryAgain')}
              </button>
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF6E4] px-4 py-8">
      
      {/* Decorative blur backgrounds */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#3279FF]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFB347]/20 rounded-full blur-3xl" />
      </div>

      {/* Dot pattern */}
      <div className="fixed inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3279FF 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

      <div className="relative w-full max-w-md">
        <Card className="p-8 border border-gray-200 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
          
          {/* Logo */}
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
            <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
            <p className="text-gray-500 text-sm mt-1">
              {t('description')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('emailLabel')}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </div>
                <Input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 border-gray-200 focus:border-[#3279FF] focus:ring-[#3279FF] rounded-xl py-2.5"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#3279FF] hover:bg-[#2b66d9] text-white font-semibold gap-2 shadow-lg shadow-[#3279FF]/20 rounded-xl py-6 text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  {t('sending')}
                </div>
              ) : (
                <>
                  {t('sendResetLink')}
                  <Mail size={16} />
                </>
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-gray-500 hover:text-[#3279FF] transition-colors flex items-center justify-center gap-2">
              <ArrowLeft size={14} />
              {t('backToLogin')}
            </Link>
          </div>

          {/* Trust badge */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Shield size={12} className="text-[#3279FF]" />
                <span>{t('secure')}</span>
              </div>
              <div className="w-px h-3 bg-gray-200" />
              <div className="flex items-center gap-1.5">
                <GraduationCap size={12} className="text-[#3279FF]" />
                <span>{t('trusted')}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>© 2026 Mentari Partner. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}