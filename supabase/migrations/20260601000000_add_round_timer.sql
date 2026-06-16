-- Chrono de round : suivi du temps de vote pour le time keeping de l'équipe.
--
-- 1. `rooms.timer_started_at` : posé quand le Scrum Master lance le vote (ou
--    rouvre un round pour tout le monde). Chaque client calcule le temps écoulé
--    à partir de ce timestamp, pas de tick serveur. Remis à null au round
--    suivant (phase 'waiting').
-- 2. `stories.voting_seconds` : durée du vote figée au moment du reveal
--    (now - timer_started_at). Sert au suivi de perf dans la timeline et le
--    récap de session. Indicatif uniquement, n'impacte aucune mécanique.

alter table rooms
  add column if not exists timer_started_at timestamptz;

alter table stories
  add column if not exists voting_seconds numeric;
