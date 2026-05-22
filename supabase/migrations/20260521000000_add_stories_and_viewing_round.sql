-- Timeline + ré-ouverture de story par le Scrum Master.
--
-- 1. Table `stories` : snapshot du titre + mean + consensus de chaque round
--    révélé, indexée par (room_id, round). Sert à alimenter la timeline du SM.
-- 2. Colonne `rooms.viewing_round` : quand non-null, c'est le round que tous
--    les clients affichent (mode "consultation historique"). Le round "live"
--    reste `rooms.round` ; on superpose juste un affichage différent.

create table if not exists stories (
  room_id     text not null references rooms(id) on delete cascade,
  round       integer not null,
  title       text not null default '',
  final_mean  numeric,
  consensus   text check (consensus in ('perfect','aligned','discuss','divergent','empty')),
  revealed_at timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (room_id, round)
);

create index if not exists stories_room_id_idx on stories(room_id);

-- Trigger updated_at
drop trigger if exists stories_updated_at on stories;
create trigger stories_updated_at
  before update on stories
  for each row execute procedure update_updated_at();

-- RLS — même politique permissive que les autres tables (auth anonyme côté client)
alter table stories enable row level security;
drop policy if exists "stories_select" on stories;
drop policy if exists "stories_insert" on stories;
drop policy if exists "stories_update" on stories;
drop policy if exists "stories_delete" on stories;
create policy "stories_select" on stories for select using (true);
create policy "stories_insert" on stories for insert with check (true);
create policy "stories_update" on stories for update using (true);
create policy "stories_delete" on stories for delete using (true);

-- Diffusion temps réel
alter publication supabase_realtime add table stories;

-- Colonne viewing_round (mode historique)
alter table rooms add column if not exists viewing_round integer;
