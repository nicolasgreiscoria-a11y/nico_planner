'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0F0F0F' }}>
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: '#E8E8E8', fontFamily: 'DM Sans, sans-serif' }}>
          Nico Planner
        </h1>
        <p className="text-center text-sm mb-8" style={{ color: '#888888' }}>
          Your weekly planner and habit tracker
        </p>

        <div
          className="rounded-xl p-6"
          style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
        >
          {signupDone ? (
            <div className="text-center">
              <p className="text-sm mb-4" style={{ color: '#E8E8E8' }}>
                Check your email to confirm your account, then sign in.
              </p>
              <button
                onClick={() => { setMode('signin'); setSignupDone(false) }}
                className="text-sm font-medium"
                style={{ color: '#57bb8A' }}
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <div className="flex mb-6 rounded-lg overflow-hidden" style={{ background: '#0F0F0F', border: '1px solid #2A2A2A' }}>
                {(['signin', 'signup'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(null) }}
                    className="flex-1 py-2 text-sm font-medium transition-colors"
                    style={{
                      background: mode === m ? '#57bb8A' : 'transparent',
                      color: mode === m ? '#0F0F0F' : '#888888',
                    }}
                  >
                    {m === 'signin' ? 'Sign in' : 'Sign up'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#888888' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1"
                    style={{
                      background: '#0F0F0F',
                      border: '1px solid #2A2A2A',
                      color: '#E8E8E8',
                    }}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#888888' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1"
                    style={{
                      background: '#0F0F0F',
                      border: '1px solid #2A2A2A',
                      color: '#E8E8E8',
                    }}
                    placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  />
                </div>

                {error && (
                  <p className="text-xs" style={{ color: '#E67C73' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
                  style={{ background: '#57bb8A', color: '#0F0F0F' }}
                >
                  {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
