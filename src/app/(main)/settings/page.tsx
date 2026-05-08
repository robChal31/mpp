'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Settings,
  Lock,
  LogOut,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  User,
  Mail,
  Loader2,
  Shield,
  Info
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface UserData {
  name: string
  email: string
}

export default function SettingsPage() {
  const t = useTranslations('Settings')
  const [user, setUser] = useState<UserData | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [activeTab, setActiveTab] = useState<'account' | 'security'>('account')
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()

        if (data && data.user) {
          setUser(data.user)
        }
      } catch (error) {
        toast.error(t('failedToFetchUser'))
      } finally {
        setLoadingUser(false)
      }
    }
    fetchUser()
  }, [t])

  const handlePasswordChange = async () => {
    if (!passwords.currentPassword) {
      setMessage({ type: 'error', text: t('currentPasswordRequired') })
      return
    }
    
    if (!passwords.newPassword) {
      setMessage({ type: 'error', text: t('newPasswordRequired') })
      return
    }
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: t('passwordsDoNotMatch') })
      return
    }
    
    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: t('passwordMinLength') })
      return
    }
    
    setLoading(true)
    setMessage(null)
    
    try {
      const res = await fetch('/api/auth/reset_password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      })
      
      const data = await res.json()
      
      if (data.status === 'success') {
        setMessage({ type: 'success', text: t('passwordChangedSuccess') })
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: data.message || t('failedToChangePassword') })
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('somethingWentWrong') })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    })

    window.location.href = "/login"
  }

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))
  }

  if (loadingUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <Settings className="text-primary" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'account'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User size={16} />
          {t('accountTab')}
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'security'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Shield size={16} />
          {t('securityTab')}
        </button>
      </div>

      {/* Messages */}
      {message && (
        <Alert className={message.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-red-500 bg-red-50 dark:bg-red-950/20'}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className="text-sm">{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Account Tab */}
      {activeTab === 'account' && (
        <Card className="p-6 border-border">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border/50">
            <Info size={18} className="text-primary" />
            <h2 className="font-semibold text-foreground">{t('profileInfo')}</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/20">
              <div className="p-2 rounded-full bg-primary/10">
                <User size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('fullName')}</p>
                <p className="text-base font-medium text-foreground">{user?.name || '-'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/20">
              <div className="p-2 rounded-full bg-primary/10">
                <Mail size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('emailAddress')}</p>
                <p className="text-base font-medium text-foreground">{user?.email || '-'}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2 text-red-500 border-red-300 hover:text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30 w-full sm:w-auto"
              >
                <LogOut size={16} />
                {t('logOut')}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="p-6 border-border">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border/50">
            <Lock size={18} className="text-primary" />
            <h2 className="font-semibold text-foreground">{t('changePassword')}</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">
                {t('currentPassword')}
              </label>
              <div className="relative">
                <Input
                  type={showPassword.current ? 'text' : 'password'}
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full pr-10"
                  placeholder={t('enterCurrentPassword')}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">
                {t('newPassword')}
              </label>
              <div className="relative">
                <Input
                  type={showPassword.new ? 'text' : 'password'}
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full pr-10"
                  placeholder={t('min6Characters')}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">
                {t('confirmPassword')}
              </label>
              <div className="relative">
                <Input
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full pr-10"
                  placeholder={t('confirmNewPassword')}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
              onClick={handlePasswordChange}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? t('changing') : t('changePassword')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}