-- Tabla de perfiles de usuario (complementa auth.users de Supabase)
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS: cada usuario solo ve/edita su propio perfil
alter table public.user_profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Users can view own profile' and tablename = 'user_profiles'
  ) then
    create policy "Users can view own profile"
      on public.user_profiles for select
      using (auth.uid() = id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Users can update own profile' and tablename = 'user_profiles'
  ) then
    create policy "Users can update own profile"
      on public.user_profiles for update
      using (auth.uid() = id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Users can insert own profile' and tablename = 'user_profiles'
  ) then
    create policy "Users can insert own profile"
      on public.user_profiles for insert
      with check (auth.uid() = id);
  end if;
end $$;

-- Trigger para actualizar updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'user_profiles_updated_at'
  ) then
    create trigger user_profiles_updated_at
      before update on public.user_profiles
      for each row execute function update_updated_at();
  end if;
end $$;
