# Prompt Claude Code — Sprint Poker Planning (Supabase)

## Contexte

Tu vas construire une application web **Sprint Poker Planning** en temps réel.
Le projet utilise **Next.js 14 (App Router)**, **Supabase** (auth anonyme + Realtime + RLS) et **Tailwind CSS** avec un design system documenté dans `DESIGN_SYSTEM.md`.

---

## Direction artistique

L'application suit une charte graphique précise — **sobre, moderne, SaaS pro** — à respecter scrupuleusement :

- **Police** : `Neuwelt` (Bold / Medium / Regular / Light). Charger via `@font-face` si les fichiers sont disponibles, sinon fallback `'DM Sans', system-ui, sans-serif`. Ne jamais utiliser Inter ou Roboto.
- **Couleurs** : primaire `#4970ff` (bleu électrique), navy `#283050` (textes forts), fond page `#f5f6fa` (blanc légèrement bleuté), surfaces `#ffffff`.
- **Secondaires** : amber `#ffb450` (rôle dev), teal `#a8e0e5` (succès/voted), coral `#ff7f66` (danger/erreur), violet `#9485f2`, sky `#64c1fa`.
- **Boutons** : toujours `border-radius: 999px` (pill) pour les boutons principaux et secondaires.
- **Cards** : grands rayons (`16-20px`), ombre douce teintée bleue `0 2px 12px rgba(73,112,255,0.08)`.
- **Cartes de vote** : effet physique — ombre, `translateY(-6px)` au hover, chiffre en Neuwelt Bold.
- **Décoratif** : ajouter sur le lobby et le header des formes géométriques arrondies (`deco-blob`, `deco-circle`) en couleurs secondaires à faible opacité (~0.18), comme dans la charte.
- **Fond global** : `#f5f6fa`, jamais blanc pur comme fond de page.

## Règle design system — OBLIGATOIRE

> Avant de créer ou modifier n'importe quel élément d'interface :
> 1. Ouvre `DESIGN_SYSTEM.md` et consulte l'index des slugs.
> 2. Si un composant correspond → utilise son slug, implémente-le exactement selon sa spec CSS.
> 3. Si aucun slug ne correspond → crée le composant, attribue-lui un slug unique selon la convention `[domaine]-[type]-[variante]`, ajoute-le dans `DESIGN_SYSTEM.md` (section composant + index), puis implémente-le.
> Cette règle s'applique à chaque composant, chaque variante, chaque état.

---

## Connexion Supabase via MCP — PREMIÈRE ÉTAPE

Le MCP Supabase est configuré dans `.mcp.json` à la racine du projet.
**Avant toute chose**, effectue ces étapes dans l'ordre :

### Étape 0 — Vérifier la connexion MCP
```
Dis-moi quels projets Supabase sont accessibles via le MCP.
```
Si la connexion échoue, vérifie que `.mcp.json` est bien présent et que le PAT est valide.

### Étape 1 — Récupérer les credentials du projet
Utilise le MCP pour :
1. Lister les projets disponibles et identifier le bon `project_ref`
2. Récupérer l'URL et la clé `anon` du projet
3. Les écrire automatiquement dans `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=<url récupérée via MCP>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key récupérée via MCP>
```
> Ne jamais demander ces valeurs à l'utilisateur si le MCP peut les fournir.

### Étape 2 — Créer le schéma via MCP
Utilise l'outil `execute_sql` du MCP pour appliquer le schéma complet (voir section "Schéma de base de données" ci-dessous) directement sur le projet Supabase, **sans passer par le Dashboard**.

En parallèle, génère les fichiers de migration versionnés :
```bash
supabase migration new create_poker_schema
# → Écrire le SQL dans supabase/migrations/TIMESTAMP_create_poker_schema.sql
```

### Étape 3 — Vérifier les RLS
Après création des tables, utilise le MCP pour vérifier que les politiques RLS sont bien en place :
```
"Vérifie que les tables rooms, players et votes ont bien les RLS activées et liste toutes les politiques."
```
Utilise aussi `get_advisors` pour détecter d'éventuels problèmes de sécurité.

### Étape 4 — Générer les types TypeScript
Utilise le MCP pour générer les types TypeScript depuis le schéma réel :
```
"Génère les types TypeScript pour le schéma actuel et écris-les dans src/types/database.types.ts"
```

### Configuration `.mcp.json` (référence)
```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp",
      "headers": {
        "Authorization": "Bearer TON_PAT_ICI"
      }
    }
  }
}
```
> ⚠️ `.mcp.json` doit être dans `.gitignore` — le PAT est un secret.
> Pour restreindre à un seul projet : `"url": "https://mcp.supabase.com/mcp?project_ref=TON_PROJECT_REF"`

---

## Stack technique

```
Framework  : Next.js 14 — App Router, TypeScript strict
Backend    : Supabase
  - Auth   : anonyme (signInAnonymously) — pas de compte requis
  - DB     : PostgreSQL via Supabase client
  - RT     : Supabase Realtime (subscriptions sur les tables rooms, players, votes)
  - RLS    : Row Level Security activée sur toutes les tables
Styles     : Tailwind CSS + CSS custom properties (tokens du design system)
State      : Zustand (store global) + React Query (server state)
Tests      : Vitest + Testing Library (composants critiques)
```

---

## Schéma de base de données

> Ce SQL est à appliquer via le MCP (`execute_sql`) ET à versionner dans `supabase/migrations/`.

```sql
-- Activer l'extension uuid
create extension if not exists "uuid-ossp";

-- Table rooms
create table rooms (
  id          text primary key,                        -- ex: "alpha-421"
  phase       text not null default 'waiting'          -- 'waiting' | 'voting' | 'revealed'
                check (phase in ('waiting','voting','revealed')),
  story       text not null default '',
  round       integer not null default 1,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Table players
create table players (
  id          uuid primary key default uuid_generate_v4(),
  room_id     text not null references rooms(id) on delete cascade,
  name        text not null,
  role        text not null check (role in ('developer','scrum-master')),
  user_id     uuid,                                    -- Supabase auth.uid() anonyme
  joined_at   timestamptz not null default now(),
  unique (room_id, name)
);

-- Table votes
create table votes (
  id          uuid primary key default uuid_generate_v4(),
  room_id     text not null references rooms(id) on delete cascade,
  player_id   uuid not null references players(id) on delete cascade,
  round       integer not null,
  value       text not null,                           -- '1','2','3','5','8','13','21','?'
  created_at  timestamptz not null default now(),
  unique (room_id, player_id, round)
);

-- Trigger updated_at sur rooms
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger rooms_updated_at
  before update on rooms
  for each row execute procedure update_updated_at();

-- Indexes
create index on players(room_id);
create index on votes(room_id, round);
```

### Politiques RLS

```sql
-- Rooms : lecture publique, création et mise à jour par n'importe qui (session anon)
alter table rooms enable row level security;
create policy "rooms_select" on rooms for select using (true);
create policy "rooms_insert" on rooms for insert with check (true);
create policy "rooms_update" on rooms for update using (true);

-- Players : lecture publique, insertion/suppression par son propre user_id
alter table players enable row level security;
create policy "players_select" on players for select using (true);
create policy "players_insert" on players for insert with check (auth.uid() = user_id);
create policy "players_delete" on players for delete using (auth.uid() = user_id);

-- Votes : lecture uniquement après reveal (room.phase='revealed'), insertion par son propre user
alter table votes enable row level security;
create policy "votes_select" on votes for select
  using (
    exists (
      select 1 from rooms r where r.id = votes.room_id and r.phase = 'revealed'
    )
    or auth.uid() = (select user_id from players p where p.id = votes.player_id)
  );
create policy "votes_insert" on votes for insert
  with check (auth.uid() = (select user_id from players p where p.id = votes.player_id));
create policy "votes_upsert" on votes for update
  using (auth.uid() = (select user_id from players p where p.id = votes.player_id));
```

---

## Architecture fichiers

```
.mcp.json                           # Config MCP Supabase — dans .gitignore
.env.local                          # Rempli automatiquement par le MCP
supabase/
└── migrations/
    └── TIMESTAMP_create_poker_schema.sql  # Migration versionnée

src/
├── app/
│   ├── layout.tsx                  # RootLayout + providers
│   ├── page.tsx                    # Lobby (connexion sans compte)
│   └── room/
│       └── [roomId]/
│           └── page.tsx            # Salle de jeu
│
├── components/
│   ├── lobby/
│   │   ├── LobbyForm.tsx           # Formulaire connexion
│   │   └── RoleSelector.tsx        # Sélection développeur / SM
│   ├── room/
│   │   ├── RoomHeader.tsx          # nav-room-header
│   │   ├── PlayersList.tsx         # Panel participants
│   │   ├── PlayerRow.tsx           # card-player-row
│   │   ├── StoryPanel.tsx          # Zone story (input SM / display tous)
│   │   ├── VoteGrid.tsx            # Grille cartes Fibonacci
│   │   ├── VoteCard.tsx            # vote-card-* (default|selected|disabled|revealed)
│   │   ├── StatusBar.tsx           # Phase + actions SM + mean-display
│   │   └── MeanDisplay.tsx         # mean-display
│   └── ui/
│       ├── Button.tsx              # btn-primary-md | btn-secondary-md | btn-ghost-sm | btn-danger-md | btn-reveal-lg
│       ├── Input.tsx               # input-text-md | input-textarea-md
│       ├── Badge.tsx               # Tous les badge-*
│       ├── Avatar.tsx              # avatar-sm | avatar-dev
│       ├── Spinner.tsx             # spinner-sm
│       └── Toast.tsx               # toast-success | toast-error
│
├── hooks/
│   ├── useRoom.ts                  # Subscribe Realtime room
│   ├── usePlayers.ts               # Subscribe Realtime players
│   ├── useVotes.ts                 # Subscribe Realtime votes
│   └── useSession.ts              # Auth anonyme Supabase
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # createBrowserClient
│   │   └── server.ts               # createServerClient (SSR)
│   ├── game/
│   │   ├── constants.ts            # FIBONACCI, MAX_DEV, MAX_SM
│   │   ├── utils.ts                # calcMean, generateRoomId, getInitials
│   │   └── validations.ts          # Zod schemas
│   └── design-system/
│       └── tokens.ts               # Export des tokens CSS en TS (pour Tailwind)
│
├── store/
│   └── gameStore.ts               # Zustand : myName, myRole, myPlayerId, selectedVote
│
└── types/
    ├── index.ts                   # Room, Player, Vote, Phase, Role (types métier)
    └── database.types.ts          # Généré automatiquement par le MCP Supabase
```

---

## Fonctionnalités à implémenter

### 1. Authentification anonyme
- Au chargement de l'app, appeler `supabase.auth.signInAnonymously()` si pas de session
- Stocker le `user_id` (auth.uid()) pour les RLS
- Pas d'email, pas de mot de passe, pas de compte

### 2. Lobby (page `/`)

**Éléments UI (slugs à utiliser) :**
- Logo + titre : texte libre
- Champ nom → `input-text-md`
- Sélection rôle → deux boutons toggle (réutiliser `btn-secondary-md` avec état actif)
- Champ Room ID + bouton générer → `input-text-md` + `btn-secondary-md`
- Bouton rejoindre → `btn-primary-md`
- Erreurs → `toast-error`

**Logique :**
```
1. Vérifier que name, role et roomId sont remplis
2. Vérifier les limites : MAX_DEV = 6, MAX_SM = 3
   → Requête count sur players par room_id + role
3. Créer la room si elle n'existe pas (upsert)
4. Insérer le player avec user_id = auth.uid()
5. Stocker name, role, playerId dans le store Zustand
6. Redirect vers /room/[roomId]
```

### 3. Salle de jeu (page `/room/[roomId]`)

**Temps réel — s'abonner à 3 canaux Supabase Realtime :**
```ts
supabase.channel('room-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` }, handler)
  .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` }, handler)
  .on('postgres_changes', { event: '*', schema: 'public', table: 'votes', filter: `room_id=eq.${roomId}` }, handler)
  .subscribe()
```

**Panel joueurs — `nav-room-header` + liste `card-player-row` :**
- Afficher tous les joueurs avec `avatar-sm` (SM) ou `avatar-dev` (dev)
- Afficher `badge-role-sm` / `badge-role-dev`
- Pour chaque développeur : `status-voted` si vote enregistré, `status-waiting` sinon
- Si phase = 'revealed' : afficher `vote-card-revealed` avec la valeur

**Zone story :**
- Si Scrum Master et phase ≠ 'revealed' : afficher `input-textarea-md` + `btn-secondary-md` "Définir la story"
- Sinon : afficher `story-display`

**Grille de vote (développeurs uniquement, phase = 'voting') :**
- Fibonacci : `[1, 2, 3, 5, 8, 13, 21, '?']`
- Carte non sélectionnée → `vote-card-default`
- Carte sélectionnée → `vote-card-selected`
- Si SM ou phase ≠ 'voting' ou déjà revealed → `vote-card-disabled`
- Au clic : upsert dans `votes` (room_id, player_id, round, value)

**Barre de statut :**
- Badge de phase : `badge-phase-waiting` | `badge-phase-voting` | `badge-phase-revealed`
- Si Scrum Master :
  - Phase 'voting' : `btn-reveal-lg` (disabled si tous les devs n'ont pas voté)
  - Phase 'revealed' : `btn-primary-md` "Prochain round"
- Si phase = 'revealed' : afficher `mean-display` avec la moyenne à 1 décimale

**Actions Scrum Master :**
```
Révéler :
  → update rooms set phase='revealed' where id=roomId

Prochain round :
  → update rooms set phase='voting', story='', round=round+1 where id=roomId
  (les votes de l'ancien round restent en DB pour historique)
```

### 4. Calcul de la moyenne
```ts
// Dans lib/game/utils.ts
export function calcMean(votes: Vote[]): string | null {
  const nums = votes
    .map(v => v.value)
    .filter(v => v !== '?')
    .map(Number)
    .filter(n => !isNaN(n));
  if (!nums.length) return null;
  return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
}
```

### 5. Déconnexion / nettoyage
- Quand le joueur quitte (bouton ou `beforeunload`) : `delete from players where id = playerId`
- Unsubscribe des canaux Realtime dans le cleanup du useEffect

---

## Gestion des erreurs et edge cases

| Situation | Comportement |
|---|---|
| Room pleine (6 devs ou 3 SM) | `toast-error` "Room complète pour ce rôle" |
| Nom déjà pris dans la room | `toast-error` "Ce prénom est déjà utilisé" |
| Perte de connexion Realtime | Afficher un badge "Reconnexion…" dans le header |
| Vote soumis puis connexion perdue | Le vote persiste en DB |
| SM révèle sans votes | Bouton disabled — impossible |
| Room inexistante | Redirect vers `/` avec `toast-error` |
| MCP non joignable au démarrage | Afficher les instructions de config dans le terminal |

---

## Variables d'environnement

```env
# .env.local — rempli automatiquement par le MCP à l'étape 1
# Ne pas éditer manuellement si le MCP est disponible
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Commandes de démarrage

```bash
# 1. Init projet
npx create-next-app@latest sprint-poker --typescript --tailwind --app
cd sprint-poker

# 2. Dépendances
npm install @supabase/supabase-js @supabase/ssr zustand @tanstack/react-query zod

# 3. CLI Supabase (pour les migrations versionnées)
npm install -g supabase
supabase init
supabase login
supabase link --project-ref TON_PROJECT_REF

# 4. Lancer le dev
npm run dev
```

---

## Ordre d'implémentation recommandé

```
0.  Vérifier la connexion MCP Supabase
1.  Récupérer URL + anon key via MCP → écrire .env.local
2.  Appliquer le schéma SQL via MCP (execute_sql)
3.  Versionner le schéma dans supabase/migrations/
4.  Vérifier les RLS via MCP (get_advisors)
5.  Générer database.types.ts via MCP
6.  Init projet Next.js + Tailwind
7.  lib/supabase/client.ts + server.ts
8.  types/index.ts (types métier, s'appuie sur database.types.ts)
9.  lib/game/constants.ts + utils.ts
10. store/gameStore.ts
11. hooks/useSession.ts (auth anonyme)
12. Composants UI (Button, Input, Badge, Avatar, Toast, Spinner)
    → Vérifier DESIGN_SYSTEM.md avant chaque composant
13. LobbyForm + RoleSelector → page `/`
14. hooks/useRoom.ts + usePlayers.ts + useVotes.ts
15. Composants room (RoomHeader, PlayersList, StoryPanel, VoteGrid, StatusBar)
16. page `/room/[roomId]`
17. Tests Vitest sur calcMean + validations
18. Déploiement Vercel
```

---

## Checklist finale

**Supabase / MCP**
- [ ] `.mcp.json` configuré et dans `.gitignore`
- [ ] `.env.local` rempli via MCP (pas saisi manuellement)
- [ ] Tables créées via MCP + migration versionnée dans `supabase/migrations/`
- [ ] RLS vérifiée via MCP sur les 3 tables
- [ ] `database.types.ts` généré via MCP
- [ ] Auth anonyme activée dans le Dashboard Supabase (Authentication > Providers > Anonymous)

**Fonctionnel**
- [ ] Auth anonyme fonctionne (pas de compte nécessaire)
- [ ] Limites respectées : 6 devs max, 3 SM max
- [ ] Vote anonyme pendant la phase 'voting' (les autres voient ✓ pas la valeur)
- [ ] Reveal uniquement par un SM quand tous les devs ont voté
- [ ] Moyenne calculée à 1 décimale, '?' exclus
- [ ] Realtime synchronisé sur 3 tables
- [ ] Nettoyage joueur au départ

**Design system**
- [ ] DESIGN_SYSTEM.md consulté avant chaque composant
- [ ] Slugs existants réutilisés sans modification
- [ ] Nouveaux composants ajoutés dans DESIGN_SYSTEM.md (section + index)
- [ ] Pas de secrets côté client (seulement NEXT_PUBLIC_*)
