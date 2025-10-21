'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
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
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }
    router.push(redirect);
  }

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="text-xl mb-4">Sign in</h1>
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
          {loading ? 'Signing...' : 'Sign in'}
        </button>
        {err && <p className="text-red-400 text-sm">{err}</p>}
      </form>
    </div>
  );
}
