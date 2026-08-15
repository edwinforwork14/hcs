-- ============================================================
-- HCS Trading — Live Support Chat (Phase 1)
-- Run this in the Supabase SQL Editor (project > SQL > New query).
-- Tables: conversations, messages, admins
-- ============================================================

-- ------------------------------------------------------------
-- conversations
-- ------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  customer_location text,
  customer_language text,
  status text not null default 'open',
  -- Used to compute "unread" counts in the admin dashboard.
  admin_last_read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.conversations
  add constraint conversations_status_check
  check (status in ('open', 'closed'));

-- ------------------------------------------------------------
-- messages
-- ------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_type text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.messages
  add constraint messages_sender_type_check
  check (sender_type in ('customer', 'admin'));

create index if not exists messages_conversation_id_idx on public.messages(conversation_id, created_at);

-- ------------------------------------------------------------
-- admins (authorized support staff, linked to Supabase Auth users by email)
-- ------------------------------------------------------------
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Keep conversations.updated_at fresh
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Seed an admin (replace with the real support email).
-- The matching Auth user must exist in Authentication > Users.
-- ------------------------------------------------------------
insert into public.admins (email, name)
values ('admin@hcstradingllc.org', 'Support Admin')
on conflict (email) do nothing;

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.admins enable row level security;

-- Anonymous visitors (customer widget):
--  - create conversations and send customer messages
--  - read conversations/messages (needed for history + Realtime)
-- NOTE (MVP trade-off): anon clients can read all conversations/messages.
-- Phase 2 should replace this with per-conversation access tokens so anon
-- clients can only see their own conversation.
create policy "anon insert conversations" on public.conversations
  for insert to anon with check (true);

create policy "anon read conversations" on public.conversations
  for select to anon using (true);

create policy "anon insert customer messages" on public.messages
  for insert to anon with check (sender_type = 'customer');

create policy "anon read messages" on public.messages
  for select to anon using (true);

-- Authenticated (signed-in admins):
--  - read everything (needed for Realtime in the dashboard)
--  - reply as admin
--  - update conversation status / read markers
create policy "authenticated read conversations" on public.conversations
  for select to authenticated using (true);

create policy "authenticated update conversations" on public.conversations
  for update to authenticated using (true) with check (true);

create policy "authenticated read messages" on public.messages
  for select to authenticated using (true);

create policy "authenticated insert admin messages" on public.messages
  for insert to authenticated with check (sender_type = 'admin');

-- admins table is only touched server-side with the service role key.
create policy "admins service role only" on public.admins
  for all using (false);

-- ------------------------------------------------------------
-- Enable Realtime for conversations and messages
-- (Dashboard > Database > Replication, or via SQL below)
-- ------------------------------------------------------------
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.messages;
