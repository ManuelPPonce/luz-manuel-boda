-- Ejecuta esto en el SQL Editor del proyecto:
-- pflipjtwllbmpmqlwpjb.supabase.co
--
-- Repara el caso donde las tablas existen en el editor, pero /rest/v1 no las ve.

create table if not exists public.guests (
  id text primary key,
  name text not null,
  guests integer not null default 0,
  "companionNames" text not null default '[]',
  "tableNumber" integer not null default 0,
  confirmed integer not null default 0
);

create table if not exists public.confirmed (
  id text primary key,
  name text not null,
  email text not null default '',
  guests integer not null default 0,
  dietary text not null default '',
  message text not null default '',
  songs text not null default '',
  "confirmedAt" text not null default '',
  "tableNumber" integer not null default 0,
  "checkedIn" integer not null default 0,
  "checkedInAt" text not null default ''
);

create table if not exists public.tables_data (
  id text primary key,
  number integer not null default 0,
  capacity integer not null default 8,
  x real not null default 0,
  y real not null default 0,
  w real not null default 100,
  h real not null default 100,
  rotation real not null default 0,
  shape text not null default 'circle',
  type text not null default 'guest'
);

grant usage on schema public to anon, authenticated, service_role;
grant all on table public.guests to anon, authenticated, service_role;
grant all on table public.confirmed to anon, authenticated, service_role;
grant all on table public.tables_data to anon, authenticated, service_role;

alter table public.guests enable row level security;
alter table public.confirmed enable row level security;
alter table public.tables_data enable row level security;

drop policy if exists "service role guests access" on public.guests;
drop policy if exists "service role confirmed access" on public.confirmed;
drop policy if exists "service role tables access" on public.tables_data;

create policy "service role guests access"
  on public.guests
  for all
  to service_role
  using (true)
  with check (true);

create policy "service role confirmed access"
  on public.confirmed
  for all
  to service_role
  using (true)
  with check (true);

create policy "service role tables access"
  on public.tables_data
  for all
  to service_role
  using (true)
  with check (true);

notify pgrst, 'reload schema';

select
  table_schema,
  table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('guests', 'confirmed', 'tables_data')
order by table_name;
