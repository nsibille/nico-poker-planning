# Design System — Sprint Poker Planning
> Version 2.0 — Charte graphique mise à jour d'après les assets de marque fournis.
> **Règle absolue :** avant de créer un composant, consulter ce fichier.
> Si le composant existe → réutiliser son slug. S'il n'existe pas → le créer ici avec un slug unique, puis l'implémenter.

---

## Direction artistique

**Ambiance** : SaaS moderne et professionnel — fond blanc cassé très doux, typographie géométrique forte, accents bleu électrique vif, touches de couleur secondaire pour les rôles et états. Propre, aéré, efficace.

**Typographie** : Police **Neuwelt** (Bold pour les titres et chiffres des cartes, Medium pour les labels UI, Regular pour le corps, Light pour les textes secondaires). Géométrique, précise, forte personnalité sans être agressive. À charger via `@font-face` ou CDN si disponible, sinon fallback `'DM Sans', system-ui, sans-serif`.

**Éléments décoratifs** : Formes géométriques arrondies (blobs, cercles évidés, rectangles à grands rayons) en couleurs secondaires à faible opacité — utilisées comme accents de fond sur les pages lobby et header. Jamais en avant-plan.

**Rayons** : généreux — les boutons principaux sont `border-radius: 999px` (pill), les cards ont `16-20px`.

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

### `fx-reveal-burst`
**Animation festive plein écran au passage en phase `revealed`.** Canvas plein écran fixé en surimpression (`pointer-events: none`, `z-index: 9999`), généré via `canvas-confetti`. À chaque révélation, un des 6 presets random est joué : `fireworks`, `bigBang`, `sideCannons`, `starShower`, `schoolPride`, `goldenRain`. Palette principale alignée sur les couleurs de marque (`#4970ff`, `#ffb24d`, etc.) sauf `starShower` (palette dorée) et `goldenRain` (palette dorée). Composant : `RevealOverlay` (`src/components/room/RevealOverlay.tsx`).

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
