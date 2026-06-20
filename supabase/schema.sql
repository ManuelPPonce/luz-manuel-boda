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

alter table public.guests enable row level security;
alter table public.confirmed enable row level security;
alter table public.tables_data enable row level security;

notify pgrst, 'reload schema';
