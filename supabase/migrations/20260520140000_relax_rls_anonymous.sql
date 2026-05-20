-- Relax RLS: l'app utilise un user_id généré côté client (localStorage), pas de session Supabase Auth.
-- auth.uid() étant toujours null, on supprime les checks qui en dépendent.

drop policy if exists "players_insert" on players;
drop policy if exists "players_delete" on players;
create policy "players_insert" on players for insert with check (true);
create policy "players_delete" on players for delete using (true);

drop policy if exists "votes_select" on votes;
drop policy if exists "votes_insert" on votes;
drop policy if exists "votes_upsert" on votes;
create policy "votes_select" on votes for select using (true);
create policy "votes_insert" on votes for insert with check (true);
create policy "votes_upsert" on votes for update using (true);
