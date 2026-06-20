-- Limpia confirmaciones que venian de pre-invitaciones.
-- Deja a todos como invitados pendientes hasta que confirmen en esta pagina.
begin;

delete from public.confirmed
where message = 'Importado desde pre-invitaciones confirmadas';

update public.guests
set confirmed = 0;

update public.guests g
set confirmed = 1
where exists (
  select 1
  from public.confirmed c
  where c.id = g.id
);

notify pgrst, 'reload schema';

commit;

select
  (select count(*) from public.guests) as invitados,
  (select count(*) from public.confirmed) as confirmaciones_reales,
  (select count(*) from public.guests where confirmed = 1) as invitados_marcados_confirmados;
