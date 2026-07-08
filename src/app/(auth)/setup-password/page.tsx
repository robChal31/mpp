'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Eye, EyeOff, Check, X, GraduationCap, Shield, Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

function SetupPasswordContent() {
  const t = useTranslations('SetupPassword')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validating, setValidating] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  
  // Password strength checker
  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: t('requirements.length'), met: false },
      { regex: /[A-Z]/, text: t('requirements.uppercase'), met: false },
      { regex: /[a-z]/, text: t('requirements.lowercase'), met: false },
      { regex: /[0-9]/, text: t('requirements.number'), met: false },
      { regex: /[^A-Za-z0-9]/, text: t('requirements.special'), met: false },
    ]
    
    return requirements.map(req => ({
      ...req,
      met: req.regex.test(pass)
    }))
  }
  
  const [passwordStrength, setPasswordStrength] = useState(checkStrength(''))
  
  useEffect(() => {
    setPasswordStrength(checkStrength(password))
  }, [password])
  
  const strengthScore = passwordStrength.filter(req => req.met).length
  const isStrong = strengthScore === 5
  
  const getStrengthColor = () => {
    if (strengthScore === 0) return "bg-muted"
    if (strengthScore <= 2) return "bg-destructive"
    if (strengthScore <= 4) return "bg-warning"
    return "bg-success"
  }
  
  const getStrengthText = () => {
    if (strengthScore === 0) return t('strength.enter')
    if (strengthScore <= 2) return t('strength.weak')
    if (strengthScore <= 4) return t('strength.medium')
    return t('strength.strong')
  }

  // Validasi token saat load
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError(t('errors.noToken'))
        setValidating(false)
        return
      }

      try {
        const response = await fetch('/api/auth/validate-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })
        
        const data = await response.json()
        
        if (data.status === 'success') {
          setIsValidToken(true)
        } else {
          setError(data.message || t('errors.invalidToken'))
        }
      } catch (err) {
        setError(t('errors.validationFailed'))
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!isStrong) {
      setError(t('errors.weakPassword'))
      return
    }
    
    if (password !== confirmPassword) {
      setError(t('errors.passwordMismatch'))
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })
      
      const data = await response.json()
      
      if (data.status === 'success') {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError(data.message || t('errors.general'))
      }
    } catch (err) {
      setError(t('errors.network'))
    } finally {
      setLoading(false)
    }
  }
  
  // Loading state
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-medium">{t('validating')}</p>
        </div>
      </div>
    )
  }
  
  // Invalid token state
  if (!token || (!validating && !isValidToken)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-border">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-destructive" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('invalid.title')}</h1>
          <p className="text-muted-foreground mb-6">
            {error || t('invalid.description')}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {t('invalid.reasons')}
          </p>
          <button
            onClick={() => router.push('/login')}
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            {t('invalid.goToLogin')}
          </button>
        </div>
      </div>
    )
  }
  
  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-border">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-success" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('success.title')}</h1>
          <p className="text-muted-foreground mb-4">{t('success.description')}</p>
          <p className="text-sm text-muted-foreground">{t('success.redirecting')}</p>
          <div className="mt-4 w-full bg-muted rounded-full h-1 overflow-hidden">
            <div className="bg-primary h-1 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    )
  }
  
  // Main form
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-border">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 relative mb-4">
            <Image
              src="/compro.png"
              alt="Mentari Partner Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('title')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('description')}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                {t('newPassword')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-border placeholder:text-muted-foreground text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm pr-10"
                  placeholder={t('newPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>
            
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t('strength.label')}</span>
                  <span className={`font-medium ${
                    strengthScore === 5 ? 'text-success' :
                    strengthScore <= 2 ? 'text-destructive' : 'text-warning'
                  }`}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${(strengthScore / 5) * 100}%` }}
                  />
                </div>
                <ul className="grid grid-cols-1 gap-1 text-xs mt-2">
                  {passwordStrength.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      {req.met ? (
                        <Check className="h-3 w-3 text-success" strokeWidth={2} />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" strokeWidth={2} />
                      )}
                      <span className={req.met ? 'text-success' : 'text-muted-foreground'}>
                        {req.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-1">
                {t('confirmPassword')}
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-border placeholder:text-muted-foreground text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm pr-10"
                  placeholder={t('confirmPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>
            
            {/* Password Match Indicator */}
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="text-destructive text-xs flex items-center gap-1">
                <X className="h-3 w-3" strokeWidth={2} />
                {t('errors.passwordMismatch')}
              </p>
            )}
            
            {confirmPassword.length > 0 && password === confirmPassword && password.length > 0 && (
              <p className="text-success text-xs flex items-center gap-1">
                <Check className="h-3 w-3" strokeWidth={2} />
                {t('passwordsMatch')}
              </p>
            )}
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading || !isStrong || password !== confirmPassword}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('settingUp')}
                </div>
              ) : (
                t('setPassword')
              )}
            </button>
          </div>
        </form>
        
        {/* Footer */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {t('terms')}{' '}
          <Link href="/terms" className="text-primary hover:underline">
            {t('termsLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SetupPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{useTranslations('SetupPassword')('loading')}</p>
        </div>
      </div>
    }>
      <SetupPasswordContent />
    </Suspense>
  )
}