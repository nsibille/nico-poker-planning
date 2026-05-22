-- Fin de session "video-game style" : un bouton SM "Terminer la session"
-- bascule la room dans un état figé qui déclenche, pour tous les clients,
-- l'affichage du recap final (stats équipe, awards, classement).
--
-- On stocke juste un timestamp ; si null = session en cours, si non-null =
-- terminée à cette heure-là. Pas de phase dédiée pour rester rétro-compat.

alter table rooms add column if not exists ended_at timestamptz;
