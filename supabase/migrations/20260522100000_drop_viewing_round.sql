-- La vue historique du Scrum Master est désormais strictement locale (state
-- React, jamais persistée). La colonne rooms.viewing_round n'a plus de
-- consommateur applicatif — la conserver risque de réintroduire un canal de
-- broadcast involontaire. On la supprime.

alter table rooms drop column if exists viewing_round;
