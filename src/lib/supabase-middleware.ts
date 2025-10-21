import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { env } from '@/lib/env';

// (versão tipada que você já está usando)
type SetCookie = Parameters<ReturnType<typeof NextResponse.next>['cookies']['set']>[0];
type CookieOptions = Omit<SetCookie, 'name' | 'value'>;

export function createSupabaseForMiddleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options?: CookieOptions) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options?: CookieOptions) => {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    },
  );
  return { supabase, res };
}
