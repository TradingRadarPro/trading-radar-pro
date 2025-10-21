'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <RegisterInner />
    </Suspense>
  );
}

function RegisterInner() {
  const sb = supabaseBrowser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirectedFrom') ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }

    // cria/atualiza profile (idempotente)
    const userId = data.user?.id;
    if (userId) {
      await sb.from('profiles').upsert(
        {
          id: userId,
          plan: 'free',
          locale: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC',
        },
        { onConflict: 'id' },
      );
    }

    router.push(redirect);
  }

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="text-xl mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={loading} className="bg-white/10 border px-4 py-2 rounded">
          {loading ? 'Creating...' : 'Sign up'}
        </button>
        {err && <p className="text-red-400 text-sm">{err}</p>}
      </form>
    </div>
  );
}
