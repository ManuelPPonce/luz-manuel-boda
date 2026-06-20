-- Importa a la invitacion actual solo los registros que SI confirmaron en boda_backup.sql.
-- Es idempotente: puedes correrlo mas de una vez sin duplicar.
begin;

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

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-2', 'Familia Canales Mendoza', 2, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-2', 'Familia Canales Mendoza', '', 2, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T00:57:57', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-3', 'Miguel Palma', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-3', 'Miguel Palma', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-14T17:41:57', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-4', 'Fernando Pool', 0, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-4', 'Fernando Pool', '', 0, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-14T17:42:14', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-5', 'Familia Tuyub Cen y Sr. Enrique Tuyub', 2, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-5', 'Familia Tuyub Cen y Sr. Enrique Tuyub', '', 2, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T00:35:54', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-6', 'Sra. Teresita Cervera y Familia Sánchez Cú', 3, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-6', 'Sra. Teresita Cervera y Familia Sánchez Cú', '', 3, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-21T21:37:01', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-7', 'Familia Aguilar Cú', 3, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-7', 'Familia Aguilar Cú', '', 3, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-21T21:36:58', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-8', 'Familia Estrella Cú', 3, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-8', 'Familia Estrella Cú', '', 3, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-21T21:37:00', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-9', 'Martha Zuñiga', 0, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-9', 'Martha Zuñiga', '', 0, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-21T21:26:29', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-10', 'Familia Avilés Tejeda', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-10', 'Familia Avilés Tejeda', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-14T21:23:26', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-11', 'Hermes Perez Cheng', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-11', 'Hermes Perez Cheng', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-22T17:50:54', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-12', 'Familia Sleme Moran', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-12', 'Familia Sleme Moran', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-21T01:04:39', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-13', 'Fam Perez Cuevas', 3, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-13', 'Fam Perez Cuevas', '', 3, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-22T17:50:59', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-14', 'Familia Echevarría Arceo', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-14', 'Familia Echevarría Arceo', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-21T01:04:37', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-15', 'Ana Moreno', 0, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-15', 'Ana Moreno', '', 0, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-20T22:39:17', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-16', 'Antonio Cruz', 0, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-16', 'Antonio Cruz', '', 0, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-16T06:08:48', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-18', 'Familia Velasco Gómez', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-18', 'Familia Velasco Gómez', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-22T01:11:02', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-19', 'Fam Reyes Perez', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-19', 'Fam Reyes Perez', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-22T17:50:57', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-20', 'Jesus Reyes Perez', 2, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-20', 'Jesus Reyes Perez', '', 2, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-22T17:50:51', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-21', 'Fam Aguilar Perez', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-21', 'Fam Aguilar Perez', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-22T17:51:03', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-22', 'Fam Rivas Aguilar', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-22', 'Fam Rivas Aguilar', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-22T17:50:56', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-23', 'Fam Aguilar Rebollar', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-23', 'Fam Aguilar Rebollar', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-22T22:56:33', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-24', 'Isaac Perez Cheng', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-24', 'Isaac Perez Cheng', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-15T00:05:26', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-28', 'Rosy Ordoñez', 2, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-28', 'Rosy Ordoñez', '', 2, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T00:34:52', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-29', 'Magaly Rosado', 0, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-29', 'Magaly Rosado', '', 0, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T02:16:55', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-30', 'Familia Canales Santos', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-30', 'Familia Canales Santos', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T02:10:18', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-31', 'Roberto Canales', 0, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-31', 'Roberto Canales', '', 0, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T02:10:20', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-32', 'Ingrid Muñoz', 0, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-32', 'Ingrid Muñoz', '', 0, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-22T01:10:26', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-33', 'Familia Zapata García', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-33', 'Familia Zapata García', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T02:10:26', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-35', 'Genaro Perez', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-35', 'Genaro Perez', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-20T00:40:20', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-38', 'Fam Perez Ponce', 4, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-38', 'Fam Perez Ponce', '', 4, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-05-02T06:46:53', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-39', 'Carolina Uc', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-39', 'Carolina Uc', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T02:01:43', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-40', 'Familia Quen Rodríguez', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-40', 'Familia Quen Rodríguez', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T00:35:56', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-41', 'Cindy Osorio Ponce', 0, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-41', 'Cindy Osorio Ponce', '', 0, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T00:22:25', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-42', 'Familia Pérez Cheng', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-42', 'Familia Pérez Cheng', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T00:22:13', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-43', 'Familia González Canales', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-43', 'Familia González Canales', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T02:10:22', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-44', 'Familia Canales Naal', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-44', 'Familia Canales Naal', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T02:10:24', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-45', 'Familia Yanez Gomez', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-45', 'Familia Yanez Gomez', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T00:35:24', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-46', 'Familia Tuyub Martínez', 4, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-46', 'Familia Tuyub Martínez', '', 4, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T00:36:00', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-47', 'Familia Tuyub Wong', 4, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-47', 'Familia Tuyub Wong', '', 4, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T00:35:58', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-48', 'Bertha Ponce', 2, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-48', 'Bertha Ponce', '', 2, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T01:31:49', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-49', 'Familia Gayosso Martínez', 3, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-49', 'Familia Gayosso Martínez', '', 3, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-05-04T02:58:38', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-50', 'Fam Cheng Henestroza', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-50', 'Fam Cheng Henestroza', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T02:01:45', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-51', 'Fam Rojas Cheng', 2, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-51', 'Fam Rojas Cheng', '', 2, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T02:01:49', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-52', 'Rosa Mendez', 0, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-52', 'Rosa Mendez', '', 0, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T02:02:00', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-54', 'Ofelia Gonzales Riuz', 2, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-54', 'Ofelia Gonzales Riuz', '', 2, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T04:15:13', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-55', 'Fam Ramos Matu', 4, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-55', 'Fam Ramos Matu', '', 4, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-05-02T19:21:06', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-56', 'Genaro Perez Cheng', 2, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-56', 'Genaro Perez Cheng', '', 2, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T02:01:53', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-57', 'Mario Quijano Torres', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-57', 'Mario Quijano Torres', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T04:16:50', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-58', 'Arturo Perez Kantun', 0, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-58', 'Arturo Perez Kantun', '', 0, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T04:32:16', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-59', 'Isaías', 0, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-59', 'Isaías', '', 0, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T21:20:44', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-60', 'Jazmín Rico', 0, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-60', 'Jazmín Rico', '', 0, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-04-26T21:20:45', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-62', 'Fam Poot Escobedo', 4, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-62', 'Fam Poot Escobedo', '', 4, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-05-02T19:21:10', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

insert into public.guests (id, name, guests, "companionNames", "tableNumber", confirmed) values ('pre-64', 'Ademir Mendez', 1, '[]', 0, 1) on conflict (id) do update set name = excluded.name, guests = excluded.guests, "companionNames" = excluded."companionNames", "tableNumber" = excluded."tableNumber", confirmed = excluded.confirmed;
insert into public.confirmed (id, name, email, guests, dietary, message, songs, "confirmedAt", "tableNumber", "checkedIn", "checkedInAt") values ('pre-64', 'Ademir Mendez', '', 1, '', 'Importado desde pre-invitaciones confirmadas', '', '2026-05-08T00:51:22', 0, 0, '') on conflict (id) do update set name = excluded.name, guests = excluded.guests, message = excluded.message, "confirmedAt" = excluded."confirmedAt", "tableNumber" = excluded."tableNumber";

notify pgrst, 'reload schema';

commit;

-- Confirmados importados: 53
-- Total personas: 127
