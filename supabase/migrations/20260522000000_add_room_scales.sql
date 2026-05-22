-- Multi-échelles d'estimation : on stocke l'id d'une échelle prédéfinie sur
-- chaque room, et le tableau de valeurs uniquement quand scale_id='custom'.
-- Les échelles prédéfinies vivent dans le code (1 source de vérité).
alter table rooms
  add column if not exists scale_id text not null default 'fibonacci',
  add column if not exists scale_values jsonb;

alter table rooms
  drop constraint if exists rooms_scale_values_check;
alter table rooms
  add constraint rooms_scale_values_check
  check (
    (scale_id <> 'custom') or
    (scale_values is not null
     and jsonb_typeof(scale_values) = 'array'
     and jsonb_array_length(scale_values) > 0)
  );
