'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const t = useTranslations('login')
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [signupDone, setSignupDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      setSignupDone(true)
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Ambient blobs */}
      <div
        className="blob"
        style={{
          width: 500,
          height: 500,
          top: '-15%',
          left: '-10%',
          background: 'radial-gradient(circle, rgba(87,187,138,0.12) 0%, transparent 70%)',
          animation: 'blob-drift 18s ease-in-out infinite',
        }}
      />
      <div
        className="blob"
        style={{
          width: 400,
          height: 400,
          bottom: '-10%',
          right: '-5%',
          background: 'radial-gradient(circle, rgba(74,144,217,0.09) 0%, transparent 70%)',
          animation: 'blob-drift-alt 22s ease-in-out infinite',
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo mark */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-1"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              background: 'linear-gradient(135deg, #57bb8A 0%, #4A90D9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            HabitCircuit
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {t('tagline')}
          </p>
        </div>

        {/* Glass card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {signupDone ? (
            <div className="text-center">
              <p className="text-sm mb-4" style={{ color: 'var(--text)' }}>
                {t('confirmEmail')}
              </p>
              <button
                onClick={() => { setMode('signin'); setSignupDone(false) }}
                className="text-sm font-medium cursor-pointer transition-opacity hover:opacity-70"
                style={{ color: '#57bb8A' }}
              >
                {t('backToSignIn')}
              </button>
            </div>
          ) : (
            <>
              {/* Mode toggle */}
              <div
                className="flex mb-6 rounded-xl overflow-hidden p-1 gap-1"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                {(['signin', 'signup'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(null) }}
                    className="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer"
                    style={{
                      background: mode === m
                        ? 'linear-gradient(135deg, #57bb8A, #4A90D9)'
                        : 'transparent',
                      color: mode === m ? '#0a0a0c' : 'var(--muted)',
                      boxShadow: mode === m ? '0 2px 8px rgba(87,187,138,0.25)' : 'none',
                    }}
                  >
                    {m === 'signin' ? t('signIn') : t('signUp')}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: 'var(--muted)' }}
                  >
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full px-3 py-2.5 text-sm"
                    placeholder={t('emailPlaceholder')}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: 'var(--muted)' }}
                  >
                    {t('password')}
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full px-3 py-2.5 text-sm"
                    placeholder={mode === 'signup' ? t('passwordHint') : t('passwordPlaceholder')}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  />
                </div>

                {error && (
                  <p className="text-xs" role="alert" style={{ color: '#E67C73' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #57bb8A 0%, #4A90D9 100%)',
                    color: '#0a0a0c',
                    boxShadow: '0 4px 16px rgba(87,187,138,0.25)',
                  }}
                >
                  {loading ? t('loading') : mode === 'signin' ? t('signIn') : t('createAccount')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
