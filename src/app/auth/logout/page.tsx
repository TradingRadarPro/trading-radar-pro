'use client';

import { useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const sb = supabaseBrowser();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await sb.auth.signOut();
      router.replace('/auth/login'); // sem redirectedFrom aqui
    })();
  }, [sb, router]);

  return <p className="p-6">Signing out…</p>;
}
