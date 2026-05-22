-- Permet de calculer le temps de réponse de chaque dev par round (award "La
-- Machine" du recap final). Le dernier changement de vote fait foi → on
-- s'appuie sur un updated_at touché à chaque UPDATE via le trigger partagé
-- update_updated_at déjà défini dans la migration initiale.

alter table votes add column if not exists updated_at timestamptz not null default now();

drop trigger if exists votes_updated_at on votes;
create trigger votes_updated_at
  before update on votes
  for each row execute procedure update_updated_at();
