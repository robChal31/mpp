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
  Shield,
  GraduationCap,
  Info,
  FileQuestion,
  PlayCircle,
  CircleHelp
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function ForgotPasswordPage() {
  const t = useTranslations('ForgotPassword')
  const footerT = useTranslations('Footer')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const currentYear = new Date().getFullYear()

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
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <Card className="border-border bg-white p-8 text-center shadow-xl rounded-2xl">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t('checkEmail')}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {t('checkEmailDescription')}
            </p>
            <div className="bg-muted rounded-xl p-4 mb-6">
              <p className="text-sm text-foreground break-all">
                <span className="font-medium">{t('sentTo')}</span> {email}
              </p>
            </div>
            <Link href="/login">
              <Button className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-5 gap-2">
                <ArrowLeft size={16} />
                {t('backToLogin')}
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-4">
              {t('resendHint')}{' '}
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-primary hover:underline"
              >
                {t('tryAgain')}
              </button>
            </p>
          </Card>

          {/* Footer */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
              <Link href="/help-center" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <CircleHelp size={12} />
                Help Center
              </Link>
              <span className="w-px h-3 bg-border" />
              <Link href="/about" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Info size={12} />
                About
              </Link>
            </div>
            <p className="text-[10px] text-muted-foreground">
              © {currentYear} Mentari Partner. {footerT('allRightsReserved')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      
      {/* Decorative blur backgrounds */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      {/* Dot pattern */}
      <div className="fixed inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#97262C 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

      <div className="relative w-full max-w-md">
        <Card className="border-border bg-white/90 backdrop-blur-sm p-8 shadow-xl rounded-2xl">
          
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/5 mb-3">
              <div className="relative w-20 h-20">
                <Image
                  src="/compro.png"
                  alt="Mentari Partner Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground">{t('title')}</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {t('description')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                {t('emailLabel')}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail size={18} />
                </div>
                <Input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 border-border focus:border-primary focus:ring-primary rounded-xl py-2.5 bg-white"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold gap-2 rounded-xl py-6 text-base transition-all duration-300 hover:shadow-lg"
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
            <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
              <ArrowLeft size={14} />
              {t('backToLogin')}
            </Link>
          </div>

          {/* Trust badge */}
          <div className="mt-6 pt-4 border-t border-border">
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
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-[10px] text-muted-foreground">
            © {currentYear} Mentari Partner. {footerT('allRightsReserved')}
          </p>
        </div>
      </div>
    </div>
  )
}