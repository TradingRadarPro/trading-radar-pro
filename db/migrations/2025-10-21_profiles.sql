-- Criação/garantia da tabela profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text default 'free' check (plan in ('free','pro')),
  locale text default 'en',
  timezone text default 'UTC',
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;

-- Policies
create policy if not exists "view own profile" on public.profiles
for select using (auth.uid() = id);

create policy if not exists "edit own profile" on public.profiles
for update using (auth.uid() = id);

create policy if not exists "insert own profile" on public.profiles
for insert with check (auth.uid() = id);

-- Índice opcional para stripe_customer_id (único quando não nulo)
create unique index if not exists profiles_stripe_customer_id_unique
on public.profiles (stripe_customer_id)
where stripe_customer_id is not null;

-- Backfill: cria perfis que estiverem faltando
insert into public.profiles (id, plan, locale, timezone)
select u.id, 'free', 'en', 'UTC'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
