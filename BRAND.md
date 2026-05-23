# Scrumbler, Brand Guidelines

> Single source of truth for the Scrumbler visual identity. Use this alongside the asset pack in `brand-assets/`. If something isn't documented here, ask design before improvising.

**Version** 1.1.0 · **Date** 23 mai 2026

---

## 0 · Brand snapshot

- **Name** Scrumbler
- **Tagline** *Planning poker pour équipes agiles, estime, révèle, recommence.*
- **What it is** A lightweight, anonymous-by-default planning-poker app for agile teams.
- **Why (raison d'être)** Le sprint planning est un rituel d'équipe, pas une corvée. Scrumbler le rend vivant et agréable : il fait circuler la parole (souvent monopolisée par une ou deux personnes), révèle les hypothèses cachées, crée un espace safe où chacun ose son estimation, et ajoute ce qu'il faut de jeu et de fun pour souder l'équipe. La tech reste invisible, au service de l'expérience.
- **Voice** Tutoiement, verbe d'abord, positif et bienveillant. **Em dash interdit** (voir `CLAUDE.md`).
- **Language** French, with a few untranslated English game terms (Scrum Master, EPIC).
- **Mascot glyph** 🃏 (used sparingly, the logo carries the brand)

---

## 1 · Logo

The mark is a single planning-poker card, tilted **-8°**, carrying a bold `?` and two miniature `?` pips in opposite corners. The `?` is the Fibonacci wildcard, the shared doubt a round of planning poker is meant to resolve.

### 1.1 Variants

| File | When to use |
|---|---|
| `logo/logo-horizontal.svg`        | **Default**. App header, marketing, email signatures. |
| `logo/logo-horizontal-dark.svg`   | On dark surfaces (ink, photography). |
| `logo/logo-vertical.svg`          | Square-ish layouts: social previews, footer, print. |
| `logo/logo-mark.svg`              | Standalone mark, favicon source, app icon, small chrome. |
| `logo/logo-mark-ink.svg`          | Dark-mode card (ink fill, white `?`). |
| `logo/logo-mark-paper.svg`        | White card with blue `?`, for use on a brand-blue background. |
| `logo/logo-mark-amber.svg`        | Reserved alt, holiday / "Developer team" comms only. Ask design. |
| `logo/logo-monogram.svg`          | Mark with **tilt = 0°**, required inside square masks (iOS, Android adaptive). |
| `logo/logo-wordmark.svg`          | Type only, extremely rare; only when paired with another mark adjacency makes the lockup redundant. |

### 1.2 Construction

- **Tilt** = `-8°` exactly. Inside square masks (favicons, app icons), tilt = `0°`. **No other angle is allowed.**
- **Aspect ratio** of the card = 56:72 (≈ 7:9). Never stretch.
- **Inner hairline** = `0.8px` white stroke at `0.18` opacity, inset by `3.5px`. It's intentional, don't remove it.
- **Corner pips** = miniature `?` glyphs at top-left and bottom-right. Hide them under **24px** rendered size.

### 1.3 Clear space

Maintain a clear zone equal to **`x`** on every side of the mark, where `x` = the height of one pip glyph (≈ ⅙ of the card height). No graphic or typographic element may enter this zone.

### 1.4 Minimum sizes

| Context | Size | Pips |
|---|---|---|
| Favicon | 16px | ✗ |
| In-app navigation | 24px | ✗ |
| App header / lockup | 40px | ✓ |
| Marketing / hero | 64px+ | ✓ |

---

## 2 · Colors

All tokens live in `tokens/tokens.css` (CSS custom properties) and `tokens/tokens.json` (machine-readable). **Reference tokens, not hex values, in product code.**

### 2.1 Brand

| Token | Hex | Use |
|---|---|---|
| `--color-brand-primary`     | `#4970FF` | Default brand. Primary buttons, focus rings, links. |
| `--color-brand-primary-600` | `#3358E0` | Hover / active for primary. |
| `--color-brand-primary-100` | `#DCE3FF` | Disabled brand, inactive selection. |
| `--color-brand-primary-50`  | `#EEF1FF` | Brand wash backgrounds, button hover. |
| `--color-brand-dark`        | `#283050` | Ink. Primary text, dark surfaces. |

### 2.2 Neutrals

Never pure grey, always a touch of blue.

| Token | Hex | Use |
|---|---|---|
| `--color-bg-surface`       | `#FFFFFF` | Cards, modals. |
| `--color-bg-page`          | `#F5F6FA` | Page background. |
| `--color-bg-subtle`        | `#FAFAFA` | Alternate row, input fill. |
| `--color-border`           | `#E8EAF0` | 1px dividers. |
| `--color-border-strong`    | `#D0D4E0` | 1.5px input borders, dashed bounds. |
| `--color-text-primary`     | `#283050` | Body text. |
| `--color-text-secondary`   | `#6B7299` | Sub-text, leads. |
| `--color-text-muted`       | `#A0A8C0` | Hints, captions, placeholders. |

### 2.3 Accents (secondaries)

Reserved for **reveal scoreboard**, **role differentiation**, and **semantic states**. Never use for primary chrome.

| Token | Hex | Use |
|---|---|---|
| `--color-amber`  | `#FFB450` | Warning · Developer role · holiday accent. |
| `--color-coral`  | `#FF7F66` | Danger · destructive · mono code · URL. |
| `--color-teal`   | `#3FB8C4` | Success · consensus. |
| `--color-sky`    | `#64C1FA` | Decorative blobs only. |
| `--color-indigo` | `#6691FF` | Decorative blobs only. |
| `--color-violet` | `#9485F2` | Decorative blobs only. |

### 2.4 Semantic mapping

```css
--color-success: var(--color-teal);
--color-warning: var(--color-amber);
--color-danger:  var(--color-coral);
--color-info:    var(--color-brand-primary);

--color-role-sm:  var(--color-brand-primary);   /* Scrum Master = blue */
--color-role-dev: var(--color-amber);            /* Developer    = amber */
```

### 2.5 Gradient palette (reveal only)

Used **only** on the reveal scoreboard bars, never as a UI surface.

| Tier | Gradient |
|---|---|
| Cool / EASY    | `#6EE2A1 → #3FB88E → #2A9A78` |
| Mid / MEDIUM   | `#6EC5FF → #4970FF → #3358E0` |
| Warm / HARD    | `#FFD97A → #FFB24D → #F08C1A` |
| Hot / EPIC     | `#FF9B7A → #FF5E7E → #D63666` |

---

## 3 · Typography

### 3.1 Family

- **Primary** Neuwelt (cible) → DM Sans (fallback public, Google Fonts).
- **Mono** JetBrains Mono.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap"/>
```

If/when Neuwelt licenses arrive, drop `Neuwelt-{Light,Regular,Medium,Bold}.woff2` into your fonts folder, the `@font-face` block in `tokens.css` picks them up automatically.

### 3.2 Scale

| Token | Size | Weight | Tracking | Use |
|---|---:|:---:|:---:|---|
| `display` | 64px | 700 | -0.035em | Hero marketing only. |
| `--text-2xl` (h1) | 32px | 700 | -0.025em | Page titles, hero in-app. |
| `--text-xl` (h2)  | 24px | 700 | -0.015em | Section titles. |
| `--text-lg`       | 18px | 400 | -0.005em | Leads, intros. |
| `--text-md`       | 15px | 400 | normal | Body. |
| `--text-base`     | 14px | 400 | normal | Default. |
| `--text-sm`       | 13px | 500 | normal | Labels, secondary. |
| `--text-xs`       | 11px | 500 | 0.10em | Eyebrows (UPPERCASE), tracked. |

### 3.3 Mono

Use `--font-mono` in **`--color-coral`** for: room codes (`abc-123-xyz`), URLs, Fibonacci values, code snippets.

```html
<code class="mono">scrumbler.app/room/abc-123</code>
```

---

## 4 · Iconography

**Two systems coexist, do not introduce a third (no Lucide, Heroicons, Material Icons).**

### 4.1 Native emoji

Used for **avatars**, **roles**, and **emotional states**. Always rendered at OS default size, no recolouring.

| Emoji | Role |
|---|---|
| `🃏` | Mascot / app glyph |
| `🎯` | Scrum Master role |
| `🧑‍💻` | Developer role |
| `🎲` | Re-roll avatar |
| `💬` | Discussion needed |
| `⚠️` | Outlier flag |
| `🎉` | Reveal celebration |
| 46-emoji avatar pool | Player avatars (animals · fantasy · space · food · gaming) |

### 4.2 Stroke icons

For chrome (buttons, navigation, status bars) where an emoji would feel too playful. **32×32 grid · 1.75px stroke · round caps and joins.** Built into the brand-page mockups, extract paths there to extend the set.

### 4.3 Functional glyphs (Unicode)

Use these in copy, not images: `↺` re-vote · `→` next round · `✓` voted · `…` waiting · `←` back.

---

## 5 · Pattern & confetti

Two textures exist outside the regular UI. **Both are restricted.**

### 5.1 Card pattern

Repeating tilted-card silhouettes at low opacity. **Dark surfaces only.** Hero sections, marketing banners.

### 5.2 Confetti

The brand palette (blue · amber · coral · teal · violet · sky) burst, used **only at the moment of vote reveal**. Never as decoration on idle UI.

---

## 6 · Web implementation

### 6.1 HTML `<head>` snippet

```html
<!-- Favicons + app icons -->
<link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg"/>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32.png"/>
<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16.png"/>
<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
<link rel="manifest" href="/favicon/site.webmanifest"/>
<meta name="theme-color" content="#4970FF"/>

<!-- Social preview -->
<meta property="og:title" content="Scrumbler, Planning poker pour équipes agiles"/>
<meta property="og:description" content="Estime, révèle, recommence. Aucun compte requis, connexion anonyme."/>
<meta property="og:image" content="/social/og-image.png"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="/social/twitter-card.png"/>

<!-- Fonts + tokens -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap"/>
<link rel="stylesheet" href="/tokens/tokens.css"/>
```

### 6.2 React lockup component

If you build the lockup in React, the canonical SVG geometry lives at `logo/logo-mark.svg`. Inline it via your bundler, or fetch + dangerously-set if you need runtime colour swaps. Example:

```jsx
import MarkSvg from './brand-assets/logo/logo-mark.svg';

export function Lockup({ size = 40 }) {
  return (
    <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <img src={MarkSvg} width={size} height={size} alt="Scrumbler"/>
      <span style={{
        fontFamily: 'var(--font-primary)',
        fontWeight: 700,
        fontSize: size * 0.5,
        letterSpacing: '-0.035em',
        color: 'var(--color-text-primary)',
      }}>scrumbler</span>
    </a>
  );
}
```

---

## 7 · Do · Don't

✅ Use only the 4 official mark variants (brand · ink · paper · amber).
✅ Keep tilt at `-8°` (or `0°` inside square masks).
✅ Maintain the clear space of `x` (one pip height) around the mark.
✅ Lead with brand blue; reach for amber for warmth, coral for warnings.

❌ **Don't recolour** the mark outside the four approved variants, no holiday palettes, no UGC tints.
❌ **Don't rotate** the mark to any angle other than `-8°` / `0°`.
❌ **Don't stretch** or skew the card, aspect is fixed.
❌ **Don't apply free-form drop shadows.** Only `--shadow-card` is permitted on the mark.
❌ **Don't introduce a new icon library** alongside emoji + the stroke pack.
❌ **Don't translate** the wordmark "scrumbler", it's a proper noun.

---

## 8 · Voice & tone

Five rules. Hold the line on these and the product sounds like Scrumbler without having to sign it.

### Règle 01, Tutoie.
L'app est anonyme et collégiale, on ne « vous » pas l'utilisateur.
- ✓ *Ton avatar est prêt, choisis un rôle.*
- ✗ *Veuillez sélectionner votre rôle.*

### Règle 02, Verbe d'abord, sur les boutons.
Impérative. Pas de bouton « OK » ni « Suivant » nu.
- ✓ *Lancer le vote · Révéler les votes · Prochain round →*
- ✗ *OK · Soumettre · Confirmer*

### Règle 03 (REMPLACÉE) Pas d'em dash, jamais.
**Override projet (voir `CLAUDE.md`)** : le caractère em dash (U+2014) est interdit dans toute copy Scrumbler.
On garde un ton direct sans être sec, avec virgule, point, parenthèses, ou deux-points.
- ✓ *Aucun compte requis, connexion anonyme.*
- ✗ Toute phrase contenant un em dash (le glyphe U+2014). Pas d'exception.

### Règle 04 Reste bienveillant quand ça diverge.
Un écart d'estimation est une info précieuse, pas un problème. On ouvre la parole pour comprendre un point de vue.
- ✓ *Discussion nécessaire : prenez un instant pour comprendre les hypothèses avant de re-voter.*
- ✗ *Erreur de vote : un développeur s'est trompé.*

### Règle 05 Dis ce qu'on fait, pas ce qu'on ne fait pas.
Formule au positif. Évite même de citer un terme négatif pour le nier (« sans pointer du doigt », « pas une honte », « pas pour faire joli ») : nommer l'anxiété la convoque. On décrit l'expérience qu'on offre, pas celle qu'on évite.
- ✓ *Chaque point de vue est une info précieuse pour mieux estimer.*
- ✗ *On ne pointe personne du doigt.*

### Microcopy patterns

- **Loading**: `Reprise de ta session…`, `Enregistrement…`. Toujours le glyphe `…`, jamais trois points.
- **Confirmation**: `✓ Vote enregistré : 5. Reclique la carte pour annuler.`
- **Empty state**: `Aucune story définie. Renseigne-la pour lancer le vote.`
- **Errors**: blunt but not blaming, `Réouverture échouée : {reason}`.

---

## 9 · Asset inventory

```
brand-assets/
├── BRAND.md                          ← this file
├── logo/
│   ├── logo-horizontal.svg           ← default lockup
│   ├── logo-horizontal-dark.svg      ← dark surface
│   ├── logo-vertical.svg
│   ├── logo-mark.svg                 ← primary mark
│   ├── logo-mark-ink.svg
│   ├── logo-mark-paper.svg
│   ├── logo-mark-amber.svg
│   ├── logo-monogram.svg             ← tilt 0, no pips, for masks
│   └── logo-wordmark.svg
├── favicon/
│   ├── favicon.svg                   ← link rel="icon" SVG
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── favicon-48.png
│   ├── apple-touch-icon.png          ← 180×180
│   ├── android-chrome-192.png
│   ├── android-chrome-512.png
│   └── site.webmanifest              ← PWA manifest
├── social/
│   ├── og-image.png                  ← 1200×630
│   └── twitter-card.png              ← 1200×675
└── tokens/
    ├── tokens.css                    ← :root custom properties
    └── tokens.json                   ← machine-readable
```

---

## 10 · Changelog

| Version | Date | Notes |
|---|---|---|
| 1.1.0   | 2026-05-23 | Ajout de la raison d'être (why). Voix : règle 05 (positivité), règle 04 recadrée sur la bienveillance. |
| 1.0.0   | 2026-05-22 | Initial brand book. Question-card mark, full token set, 4 voice rules. |

---

*Questions ? Ouvre une issue avec le tag `brand` ou ping le canal `#design`.*
