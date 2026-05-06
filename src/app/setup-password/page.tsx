'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Eye, EyeOff, Check, X } from 'lucide-react'

function SetupPasswordContent() {
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
      { regex: /.{8,}/, text: "At least 8 characters", met: false },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter", met: false },
      { regex: /[a-z]/, text: "At least 1 lowercase letter", met: false },
      { regex: /[0-9]/, text: "At least 1 number", met: false },
      { regex: /[^A-Za-z0-9]/, text: "At least 1 special character", met: false },
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
    if (strengthScore === 0) return "bg-gray-200"
    if (strengthScore <= 2) return "bg-red-500"
    if (strengthScore <= 4) return "bg-amber-500"
    return "bg-emerald-500"
  }
  
  const getStrengthText = () => {
    if (strengthScore === 0) return "Enter a password"
    if (strengthScore <= 2) return "Weak password"
    if (strengthScore <= 4) return "Medium password"
    return "Strong password"
  }

  // Validasi token saat load
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('No token provided. Please check your invitation link.')
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
          setError(data.message || 'Invalid or expired token')
        }
      } catch (err) {
        setError('Failed to validate token. Please try again.')
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!isStrong) {
      setError('Please meet all password requirements below')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
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
        setError(data.message || 'Something went wrong')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Loading state
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Validating your link...</p>
        </div>
      </div>
    )
  }
  
  // Invalid token state
  if (!token || (!validating && !isValidToken)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-red-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Link</h1>
          <p className="text-gray-600 mb-6">
            {error || 'This password setup link is invalid or has expired.'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Possible reasons:<br/>
            • The link has already been used<br/>
            • The link expired (valid for 24 hours)<br/>
            • The link was tampered with
          </p>
          <button
            onClick={() => router.push('/login')}
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }
  
  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Password Set!</h1>
          <p className="text-gray-600 mb-4">Your password has been successfully set.</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div className="bg-indigo-600 h-1 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    )
  }
  
  // Main form
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Set Up Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create a strong password for your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Password Field */}
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>
            
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Password strength:</span>
                  <span className={`font-medium ${
                    strengthScore === 5 ? 'text-emerald-600' :
                    strengthScore <= 2 ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${(strengthScore / 5) * 100}%` }}
                  />
                </div>
                <ul className="grid grid-cols-1 gap-1 text-xs mt-2">
                  {passwordStrength.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      {req.met ? (
                        <Check className="h-3 w-3 text-emerald-500" strokeWidth={2} />
                      ) : (
                        <X className="h-3 w-3 text-gray-300" strokeWidth={2} />
                      )}
                      <span className={req.met ? 'text-emerald-600' : 'text-gray-500'}>
                        {req.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>
            
            {/* Password Match Indicator */}
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="text-red-600 text-xs flex items-center gap-1">
                <X className="h-3 w-3" strokeWidth={2} />
                Passwords do not match
              </p>
            )}
            
            {confirmPassword.length > 0 && password === confirmPassword && password.length > 0 && (
              <p className="text-emerald-600 text-xs flex items-center gap-1">
                <Check className="h-3 w-3" strokeWidth={2} />
                Passwords match
              </p>
            )}
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading || !isStrong || password !== confirmPassword}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Setting up...
                </div>
              ) : (
                'Set Password'
              )}
            </button>
          </div>
        </form>
        
        {/* Footer */}
        <p className="mt-4 text-center text-xs text-gray-500">
          By setting a password, you agree to our <a href="/terms" className="text-indigo-600 hover:underline">Terms of Service</a>
        </p>
      </div>
    </div>
  )
}

export default function SetupPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SetupPasswordContent />
    </Suspense>
  )
}