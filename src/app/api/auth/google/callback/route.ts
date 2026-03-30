import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getOAuth2Client } from '@/lib/google/calendar'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const oauthError = url.searchParams.get('error')

  const redirect = (status: 'connected' | 'error') => {
    const dest = new URL('/dashboard/settings', req.url)
    dest.searchParams.set('google', status)
    const res = NextResponse.redirect(dest)
    res.cookies.delete('google_oauth_state')
    res.cookies.delete('google_code_verifier')
    return res
  }

  if (oauthError || !code) return redirect('error')

  // Verify CSRF state
  const cookieStore = cookies()
  const savedState = cookieStore.get('google_oauth_state')?.value
  if (!savedState || state !== savedState) return redirect('error')

  // Require authenticated session
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  // Read and validate PKCE verifier
  const codeVerifier = cookieStore.get('google_code_verifier')?.value
  if (!codeVerifier) return redirect('error')

  // Exchange authorization code for tokens
  const oauth2Client = getOAuth2Client()
  let refreshToken: string
  try {
    const { tokens } = await oauth2Client.getToken({ code, codeVerifier })
    if (!tokens.refresh_token) return redirect('error')
    refreshToken = tokens.refresh_token
  } catch {
    return redirect('error')
  }

  await supabase
    .from('profiles')
    .update({ google_refresh_token: refreshToken })
    .eq('id', user.id)

  return redirect('connected')
}
