// src/lib/redirect.ts

/**
 * Garante que só redirecionamos para paths internos seguros.
 * - Deve começar com "/"
 * - Não pode conter protocolo (http://, https://)
 * - Fallback para "/dashboard" se inválido ou ausente
 */
export function resolveSafeRedirect(input: string | null | undefined): string {
  if (!input) return '/dashboard';
  try {
    // Não aceitar URLs absolutas (com protocolo/host)
    // e só aceitar caminhos absolutos internos.
    if (input.startsWith('/') && !input.startsWith('//') && !/^https?:\/\//i.test(input)) {
      return input;
    }
  } catch {
    // ignore
  }
  return '/dashboard';
}
