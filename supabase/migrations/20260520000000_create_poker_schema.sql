-- Sprint Poker Planning — Schéma initial
-- Extensions
create extension if not exists "uuid-ossp";

-- Table rooms
create table if not exists rooms (
  id          text primary key,
  phase       text not null default 'waiting'
                check (phase in ('waiting','voting','revealed')),
  story       text not null default '',
  round       integer not null default 1,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Table players
create table if not exists players (
  id          uuid primary key default uuid_generate_v4(),
  room_id     text not null references rooms(id) on delete cascade,
  name        text not null,
  role        text not null check (role in ('developer','scrum-master')),
  user_id     uuid,
  joined_at   timestamptz not null default now(),
  unique (room_id, name)
);

-- Table votes
create table if not exists votes (
  id          uuid primary key default uuid_generate_v4(),
  room_id     text not null references rooms(id) on delete cascade,
  player_id   uuid not null references players(id) on delete cascade,
  round       integer not null,
  value       text not null,
  created_at  timestamptz not null default now(),
  unique (room_id, player_id, round)
);

-- Trigger updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists rooms_updated_at on rooms;
create trigger rooms_updated_at
  before update on rooms
  for each row execute procedure update_updated_at();

-- Indexes
create index if not exists players_room_id_idx on players(room_id);
create index if not exists votes_room_id_round_idx on votes(room_id, round);

-- RLS rooms
alter table rooms enable row level security;
drop policy if exists "rooms_select" on rooms;
drop policy if exists "rooms_insert" on rooms;
drop policy if exists "rooms_update" on rooms;
create policy "rooms_select" on rooms for select using (true);
create policy "rooms_insert" on rooms for insert with check (true);
create policy "rooms_update" on rooms for update using (true);

-- RLS players
alter table players enable row level security;
drop policy if exists "players_select" on players;
drop policy if exists "players_insert" on players;
drop policy if exists "players_delete" on players;
create policy "players_select" on players for select using (true);
create policy "players_insert" on players for insert with check (auth.uid() = user_id);
create policy "players_delete" on players for delete using (auth.uid() = user_id);

-- RLS votes
alter table votes enable row level security;
drop policy if exists "votes_select" on votes;
drop policy if exists "votes_insert" on votes;
drop policy if exists "votes_upsert" on votes;
create policy "votes_select" on votes for select
  using (
    exists (select 1 from rooms r where r.id = votes.room_id and r.phase = 'revealed')
    or auth.uid() = (select user_id from players p where p.id = votes.player_id)
  );
create policy "votes_insert" on votes for insert
  with check (auth.uid() = (select user_id from players p where p.id = votes.player_id));
create policy "votes_upsert" on votes for update
  using (auth.uid() = (select user_id from players p where p.id = votes.player_id));
