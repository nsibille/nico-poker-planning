-- Diffuser les changements en temps réel aux clients (rooms/players/votes).
-- Sans ça les hooks useRoom/usePlayers/useVotes ne voient jamais les updates.

alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table players;
alter publication supabase_realtime add table votes;
