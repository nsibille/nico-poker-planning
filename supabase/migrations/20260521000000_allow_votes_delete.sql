-- Sans cette policy, supabase.from('votes').delete() est refusé en silence par RLS
-- (Postgres : aucune policy pour DELETE => opération bloquée).
-- Impacts si manquante :
--  • dev qui annule son vote en recliquant la carte → la suppression échoue
--  • Scrum Master qui rouvre le vote d'un participant en phase 'revealed' →
--    le vote n'est pas supprimé, le dev ne voit jamais les cartes réapparaître

drop policy if exists "votes_delete" on votes;
create policy "votes_delete" on votes for delete using (true);
