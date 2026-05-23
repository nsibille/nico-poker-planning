# Design System, Scrumbler (ex Sprint Poker Planning)
> Version 2.1, alignée sur `BRAND.md` v1.0.0 (identité visuelle Scrumbler).
> **Règle absolue :** avant de créer un composant, consulter ce fichier.
> Si le composant existe → réutiliser son slug. S'il n'existe pas → le créer ici avec un slug unique, puis l'implémenter.
> **Règle voix** : pas d'em dash (U+2014). Voir `CLAUDE.md` Règles non négociables.
> **Règle logo** : utiliser le composant `Lockup` (`src/components/marketing/Lockup.tsx`) qui pioche dans les variantes officielles de `public/brand/logo/` (BRAND §1.1).

---

## Direction artistique

**Ambiance** : SaaS moderne et professionnel — fond blanc cassé très doux, typographie géométrique forte, accents bleu électrique vif, touches de couleur secondaire pour les rôles et états. Propre, aéré, efficace.

**Typographie** : Police **Neuwelt** (Bold pour les titres et chiffres des cartes, Medium pour les labels UI, Regular pour le corps, Light pour les textes secondaires). Géométrique, précise, forte personnalité sans être agressive. À charger via `@font-face` ou CDN si disponible, sinon fallback `'DM Sans', system-ui, sans-serif`.

**Éléments décoratifs** : Formes géométriques arrondies (blobs, cercles évidés, rectangles à grands rayons) en couleurs secondaires à faible opacité, utilisées comme accents de fond sur les pages lobby et header. Jamais en avant-plan.

**Card pattern (BRAND §5.1)** : silhouettes de cartes inclinées à -8°, opacité 6-16%, **uniquement sur surfaces sombres** (brand-dark, gradients brand-primary, hero/CTA marketing, header app). Slug : `bg-card-pattern` (+ modifiers `--soft` / `--bold`).

**Rayons** : généreux, les boutons principaux sont `border-radius: 999px` (pill), les cards ont `16-20px`, les hero cards `28px` (`--radius-2xl`).

---

## Conventions de nommage des slugs

```
[domaine]-[type]-[variante]

Domaines   : btn, input, badge, avatar, card, layout, nav, modal, table, status, vote, player, room, deco
Types      : primary, secondary, ghost, icon, text
Variantes  : sm, md, lg | success, warning, danger, info, neutral
```

---

## Tokens de base

### Couleurs
```css
/* ── Primaires (de la charte) ── */
--color-brand-primary:      #4970ff;   /* Bleu électrique — CTA, liens, accents forts */
--color-brand-primary-50:   #eef1ff;   /* Très light — backgrounds hover/selected */
--color-brand-primary-100:  #dce3ff;   /* Light — badges, chips */
--color-brand-primary-600:  #3358e0;   /* Hover state du primaire */
--color-brand-dark:         #283050;   /* Navy — textes forts, header background option */

/* ── Fond & neutres ── */
--color-bg-page:            #f5f6fa;   /* Fond global — très légèrement bleuté */
--color-bg-surface:         #ffffff;   /* Cartes, panels */
--color-bg-subtle:          #fafafa;   /* Zones secondaires */
--color-border:             #e8eaf0;   /* Bordures légères */
--color-border-strong:      #d0d4e0;   /* Bordures hover / focus */

--color-text-primary:       #283050;   /* Navy — titres, labels */
--color-text-secondary:     #6b7299;   /* Gris-bleu — textes secondaires */
--color-text-muted:         #a0a8c0;   /* Hints, placeholders */

/* ── Rôles joueurs ── */
--color-role-sm:            #4970ff;   /* Scrum Master — bleu primaire */
--color-role-sm-light:      #eef1ff;
--color-role-sm-dark:       #283050;
--color-role-dev:           #ffb450;   /* Développeur — amber charte */
--color-role-dev-light:     #fff8ed;
--color-role-dev-dark:      #8a5a00;

/* ── Secondaires (palette charte) ── */
--color-amber:              #ffb450;   /* Amber 100% */
--color-amber-50:           #fff8ed;
--color-amber-200:          #ffe4c0;
--color-coral:              #ff7f66;   /* Coral/Red 100% */
--color-coral-50:           #ffe5e0;
--color-coral-200:          #ffbeb2;
--color-teal:               #a8e0e5;   /* Teal 100% */
--color-teal-50:            #dcf3f5;
--color-teal-600:           #3fb8c4;
--color-sky:                #64c1fa;   /* Bleu ciel 100% */
--color-sky-50:             #e0f3fe;
--color-indigo:             #6691ff;   /* Indigo 100% */
--color-indigo-50:          #e0e9ff;
--color-violet:             #9485f2;   /* Violet 100% */
--color-violet-50:          #eae7fc;

/* ── Feedback sémantique ── */
--color-success:            #3fb8c4;   /* Teal — validation, vote effectué */
--color-success-light:      #dcf3f5;
--color-success-dark:       #1e7a82;
--color-warning:            #ffb450;   /* Amber — attention, en cours */
--color-warning-light:      #fff8ed;
--color-warning-dark:       #8a5a00;
--color-danger:             #ff7f66;   /* Coral — erreur */
--color-danger-light:       #ffe5e0;
--color-danger-dark:        #b33a24;
--color-info:               #4970ff;   /* Bleu primaire — info */
--color-info-light:         #eef1ff;
```

### Typographie
```css
/* Chargement Neuwelt */
/* Option 1 — @font-face local si fichiers disponibles */
/* Option 2 — fallback propre si non disponible */
--font-primary:  'Neuwelt', 'DM Sans', 'Inter', system-ui, sans-serif;
--font-mono:     'JetBrains Mono', 'Fira Code', monospace;

/* Tailles */
--text-xs:    11px;
--text-sm:    13px;
--text-base:  14px;
--text-md:    15px;
--text-lg:    18px;
--text-xl:    24px;
--text-2xl:   32px;
--text-3xl:   48px;   /* Pour les chiffres des cartes de vote */

/* Graisses — Neuwelt */
--fw-light:   300;   /* Neuwelt Light — textes secondaires longs */
--fw-normal:  400;   /* Neuwelt Regular — body */
--fw-medium:  500;   /* Neuwelt Medium — labels UI */
--fw-bold:    700;   /* Neuwelt Bold — titres, chiffres cartes */
```

### Espacements & Rayons
```css
--radius-sm:   6px;
--radius-md:   10px;
--radius-lg:   16px;
--radius-xl:   20px;
--radius-2xl:  28px;
--radius-full: 9999px;   /* Pills — boutons principaux */

--space-1:  4px;   --space-2:  8px;   --space-3:  12px;
--space-4:  16px;  --space-5:  20px;  --space-6:  24px;
--space-8:  32px;  --space-10: 40px;  --space-12: 48px;
--space-16: 64px;
```

### Ombres
```css
--shadow-xs:  0 1px 2px rgba(40,48,80,0.06);
--shadow-sm:  0 2px 8px rgba(40,48,80,0.08);
--shadow-md:  0 4px 16px rgba(40,48,80,0.10);
--shadow-lg:  0 8px 32px rgba(40,48,80,0.12);
--shadow-card: 0 2px 12px rgba(73,112,255,0.08);  /* Ombre teintée bleu pour les cards actives */
```

---

## Composants

---

### `btn-primary-md`
**Bouton principal — pill, taille standard**
- Usage : action principale (rejoindre, voter, révéler)
- Style signature : pill `border-radius: 999px`, bleu `#4970ff`, Neuwelt Medium

```css
.btn-primary-md {
  background: var(--color-brand-primary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  padding: 11px 24px;
  font-family: var(--font-primary);
  font-size: var(--text-md);
  font-weight: var(--fw-medium);
  cursor: pointer;
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
  box-shadow: 0 4px 14px rgba(73,112,255,0.30);
}
.btn-primary-md:hover   { background: var(--color-brand-primary-600); box-shadow: 0 6px 20px rgba(73,112,255,0.38); }
.btn-primary-md:active  { transform: scale(0.97); }
.btn-primary-md:disabled{ opacity: 0.4; cursor: default; box-shadow: none; }
```

---

### `btn-secondary-md`
**Bouton secondaire — pill outline**
- Usage : actions secondaires (générer ID, définir story)

```css
.btn-secondary-md {
  background: transparent;
  color: var(--color-brand-primary);
  border: 1.5px solid var(--color-brand-primary);
  border-radius: var(--radius-full);
  padding: 10px 22px;
  font-family: var(--font-primary);
  font-size: var(--text-md);
  font-weight: var(--fw-medium);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.btn-secondary-md:hover { background: var(--color-brand-primary-50); }
.btn-secondary-md:disabled { opacity: 0.4; cursor: default; }
```

---

### `btn-ghost-sm`
**Bouton ghost — petite taille**
- Usage : actions discrètes (quitter, icône seule)

```css
.btn-ghost-sm {
  background: none;
  border: none;
  border-radius: var(--radius-md);
  padding: 6px 12px;
  font-size: var(--text-sm);
  font-family: var(--font-primary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}
.btn-ghost-sm:hover { background: var(--color-bg-page); color: var(--color-text-primary); }
```

---

### `btn-danger-md`
**Bouton danger — pill**
- Usage : actions destructives

```css
.btn-danger-md {
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  padding: 11px 24px;
  font-family: var(--font-primary);
  font-size: var(--text-md);
  font-weight: var(--fw-medium);
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-danger-md:hover { opacity: 0.88; }
```

---

### `btn-reveal-lg`
**Bouton Révéler — grande taille, Scrum Master**
- Style : pill, bleu primaire avec ombre portée bleue, taille généreuse

```css
.btn-reveal-lg {
  background: var(--color-brand-primary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  padding: 13px 32px;
  font-family: var(--font-primary);
  font-size: var(--text-lg);
  font-weight: var(--fw-bold);
  cursor: pointer;
  letter-spacing: -0.01em;
  box-shadow: 0 6px 20px rgba(73,112,255,0.35);
  transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
}
.btn-reveal-lg:hover:not(:disabled) { background: var(--color-brand-primary-600); box-shadow: 0 8px 28px rgba(73,112,255,0.44); }
.btn-reveal-lg:active { transform: scale(0.97); }
.btn-reveal-lg:disabled { opacity: 0.38; cursor: default; box-shadow: none; }
```

---

### `input-text-md`
**Champ texte — taille standard**
- Fond blanc, bordure douce, focus anneau bleu

```css
.input-text-md {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-family: var(--font-primary);
  font-size: var(--text-md);
  font-weight: var(--fw-normal);
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input-text-md::placeholder { color: var(--color-text-muted); }
.input-text-md:focus {
  outline: none;
  border-color: var(--color-brand-primary);
  box-shadow: 0 0 0 3px var(--color-brand-primary-50);
}
```

---

### `input-textarea-md`
**Textarea — taille standard**
- Usage : saisie user story par le SM

```css
.input-textarea-md {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--fw-normal);
  resize: vertical;
  min-height: 80px;
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  line-height: 1.6;
}
.input-textarea-md:focus {
  outline: none;
  border-color: var(--color-brand-primary);
  box-shadow: 0 0 0 3px var(--color-brand-primary-50);
}
```

---

### `badge-role-sm`
**Badge rôle Scrum Master**

```css
.badge-role-sm {
  display: inline-flex; align-items: center; gap: 5px;
  background: var(--color-role-sm-light);
  color: var(--color-role-sm);
  border-radius: var(--radius-full);
  padding: 3px 10px;
  font-family: var(--font-primary);
  font-size: var(--text-xs);
  font-weight: var(--fw-medium);
}
```

---

### `badge-role-dev`
**Badge rôle Développeur**

```css
.badge-role-dev {
  display: inline-flex; align-items: center; gap: 5px;
  background: var(--color-role-dev-light);
  color: var(--color-role-dev-dark);
  border-radius: var(--radius-full);
  padding: 3px 10px;
  font-family: var(--font-primary);
  font-size: var(--text-xs);
  font-weight: var(--fw-medium);
}
```

---

### `badge-room-id`
**Badge identifiant de room**

```css
.badge-room-id {
  background: var(--color-bg-page);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: 3px 10px;
  font-size: var(--text-xs);
  font-weight: var(--fw-medium);
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
}
```

---

### `badge-round`
**Badge numéro de round**

```css
.badge-round {
  background: var(--color-indigo-50);
  color: var(--color-indigo);
  border-radius: var(--radius-full);
  padding: 3px 10px;
  font-size: var(--text-xs);
  font-family: var(--font-primary);
  font-weight: var(--fw-medium);
}
```

---

### `badge-phase-voting`
**Badge phase — vote en cours**

```css
.badge-phase-voting {
  background: var(--color-warning-light);
  color: var(--color-warning-dark);
  border-radius: var(--radius-full);
  padding: 4px 14px;
  font-size: var(--text-sm);
  font-family: var(--font-primary);
  font-weight: var(--fw-medium);
}
```

---

### `badge-phase-revealed`
**Badge phase — votes révélés**

```css
.badge-phase-revealed {
  background: var(--color-success-light);
  color: var(--color-success-dark);
  border-radius: var(--radius-full);
  padding: 4px 14px;
  font-size: var(--text-sm);
  font-family: var(--font-primary);
  font-weight: var(--fw-medium);
}
```

---

### `badge-phase-waiting`
**Badge phase — en attente**

```css
.badge-phase-waiting {
  background: var(--color-bg-page);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: 4px 14px;
  font-size: var(--text-sm);
  font-family: var(--font-primary);
  font-weight: var(--fw-medium);
}
```

---

### `avatar-sm`
**Avatar rôle Scrum Master**

```css
.avatar-sm {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--color-role-sm-light);
  color: var(--color-role-sm);
  font-size: var(--text-sm);
  font-family: var(--font-primary);
  font-weight: var(--fw-bold);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
```

---

### `avatar-dev`
**Avatar rôle Développeur**

```css
.avatar-dev {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--color-role-dev-light);
  color: var(--color-role-dev-dark);
  font-size: var(--text-sm);
  font-family: var(--font-primary);
  font-weight: var(--fw-bold);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
```

---

### `card-surface`
**Card de surface — conteneur générique**
- Fond blanc, ombre douce teintée bleu, grands rayons

```css
.card-surface {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-card);
}
```

---

### `card-player-row`
**Ligne joueur dans le panel participants**

```css
.card-player-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
}
.card-player-row:last-child { border: none; }
.card-player-row .player-name {
  flex: 1;
  font-size: var(--text-base);
  font-family: var(--font-primary);
  font-weight: var(--fw-medium);
  color: var(--color-text-primary);
}
```

---

### `vote-card-default`
**Carte de vote Fibonacci — état par défaut**
- Style signature : carte physique avec ombre, Neuwelt Bold pour le chiffre, grand rayon

```css
.vote-card-default {
  width: 60px; height: 84px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--text-2xl);
  font-family: var(--font-primary);
  font-weight: var(--fw-bold);
  color: var(--color-text-primary);
  cursor: pointer;
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-sm);
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s, color 0.15s;
  user-select: none;
}
.vote-card-default:hover {
  border-color: var(--color-brand-primary);
  color: var(--color-brand-primary);
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(73,112,255,0.20);
}
```

---

### `vote-card-selected`
**Carte de vote Fibonacci — état sélectionné**

```css
.vote-card-selected {
  /* étend vote-card-default */
  border: 2px solid var(--color-brand-primary);
  background: var(--color-brand-primary);
  color: white;
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(73,112,255,0.35);
}
```

---

### `vote-card-disabled`
**Carte de vote Fibonacci — état désactivé**

```css
.vote-card-disabled {
  /* étend vote-card-default */
  opacity: 0.35;
  cursor: default;
  pointer-events: none;
  box-shadow: none;
}
```

---

### `vote-card-revealed`
**Valeur de vote révélée dans la liste joueur**

```css
.vote-card-revealed {
  min-width: 36px; height: 36px;
  padding: 0 8px;
  border-radius: var(--radius-md);
  background: var(--color-brand-primary);
  color: white;
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--fw-bold);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(73,112,255,0.25);
}
```

---

### `status-voted`
**Indicateur vote effectué**

```css
.status-voted {
  width: 28px; height: 28px;
  border-radius: var(--radius-md);
  background: var(--color-success-light);
  color: var(--color-success);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px;
}
```

---

### `status-waiting`
**Indicateur en attente de vote**

```css
.status-waiting {
  width: 28px; height: 28px;
  border-radius: var(--radius-md);
  background: var(--color-bg-page);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
}
```

---

### `mean-display`
**Affichage de la moyenne des votes**
- Chiffre en Neuwelt Bold très grand, fond bleu primaire léger

```css
.mean-display {
  text-align: center;
  padding: var(--space-4) var(--space-6);
  background: var(--color-brand-primary-50);
  border: 2px solid var(--color-brand-primary-100);
  border-radius: var(--radius-xl);
}
.mean-display .mean-value {
  font-size: var(--text-3xl);
  font-family: var(--font-primary);
  font-weight: var(--fw-bold);
  color: var(--color-brand-primary);
  line-height: 1;
}
.mean-display .mean-label {
  font-size: var(--text-xs);
  font-family: var(--font-primary);
  font-weight: var(--fw-medium);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

---

### `story-display`
**Affichage de la user story en lecture seule**

```css
.story-display {
  background: var(--color-bg-page);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 12px 16px;
  font-family: var(--font-primary);
  font-size: var(--text-md);
  font-weight: var(--fw-normal);
  line-height: 1.6;
  color: var(--color-text-primary);
  min-height: 52px;
}
```

---

### `layout-lobby`
**Layout page de connexion**
- Fond `--color-bg-page`, centré, max-width 460px

```css
.layout-lobby {
  min-height: 100vh;
  background: var(--color-bg-page);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
}
.layout-lobby-inner {
  width: 100%;
  max-width: 460px;
}
```

---

### `layout-room`
**Layout salle de jeu — 2 colonnes**

```css
.layout-room {
  min-height: 100vh;
  background: var(--color-bg-page);
  padding: var(--space-4) var(--space-6);
}
.layout-room-grid {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: var(--space-5);
  max-width: 1100px;
  margin: 0 auto;
}
@media (max-width: 700px) {
  .layout-room-grid { grid-template-columns: 1fr; }
}
```

---

### `nav-room-header`
**Header de la salle de jeu**

```css
.nav-room-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-xs);
  flex-wrap: wrap;
}
.nav-room-header h2 {
  font-size: var(--text-lg);
  font-family: var(--font-primary);
  font-weight: var(--fw-bold);
  color: var(--color-brand-dark);
  flex: 1;
}
```

---

### `deco-blob`
**Forme décorative — blob arrondi**
- Usage : accents de fond sur lobby et header (non interactifs)
- Couleurs : utiliser les secondaires à 15-25% d'opacité

```css
.deco-blob {
  position: absolute;
  border-radius: 60% 40% 50% 50% / 50% 60% 40% 50%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.18;
}
/* Variantes couleur — ajouter en inline style ou classe utilitaire */
/* --color-teal, --color-amber, --color-violet selon placement */
```

---

### `deco-circle`
**Forme décorative — cercle évidé (donut)**
- Usage : accent visuel lobby, identitaire de la charte

```css
.deco-circle {
  position: absolute;
  border-radius: 50%;
  border: 10px solid currentColor;
  pointer-events: none;
  z-index: 0;
  opacity: 0.20;
}
```

---

### `spinner-sm`
**Spinner de chargement — petite taille**

```css
.spinner-sm {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

---

### `toast-success`
**Notification succès**

```css
.toast-success {
  background: var(--color-success-light);
  color: var(--color-success-dark);
  border: 1px solid var(--color-teal);
  border-radius: var(--radius-lg);
  padding: 10px 16px;
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--fw-medium);
  box-shadow: var(--shadow-sm);
}
```

---

### `toast-error`
**Notification erreur**

```css
.toast-error {
  background: var(--color-danger-light);
  color: var(--color-danger-dark);
  border: 1px solid var(--color-coral);
  border-radius: var(--radius-lg);
  padding: 10px 16px;
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--fw-medium);
  box-shadow: var(--shadow-sm);
}
```

### `story-timeline`
**Rail historique des stories (SM uniquement, colonne de droite)**
- Position : sticky en haut, hauteur max viewport, scroll interne
- Liste verticale d'items, un par round révélé + un virtuel pour le round live non révélé
- Chaque item : rang `#N`, dot coloré (consensus), pill `live` ou `en cours`, titre tronqué 2 lignes, moyenne, label consensus
- Couleur du dot et de l'item actif teintée par le consensus (`perfect`/`aligned`/`discuss`/`divergent`/`empty`)
- Au clic : ouvre le scoreboard de ce round pour tout le monde (mode historique)

```css
.story-timeline { position: sticky; top: var(--space-4); background: var(--color-bg-surface); border-radius: var(--radius-xl); padding: var(--space-5); box-shadow: var(--shadow-card); }
/* Voir globals.css pour les sous-composants : __header, __list, __item, __dot, __mean, __consensus, __live-pill, __active-hint */
```

---

### `story-timeline__item`
**Item cliquable de la timeline**
- État par défaut : bordure neutre, dot teinté `--timeline-tint`
- État actif : ring autour + dégradé léger de fond, bordure teintée
- État `is-pending` (round live pas encore révélé) : bordure dashed

---

### `history-banner`
**Bandeau d'information affiché en haut du panel central quand le SM consulte un round historique**
- Fond violet `--color-violet-50`, bordure pleine `--color-violet`
- Icône 📜, titre "Vue historique — Round X", subtitle avec le round live, bouton CTA "Retour au round courant"

```css
.history-banner { background: var(--color-violet-50); border: 1.5px solid var(--color-violet); border-radius: var(--radius-lg); padding: 12px 16px; }
.history-banner__cta { border-radius: var(--radius-full); border: 1.5px solid var(--color-violet); color: var(--color-violet); }
.history-banner__cta:hover { background: var(--color-violet); color: white; }
```

---

### `layout-room-grid--with-timeline`
**Variante 3 colonnes du grid salle de jeu — affichée uniquement aux Scrum Masters**
- `grid-template-columns: 240px minmax(0,1fr) 300px`
- Max-width 1320 px (vs 1100 px pour le layout-room-grid standard)
- Sous 1080 px : retombe en 2 colonnes (timeline passe en pleine largeur sous le reste)

---

### `fx-reveal-burst`
**Animation festive plein écran au passage en phase `revealed`.** Canvas plein écran fixé en surimpression (`pointer-events: none`, `z-index: 9999`), généré via `canvas-confetti`. À chaque révélation, un des 6 presets random est joué : `fireworks`, `bigBang`, `sideCannons`, `starShower`, `schoolPride`, `goldenRain`. Palette principale alignée sur les couleurs de marque (`#4970ff`, `#ffb24d`, etc.) sauf `starShower` (palette dorée) et `goldenRain` (palette dorée). Composant : `RevealOverlay` (`src/components/room/RevealOverlay.tsx`).

---

### `bg-card-pattern`
**Texture brand : silhouettes de cartes répétées sur surfaces sombres.**
Source SVG : `/brand/patterns/card-pattern-light.svg` (silhouettes blanches, pensées pour
les fonds sombres). Appliqué via pseudo-élément `::before` positionné absolu, blend normal.
Tuile dense (168px) pour de petites cartes conformes au brand book (BRAND §5.1).
Modifiers : `--soft` (opacity 0.07), default (0.12), `--bold` (0.18).

```css
.bg-card-pattern { position: relative; isolation: isolate; }
.bg-card-pattern::before {
  content: '';
  position: absolute; inset: 0;
  background: url('/brand/patterns/card-pattern-light.svg') repeat;
  background-size: 168px 168px;
  opacity: 0.12;
  pointer-events: none;
  z-index: 0;
}
.bg-card-pattern > * { position: relative; z-index: 1; }
```

Usage : `lobby-hero`, `marketing-footer`, `marketing-final-cta__card`.
Interdit sur fond clair (BRAND §5.1).

---

### `lobby-hero`
**Bande brand-dark en haut de la lobby `/app`, avec card pattern.**
Largeur 100%, contient le `Lockup` (variante `horizontal-dark`), eyebrow tracked en sky,
et une tagline blanche à 72% d'opacité. La carte du formulaire (`card-surface--elevated`)
chevauche le bas du hero via `margin-top: -56px` sur `.layout-lobby-inner`.

```css
.lobby-hero {
  width: 100%;
  background: var(--color-brand-dark);
  color: white;
  padding: 40px 16px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.lobby-hero__inner { display: inline-flex; flex-direction: column; align-items: center; gap: 16px; }
.lobby-hero__tagline { font-size: 15px; color: rgba(255,255,255,0.72); max-width: 360px; }
.lobby-hero__eyebrow { font-size: 11px; letter-spacing: 0.10em; text-transform: uppercase; color: var(--color-sky); }
```

---

### `card-surface--elevated`
**Variante surélevée de `card-surface` pour le formulaire lobby au-dessus du hero.**
Rayon `--radius-2xl`, ombre composite (deep + brand glow), padding accru.

```css
.card-surface--elevated {
  border-radius: var(--radius-2xl);
  padding: 32px 24px;
  box-shadow: 0 12px 40px rgba(40,48,80,0.10), 0 2px 8px rgba(73,112,255,0.05);
}
```

---

### `lobby-footnote`
**Sous-texte discret de la lobby, sous la carte du formulaire.**

```css
.lobby-footnote {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: var(--color-text-muted);
}
```

---

## Composants marketing

### `Lockup` (composant React)
**Source : `src/components/marketing/Lockup.tsx`.**
Pioche dans `public/brand/logo/` selon `variant` et `theme`.
- `variant`: `horizontal` (défaut) · `mark` · `vertical`
- `theme`: `light` (défaut, fond clair) · `dark` (fond sombre, utilise `logo-horizontal-dark.svg`)
- `size`: hauteur en px (40 par défaut)
- Toujours wrappé dans un `<Link>` vers `/[locale]` pour servir d'ancre vers la home.

Interdictions BRAND §1 :
- Pas de rotation hors -8° / 0°
- Pas de recoloration hors 4 variantes officielles
- Pas de drop-shadow custom

---

### `marketing-header`
**Header sticky du site marketing.** Backdrop-blur translucide sur `--color-bg-page`,
lockup à gauche, nav au centre (Produit · Tarifs · Changelog), CTA pill + lang switch FR/EN à droite.
Burger menu sous 860px.

---

### `marketing-footer`
**Footer brand-dark avec card pattern.** Brand block (Lockup theme=dark + tagline)
+ 2 colonnes de liens (Produit / Légal), barre bottom avec copyright et email coral.
Slug `bg-card-pattern` appliqué pour la texture.

---

### `marketing-hero`
**Hero landing.** Titre `var(--text-display)` (64px, clamp responsive),
deco-blobs/circles en pastel, mockup reveal `hero-preview-card` en aplomb 2 colonnes
sous 720px.

---

### `marketing-section`
**Primitive de section marketing.** `padding: 96px 24px`, inner max-width 1120px.
Sous-classes : `marketing-problem`, `marketing-features`, `marketing-how`,
`marketing-pricing-teaser`, `marketing-faq`, `marketing-final-cta`,
`marketing-pricing`, `marketing-changelog`, `marketing-legal`.

---

### `marketing-final-cta__card`
**Encart brand-gradient + card pattern (CTA fin de landing).**
Background `linear-gradient(135deg, #4970FF, #3358E0)`, blobs deco + `bg-card-pattern--bold`
en overlay, contenu blanc, bouton pill blanc/brand inversé.

---

### `eyebrow`
**Sur-titre tracké uppercase, BRAND §3.2.**

```css
.eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--color-brand-primary);
}
.eyebrow--mini { font-size: 10px; color: var(--color-text-muted); }
```

---

### `mono-coral`
**Code inline coral monospace, BRAND §3.3.** URLs, room codes, valeurs Fibonacci.

```css
.mono-coral {
  font-family: var(--font-mono);
  color: var(--color-coral);
  font-size: 0.92em;
}
```

---

## Index des slugs

| Slug | Type | Description |
|---|---|---|
| `btn-primary-md` | Button | CTA principal — pill bleu |
| `btn-secondary-md` | Button | Action secondaire — pill outline |
| `btn-ghost-sm` | Button | Action discrète |
| `btn-danger-md` | Button | Action destructive — pill coral |
| `btn-reveal-lg` | Button | Révéler les votes (SM) — pill bleu grand |
| `input-text-md` | Input | Champ texte standard |
| `input-textarea-md` | Input | Textarea story |
| `badge-role-sm` | Badge | Rôle Scrum Master |
| `badge-role-dev` | Badge | Rôle Développeur |
| `badge-room-id` | Badge | Identifiant room — monospace |
| `badge-round` | Badge | Numéro de round |
| `badge-phase-voting` | Badge | Phase vote en cours |
| `badge-phase-revealed` | Badge | Phase votes révélés |
| `badge-phase-waiting` | Badge | Phase en attente |
| `avatar-sm` | Avatar | Avatar Scrum Master |
| `avatar-dev` | Avatar | Avatar Développeur |
| `card-surface` | Card | Conteneur générique — ombre bleue |
| `card-player-row` | Card | Ligne joueur |
| `vote-card-default` | VoteCard | Carte Fibonacci défaut |
| `vote-card-selected` | VoteCard | Carte Fibonacci sélectionnée — fond bleu |
| `vote-card-disabled` | VoteCard | Carte Fibonacci désactivée |
| `vote-card-revealed` | VoteCard | Valeur révélée — pill bleu |
| `status-voted` | Status | Indicateur voté — teal |
| `status-waiting` | Status | Indicateur en attente |
| `mean-display` | Display | Moyenne — chiffre Neuwelt Bold XL |
| `story-display` | Display | User story lecture seule |
| `layout-lobby` | Layout | Page de connexion centrée |
| `layout-room` | Layout | Salle de jeu 2 colonnes |
| `nav-room-header` | Nav | Header salle — fond blanc |
| `deco-blob` | Deco | Forme blob décorative |
| `deco-circle` | Deco | Cercle évidé décoratif |
| `spinner-sm` | Feedback | Spinner chargement |
| `toast-success` | Toast | Notification succès — teal |
| `toast-error` | Toast | Notification erreur — coral |
| `fx-reveal-burst` | FX | Animation festive plein écran au reveal — 6 presets random |
| `reveal-dashboard` | Reveal | Conteneur du tableau de bord post-reveal |
| `reveal-mean-hero` | Reveal | Tuile moyenne XL — gradient teinté par niveau de consensus |
| `reveal-consensus-badge` | Reveal | Badge niveau consensus (perfect / aligned / discuss / divergent) |
| `reveal-chart` | Reveal | Conteneur bar chart gamifié (axe Fibonacci à gauche + barres) |
| `reveal-bar` | Reveal | Barre verticale d'un participant — variants outlier/unknown/missing |
| `reveal-bar__fill` | Reveal | Remplissage de la barre — dégradés cool/mid/warm/hot selon valeur |
| `reveal-bar__token` | Reveal | Token au-dessus de la barre (avatar + pill valeur + tier badge) |
| `reveal-bar__tier` | Reveal | Mini badge EASY/MEDIUM/HARD/EPIC façon free-to-play |
| `reveal-chart__mean-line` | Reveal | Ligne pointillée de la moyenne tracée sur le chart |
| `reveal-chart__mean-marker` | Reveal | Pastille "M" sur l'axe (à gauche de la ligne moyenne) — valeur exacte au hover (title) |
| `emoji-picker` | Lobby | Sélecteur d'emoji avatar — preview + dé re-roll + grille |
| `role-card-group` | Lobby | Grille 2 col du sélecteur de rôle |
| `role-card` | Lobby | Carte rôle (icône + titre + subtitle + check badge) — variants developer (amber) / scrum-master (brand) |
| `reveal-bar__reopen` | Reveal | Bouton "↺ Re-voter" sous chaque barre — SM only |
| `reveal-reopen-chip` | Reveal | Pill CTA dans le banner de divergence — "Rouvrir le vote de X" |
| `reveal-reopen-hint` | Reveal | Astuce discrète SM quand pas de divergence |
| `vote-grid--reopened` | Vote | Variant card-surface quand le SM a rouvert le vote du dev |
| `vote-grid__reopen-banner` | Vote | Banner d'info dans le VoteGrid en mode rouvert |
| `story-status-pill` | Story | Pill état story (vote en cours / révélé) avec dot "modifications non sauvegardées" |
| `story-helper` | Story | Helper text discret sous le textarea (instructions) |
| `avatar-lg` | Avatar | Variante grande (56 px) pour le scoreboard |
| `avatar-emoji` | Avatar | Span emoji intérieur quand l'avatar a un emoji |
| `reveal-discussion-banner` | Reveal | Banner appelant à discuter quand divergence — souligne les outliers |
| `reveal-stat` | Reveal | Mini statistique (Min/Max/Votants...) du dashboard |
| `scale-preview` | Lobby | Aperçu en chips des cartes de l'échelle sélectionnée au lobby |
| `scale-preview__chip` | Lobby | Chip pill (1 carte) à l'intérieur de `scale-preview` |
| `reveal-mean-hero__unit` | Reveal | Suffixe d'unité (pts / JH) en petit à droite du chiffre principal |
| `reveal-mean-hero__hint` | Reveal | Sous-ligne discrète sous le hero (ex. arrondi JH carte supérieure) |
| `story-timeline` | Timeline | Rail historique des stories (SM only) — sticky droite |
| `story-timeline__item` | Timeline | Item cliquable d'un round (rang + dot consensus + moyenne) |
| `history-banner` | Banner | Bandeau "Vue historique — Round X" + CTA Retour + CTA Rouvrir |
| `history-banner__actions` | Banner | Container des 2 CTA du bandeau (Rouvrir + Retour) |
| `history-banner__cta--primary` | Banner | Variante action forte (rouvrir vote pour tout le monde) |
| `layout-room-grid--with-timeline` | Layout | Variante 3 col du grid (240 / 1fr / 300) — SM only |
| `session-recap` | Recap | Conteneur de l'écran final "session terminée" — anims orchestrées |
| `session-recap__hero` | Recap | Header géant avec titre 2 mots animés + emoji + subtitle |
| `big-stat` | Recap | Tuile stat XL (story points, consensus...) — variants brand/indigo/success/danger/muted |
| `award-card` | Recap | Carte d'award (flip-in 3D) avec icône bouncy + shine sweep — variants par id |
| `player-row` | Recap | Ligne joueur du leaderboard alignement — top 3 teintés or/argent/bronze |
| `highlight-card` | Recap | Story remarquable (consensuelle vs chaude) |
| `recap-story` | Recap | Item compact d'une story dans la liste finale, bordure gauche colorée |
| `bg-card-pattern` | Brand | Texture cartes inclinées sur surfaces sombres (BRAND §5.1), modifiers `--soft` / `--bold` |
| `lobby-hero` | Layout | Bande brand-dark de la lobby `/app` avec Lockup + tagline + card pattern |
| `card-surface--elevated` | Card | Variante surélevée pour formulaire lobby (rayon 2xl, ombre composite) |
| `lobby-footnote` | Lobby | Sous-texte discret sous la carte du formulaire |
| `Lockup` | Brand | Composant logo officiel React, variants horizontal/mark/vertical, theme light/dark |
| `eyebrow` | Marketing | Sur-titre tracké uppercase (BRAND §3.2), modifier `--mini` |
| `mono-coral` | Marketing | Code inline coral monospace (BRAND §3.3) |
| `marketing-header` | Marketing | Header sticky backdrop-blur, lockup + nav + CTA + lang switch |
| `marketing-footer` | Marketing | Footer brand-dark avec card pattern, 2 cols liens |
| `marketing-hero` | Marketing | Hero landing avec titre display 64px + mockup reveal |
| `marketing-section` | Marketing | Primitive section (padding 96px, max-width 1120px) |
| `marketing-final-cta__card` | Marketing | Encart brand-gradient + card pattern, CTA fin de landing |
| `marketing-feature-card` | Marketing | Carte feature avec emoji 32px, hover lift |
| `marketing-how__step` | Marketing | Step "How it works" avec numéro pill brand-50 |
| `marketing-faq__item` | Marketing | Item FAQ avec details/summary, chev rotating |
| `marketing-plan-card` | Marketing | Carte de plan tarifaire, modifier `--highlight` (border brand + shadow) |
| `marketing-changelog__entry` | Marketing | Item changelog versionné avec arrow bullets |
| `marketing-legal` | Marketing | Layout pages légales (privacy/terms/cookies) |
| `marketing-lang-switch` | Marketing | Pill outline FR/EN dans le header |
