'use client';

import { createBrowserClient } from '@supabase/ssr';
import { env } from './env';

let _client: ReturnType<typeof createBrowserClient> | null = null;

export function supabaseBrowser() {
  if (_client) return _client;
  _client = createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return _client;
}
