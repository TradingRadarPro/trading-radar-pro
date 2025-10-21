import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

type Plan = 'free' | 'pro';
type ProfileRow = {
  id: string;
  plan: Plan;
  locale: string;
  timezone: string;
  stripe_customer_id: string | null;
  created_at: string;
};

export async function GET() {
  const sb = supabaseServer();

  // 1) usuário autenticado?
  const { data: userData } = await sb.auth.getUser();
  const user = userData.user ?? null;

  // 2) tenta buscar o próprio profile (RLS permite apenas o do usuário)
  let profile: ProfileRow | null = null;

  if (user) {
    const { data, error } = await sb
      .from('profiles')
      .select('id,plan,locale,timezone,stripe_customer_id,created_at')
      .eq('id', user.id)
      .maybeSingle();

    if (!error) profile = data;
  }

  return NextResponse.json({
    ok: true,
    user: user ? { id: user.id, email: user.email } : null,
    profile,
    ts: new Date().toISOString(),
  });
}
