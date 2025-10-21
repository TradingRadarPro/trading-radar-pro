import { z } from 'zod';

// Definimos exatamente quais envs esperamos e o formato delas
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(), // tem que ser string e URL válida
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1), // string obrigatória, não pode ser vazia
});

// Faz a validação na hora que o app inicia
export const env = clientEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
