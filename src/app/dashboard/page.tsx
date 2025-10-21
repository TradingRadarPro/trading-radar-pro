import { supabaseServer } from '@/lib/supabase-server';

export default async function DashboardPage() {
  const sb = await supabaseServer(); // ⬅️ adicione await
  const {
    data: { user },
  } = await sb.auth.getUser();

  return (
    <div className="p-6">
      <h1 className="text-xl mb-2">Dashboard</h1>
      <p>Auth status: {user ? 'authenticated' : 'anonymous'}</p>
      <p>Email: {user?.email ?? '—'}</p>
      <p className="mt-4">
        <a className="underline" href="/auth/logout">
          Logout
        </a>
      </p>
    </div>
  );
}
