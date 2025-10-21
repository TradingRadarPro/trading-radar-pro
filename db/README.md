# 🧭 Trading Radar Pro — Banco de Dados (Supabase)

Este diretório contém a infraestrutura versionada do banco de dados Supabase utilizada pelo projeto **Trading Radar Pro**, incluindo tabelas, políticas RLS e scripts de migração.

---

## 📁 Estrutura

```
/db
 ├── migrations/
 │   └── 2025-10-21_profiles.sql   # Criação da tabela profiles + RLS
 └── README.md                     # Documentação do schema e práticas
```

---

## 🧱 Tabelas

### 🧑 `public.profiles`

Tabela associada 1:1 com `auth.users`.
Cada registro representa um perfil de usuário autenticado.

| Coluna       | Tipo                        | Descrição                            |
| ------------ | --------------------------- | ------------------------------------ |
| `id`         | `uuid` (PK)                 | Mesmo ID do usuário (`auth.users`)   |
| `plan`       | `text`                      | Plano do usuário (`free` por padrão) |
| `locale`     | `text`                      | Idioma preferido                     |
| `timezone`   | `text`                      | Timezone local                       |
| `created_at` | `timestamptz` default now() | Data de criação                      |

---

## 🔐 RLS (Row Level Security)

Ativada para garantir que cada usuário só acesse seu próprio registro.

```sql
alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);
```

✅ Essas políticas garantem:

- Cada usuário só enxerga o próprio perfil.
- Pode inserir apenas o registro do próprio `id`.
- Pode atualizar apenas o seu próprio perfil.

---

## 🧭 Migração Inicial

Arquivo: `migrations/2025-10-21_profiles.sql`

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  plan text,
  locale text,
  timezone text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);
```

---

## 🧰 Backfill de Usuários Antigos _(opcional)_

Caso já existam usuários no Supabase antes da criação dessa tabela:

```sql
insert into public.profiles (id, plan, locale, timezone)
select u.id, 'free', 'en', 'UTC'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
```

✅ Isso cria perfis para todos os usuários existentes sem duplicar registros.

---

## 📦 Boas Práticas

- 🗾 Cada alteração no banco deve gerar um **novo arquivo** em `db/migrations` com timestamp no nome.
  Exemplo: `2025-11-03_add_orders_table.sql`

- 🧠 **Nunca** alterar arquivos de migração já versionados — criar novos incrementais.

- 🪄 Sempre aplicar políticas RLS ao criar novas tabelas sensíveis.

- 📜 Manter este `README.md` atualizado com as tabelas e regras principais.

---

## 🥪 Como aplicar migrações manualmente

No painel SQL do Supabase ou via CLI:

```bash
-- Copie e cole o conteúdo da migration desejada
-- ou rode o script completo no Supabase SQL Editor
```

✅ Também pode ser automatizado futuramente via `supabase cli`.

---

## 📚 Referências úteis

- [Supabase Docs – RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase SQL Editor](https://app.supabase.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

---

✍️ **Última atualização:** 21/10/2025
