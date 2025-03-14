import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirect = requestUrl.searchParams.get('redirect');
  const next = requestUrl.searchParams.get('next');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      await supabase.auth.exchangeCodeForSession(code);

      // Check if this was an email confirmation
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.email_confirmed_at) {
        // If there's a specific redirect for email confirmation
        if (redirect) {
          return NextResponse.redirect(new URL(redirect, requestUrl.origin));
        }
        // Default to confirmation success page
        return NextResponse.redirect(new URL('/auth/confirmation', requestUrl.origin));
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(new URL('/login?error=auth', requestUrl.origin));
    }
  }

  // For other auth flows (like OAuth), redirect to the next URL or default to AI page
  const redirectTo = next || '/ai';
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
} 