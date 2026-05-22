# Sprint Poker Planning

## Avant toute chose
Lis `CLAUDE_CODE_PROMPT.md` et `DESIGN_SYSTEM.md` qui sont à la racine du projet.
Ces deux fichiers contiennent toutes les instructions et specs à suivre.

**Pour toute tâche marketing, site, logos, polices ou éléments graphiques** :
lis aussi `BRAND.md` à la racine — c'est la source de vérité de l'identité visuelle Scrumbler
(logos, couleurs, typo, voix, do/don't). Les assets vivent dans `public/brand/`.

## Règles non négociables
- Consulter `DESIGN_SYSTEM.md` avant chaque composant UI — vérifier l'index des slugs
- Si un slug existe → le réutiliser tel quel
- Si aucun slug ne correspond → créer le composant, lui attribuer un slug, l'ajouter dans `DESIGN_SYSTEM.md`
- Ne jamais utiliser Inter, Roboto ou Arial — la police est Neuwelt (fallback : DM Sans)
- Tous les boutons principaux sont des pills (border-radius: 999px)
- Couleur primaire : #4970ff — ne pas substituer
- Logo : n'utiliser que les variantes officielles de `BRAND.md` §1.1 — tilt -8° (ou 0° dans un masque carré)

## Connexion Supabase
- Le MCP Supabase est configuré dans `.mcp.json` (non commité, chaque dev crée le sien)
- Utiliser le MCP pour toutes les opérations DB — pas le Dashboard Supabase
- Structure du `.mcp.json` à créer : voir `.mcp.json.example` à la racine
