import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseForMiddleware } from '@/lib/supabase-middleware';

// rotas protegidas por regex (aqui: /dashboard e qualquer subrota)
const PROTECTED = [/^\/dashboard(\/.*)?$/];

export async function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);

  // se não é rota protegida, deixa passar
  const isProtected = PROTECTED.some((re) => re.test(pathname));
  if (!isProtected) return NextResponse.next();

  // cria supabase client + response que propaga cookies
  const { supabase, res } = createSupabaseForMiddleware(req);

  // checa sessão
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // se não logado, redireciona para /auth/login e guarda de onde veio
  if (!user) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // logado → segue normalmente
  return res;
}

// diz ao Next em quais caminhos o middleware roda
export const config = {
  matcher: ['/dashboard/:path*'],
};
