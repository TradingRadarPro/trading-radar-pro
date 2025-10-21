// src/lib/supabase-server.ts
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { env } from './env';

type CookieStoreLike = {
  get(name: string): { value: string } | undefined;
  set(name: string, value: string, options?: CookieOptions): void;
};

// Em alguns contextos o TS infere cookies() como Readonly; em runtime é mutável.
// Criamos um “store” compatível com o que @supabase/ssr espera.
function getCookieStore(): CookieStoreLike {
  const store = cookies();

  // Cast apenas para expor o método `set` numa interface mutável
  const mutable = store as unknown as {
    get(name: string): { value: string } | undefined;
    set(name: string, value: string, options?: CookieOptions): void;
  };

  return {
    get: (name) => mutable.get(name),
    set: (name, value, options) => mutable.set(name, value, options),
  };
}

export function supabaseServer() {
  const cookieStore = getCookieStore();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions) {
        cookieStore.set(name, value, options);
      },
      remove(name: string, options?: CookieOptions) {
        // Remoção = set vazio + maxAge=0 (ou só set vazio dependendo da versão)
        cookieStore.set(name, '', { ...options, maxAge: 0 });
      },
    },
  });
}
