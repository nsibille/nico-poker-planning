// Tone of voice : BRAND.md §8 (tutoiement, verbe d'abord).
// Em dash interdit (cf. CLAUDE.md, règle non négociable).
export const fr = {
  meta: {
    title: 'Scrumbler, planning poker pour équipes agiles',
    description:
      'Le planning poker qui transforme le refinement en moment d’équipe. Vote rapide, débat qui aligne, anonyme par défaut, sans compte.',
  },
  nav: {
    product: 'Produit',
    pricing: 'Tarifs',
    changelog: 'Changelog',
    cta: 'Lance une partie',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },
  hero: {
    eyebrow: 'Le rituel qu’on a envie de faire',
    title: 'Estime tes stories,\nrévèle d’un coup,\nrecommence.',
    lead:
      'Les rituels d’estimation, c’est trop souvent une corvée. Scrumbler en fait un moment d’équipe : vote en aveugle, résultats en direct, débat sans accusation pour aller chercher l’alignement, et franchement fun.',
    ctaPrimary: 'Lance une partie',
    ctaSecondary: 'Découvre le produit',
    proof: 'Aucun compte. Un code de salle partagé, c’est tout.',
  },
  problem: {
    eyebrow: 'Pourquoi Scrumbler',
    title:
      'Les rituels d’estimation devraient engager l’équipe, pas l’endormir.',
    items: [
      {
        title: 'Personne ne décroche',
        body:
          'Le format est rythmé, gamifié, visuel. Le vote prend trente secondes, la révélation est un petit événement, le débat reste vivant. On y va parce qu’on a envie d’y aller.',
      },
      {
        title: 'Toutes les voix comptent',
        body:
          'Votes cachés jusqu’à la révélation : personne ne s’aligne sur le premier qui pose une carte, les juniors osent, les écarts deviennent une discussion plutôt qu’une honte.',
      },
      {
        title: 'L’alignement, pour de vrai',
        body:
          'Quand les votes divergent, Scrumbler met le débat sur la table sans pointer du doigt. On entend le pourquoi, on revote, on avance ensemble.',
      },
    ],
  },
  features: {
    eyebrow: 'Ce que tu vas aimer',
    title: 'Tout ce qu’il faut pour que l’équipe se prenne au jeu, rien de plus.',
    items: [
      {
        emoji: '🎯',
        title: 'Rôles dédiés',
        body:
          'Scrum Master ou Developer : chaque rôle a son interface, sa palette, ses gestes.',
      },
      {
        emoji: '🎲',
        title: 'Cartes Fibonacci',
        body:
          'La suite agile classique : 1, 2, 3, 5, 8, 13, 21, ?, ☕. Une carte ☕ pour dire « pause », un ? pour dire « j’ai pas assez d’infos ».',
      },
      {
        emoji: '🎉',
        title: 'Révélation théâtrale',
        body:
          'Reveal scoreboard avec gradient de tier, confetti, et stats : moyenne, médiane, écart-type, consensus.',
      },
      {
        emoji: '💬',
        title: 'Discussion ciblée',
        body:
          'Quand un vote s’écarte du groupe, l’app propose une discussion neutre, sans pointer du doigt.',
      },
      {
        emoji: '↺',
        title: 'Re-vote en un clic',
        body:
          'Une décision change ? Reclique la carte, le vote redevient privé. Pas besoin de refaire un round entier.',
      },
      {
        emoji: '📊',
        title: 'Récap de session',
        body:
          'Timeline des stories, export markdown, partage du résumé. Tout pour retrouver le contexte au prochain refinement.',
      },
    ],
  },
  how: {
    eyebrow: 'Comment ça marche',
    title: 'Trois étapes, pas une de plus.',
    steps: [
      {
        n: '01',
        title: 'Crée la salle',
        body:
          'Choisis un pseudo, un avatar emoji, un rôle. Tu obtiens un code à partager, sans invitation par email.',
      },
      {
        n: '02',
        title: 'Partage le lien',
        body:
          'Les coéquipiers rejoignent en collant le code. Avatar, rôle, et hop, autour de la table virtuelle.',
      },
      {
        n: '03',
        title: 'Estime, révèle, recommence',
        body:
          'Le Scrum Master saisit la story, lance le vote. Tout le monde joue sa carte. Révélation, discussion si besoin, round suivant.',
      },
    ],
  },
  pricingTeaser: {
    eyebrow: 'Tarifs',
    title: 'Gratuit, tout simplement.',
    body:
      'Scrumbler est gratuit pour les équipes : autant de salles, autant de joueurs, autant de rounds que tu veux. Les fonctionnalités premium arrivent quand on aura quelque chose de vraiment utile à proposer, pas avant.',
    cta: 'Voir les tarifs en détail',
  },
  faq: {
    eyebrow: 'Questions fréquentes',
    title: 'Tu te demandes peut-être…',
    items: [
      {
        q: 'Il faut créer un compte ?',
        a: 'Non, connexion anonyme. Tu choisis un pseudo et un avatar emoji, ta session reste sur ton appareil.',
      },
      {
        q: 'Combien de joueurs par salle ?',
        a: 'Aucune limite stricte. Les sessions confortables tiennent en général à 10 joueurs. Au-delà, le ressenti dépend de ta connexion.',
      },
      {
        q: 'Mes données sont-elles partagées ?',
        a: 'Non. Pas de tracking publicitaire, pas de revente. Les votes restent dans la salle, et celle-ci s’efface quand tout le monde la quitte.',
      },
      {
        q: 'Je peux utiliser autre chose que Fibonacci ?',
        a: 'Pas encore, c’est la prochaine grosse étape. T-shirt sizes (XS à XXL) et suites custom arrivent bientôt.',
      },
      {
        q: 'Open source ?',
        a: 'Pas encore. Le code est privé pendant la phase de stabilisation. On ré-évaluera dès qu’on aura un V1 propre.',
      },
    ],
  },
  finalCta: {
    title: 'Prêt à faire de ton prochain refinement un moment d’équipe ?',
    body: 'Une salle se crée en cinq secondes. Aucun compte, rien à installer.',
    cta: 'Lance une partie',
  },
  footer: {
    tagline: 'Planning poker pour équipes qui jouent le jeu.',
    columns: {
      product: {
        title: 'Produit',
        links: [
          { label: 'Tarifs', href: '/pricing' },
          { label: 'Changelog', href: '/changelog' },
        ],
      },
      legal: {
        title: 'Légal',
        links: [
          { label: 'Confidentialité', href: '/legal/privacy' },
          { label: 'Conditions', href: '/legal/terms' },
          { label: 'Cookies', href: '/legal/cookies' },
        ],
      },
    },
    rights: '© 2026 Scrumbler. Tous droits réservés.',
    langSwitch: 'EN',
  },
  pricing: {
    eyebrow: 'Tarifs',
    title: 'Gratuit aujourd’hui, durable demain.',
    lead:
      'On préfère commencer simple et clair. Scrumbler reste gratuit tant qu’on ne propose pas quelque chose de vraiment payant.',
    plans: [
      {
        name: 'Crew',
        price: '0 €',
        cadence: 'pour toujours',
        description: 'Pour les équipes qui veulent juste estimer vite, bien, sans friction.',
        features: [
          'Salles illimitées',
          'Joueurs illimités',
          'Reveal scoreboard complet',
          'Récap de session exportable',
          'Connexion anonyme',
          'Temps réel sub-seconde',
        ],
        cta: 'Lance une partie',
        href: '/app',
        highlight: true,
      },
      {
        name: 'Studio (bientôt)',
        price: 'À venir',
        cadence: '',
        description: 'Pour les organisations qui veulent garder une mémoire et brancher leurs outils.',
        features: [
          'Historique persistant des sessions',
          'Intégrations Jira / Linear / GitHub',
          'Suites d’estimation custom (t-shirt, puissances de 2…)',
          'SSO et workspaces',
          'Support prioritaire',
        ],
        cta: 'Préviens-moi au lancement',
        href: 'mailto:hello@scrumbler.app?subject=Scrumbler%20Studio',
        highlight: false,
      },
    ],
    note: 'Pas de carte bancaire, pas de période d’essai. Tu utilises Scrumbler, ou tu ne l’utilises pas.',
  },
  changelog: {
    eyebrow: 'Changelog',
    title: 'Ce qu’on a livré récemment.',
    lead: 'Mises à jour ordonnées de la plus récente à la plus ancienne, version annotée à chaque palier.',
    entries: [
      {
        version: '0.4.0',
        date: '2026-05-22',
        title: 'Brand pack & site marketing',
        items: [
          'Identité visuelle finalisée : logo, palette, typo, voix officielle.',
          'Site marketing déployé : landing, pricing, changelog, mentions légales.',
          'Favicons, OpenGraph et manifest PWA.',
        ],
      },
      {
        version: '0.3.0',
        date: '2026-04-30',
        title: 'Récap de session',
        items: [
          'Timeline des stories avec snapshot des votes par round.',
          'Export markdown et copie one-click.',
          'Re-vote depuis la timeline en un clic.',
        ],
      },
      {
        version: '0.2.0',
        date: '2026-04-12',
        title: 'Reveal Dashboard',
        items: [
          'Scoreboard tiered (Easy / Medium / Hard / Epic).',
          'Détection automatique d’outliers : discussion proposée, jamais imposée.',
          'Confetti à la révélation.',
        ],
      },
      {
        version: '0.1.0',
        date: '2026-03-20',
        title: 'V1 publique',
        items: [
          'Salles temps réel via Supabase Realtime.',
          'Rôles Scrum Master et Developer.',
          'Carte Fibonacci complète (1 à 21, ?, ☕).',
        ],
      },
    ],
  },
  legal: {
    privacy: {
      title: 'Politique de confidentialité',
      updated: 'Mis à jour le 22 mai 2026.',
      body: [
        { h: 'En résumé', p: 'Scrumbler est anonyme par défaut. On ne te demande ni email, ni nom légal, ni téléphone. Aucun cookie publicitaire, aucun tracker tiers.' },
        { h: 'Ce qu’on collecte', p: 'Un pseudo et un avatar emoji que tu choisis. Tes votes pendant la session. Un identifiant technique de joueur, stocké localement dans ton navigateur.' },
        { h: 'Où ça vit', p: 'Sur Supabase, en Europe. Les salles inactives sont purgées automatiquement.' },
        { h: 'Tes droits', p: 'Tu peux quitter une salle à tout moment, ta donnée joueur est supprimée. Pour toute question, écris à hello@scrumbler.app.' },
      ],
    },
    terms: {
      title: 'Conditions d’utilisation',
      updated: 'Mis à jour le 22 mai 2026.',
      body: [
        { h: 'Service', p: 'Scrumbler est un planning poker fourni « tel quel ». Aucun engagement de disponibilité n’est associé à la version gratuite.' },
        { h: 'Comportement', p: 'Pseudos et messages respectueux, pas de harcèlement, pas de contenu illégal. Les abus mènent à un blocage du salon.' },
        { h: 'Responsabilité', p: 'Tu utilises Scrumbler pour estimer, pas pour stocker des données critiques. Aucune sauvegarde longue durée n’est garantie en V1.' },
        { h: 'Évolutions', p: 'Les conditions peuvent changer : la version courante fait foi à compter de la date affichée ci-dessus.' },
      ],
    },
    cookies: {
      title: 'Cookies',
      updated: 'Mis à jour le 22 mai 2026.',
      body: [
        { h: 'Ce qu’on utilise', p: 'Strict minimum : un identifiant de session local pour te garder dans ta salle si tu rafraîchis la page.' },
        { h: 'Pas d’ads', p: 'Aucun cookie publicitaire. Pas de Google Analytics. Pas de tracking inter-sites.' },
        { h: 'Désactiver', p: 'Tu peux vider le stockage local de ton navigateur à tout moment, ça te déconnectera juste de la salle en cours.' },
      ],
    },
  },
} as const
