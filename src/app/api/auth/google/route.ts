import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOAuth2Client } from '@/lib/google/calendar'
import { CodeChallengeMethod } from 'google-auth-library'
import crypto from 'crypto'

// GET — initiate OAuth flow
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const oauth2Client = getOAuth2Client()
  const state = crypto.randomUUID()

  // PKCE
  const codeVerifier = crypto.randomBytes(32).toString('base64url')
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url')

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    prompt: 'consent',   // always request refresh_token
    state,
    code_challenge: codeChallenge,
    code_challenge_method: CodeChallengeMethod.S256,
  })

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    maxAge: 600,
    path: '/',
  }

  const response = NextResponse.redirect(authUrl)
  response.cookies.set('google_oauth_state', state, cookieOptions)
  response.cookies.set('google_code_verifier', codeVerifier, cookieOptions)
  return response
}

// DELETE — disconnect Google Calendar
export async function DELETE() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await supabase
    .from('profiles')
    .update({ google_refresh_token: null })
    .eq('id', user.id)

  return NextResponse.json({ success: true })
}
