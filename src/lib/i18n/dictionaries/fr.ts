// Tone of voice : BRAND.md §8 (tutoiement, verbe d'abord).
// Em dash interdit (cf. CLAUDE.md, règle non négociable).
export const fr = {
  meta: {
    title: 'Scrumbler, le planning poker qui réveille l’équipe',
    description:
      'Estime vite, débat franchement, aligne pour de bon. Vote anonyme, calcul auto, rituel enfin vivant.',
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
    eyebrow: 'Planning poker, version vivante',
    title: 'Estime vite,\ndébat fort,\naligne pour de bon.',
    lead:
      'Scrumbler transforme le rituel d’estimation en moment où l’équipe se réveille. Vote anonyme pour libérer toutes les voix, calcul auto pour ne pas perdre une minute, et un format gamifié qui donne envie de participer.',
    ctaPrimary: 'Lance une partie',
    ctaSecondary: 'Découvre le produit',
    proof: 'Aucun compte. Un code de salle partagé, c’est tout.',
  },
  problem: {
    eyebrow: 'Pourquoi Scrumbler',
    title:
      'Le vrai job du planning poker, c’est aligner l’équipe. Pas juste sortir un chiffre.',
    items: [
      {
        title: 'Le vote sert le débat, pas l’inverse',
        body:
          'Le chiffre tombe en deux clics, le calcul est instantané. Tout le temps gagné, on le passe là où ça compte : confronter les hypothèses, faire entendre les voix discrètes, aligner pour de vrai.',
      },
      {
        title: 'Anonyme, donc franc',
        body:
          'Les votes restent cachés jusqu’à la révélation. Personne ne s’aligne sur la première carte posée, et la divergence devient une discussion, pas une honte.',
      },
      {
        title: 'Gamifié, donc engageant',
        body:
          'Cartes, reveal théâtral, confetti, scoreboard tiered. Le rituel redevient un moment qu’on attend, pas qu’on subit. Toute l’équipe se prend au jeu.',
      },
    ],
  },
  features: {
    eyebrow: 'Ce que tu vas aimer',
    title: 'Tout pour estimer vite, débattre franchement, garder l’équipe à fond.',
    items: [
      {
        emoji: '🎯',
        title: 'Rôles dédiés',
        body:
          'Scrum Master ou Developer : chaque rôle a son interface, sa palette, ses gestes. Chacun à sa place autour de la table.',
      },
      {
        emoji: '🎲',
        title: 'Cartes Fibonacci',
        body:
          'La suite agile classique : 1, 2, 3, 5, 8, 13, 21, ?, ☕. Le ☕ dit « pause », le ? dit « j’ai besoin de plus d’infos ». Deux voix de plus à la table.',
      },
      {
        emoji: '🎉',
        title: 'Révélation théâtrale',
        body:
          'Reveal scoreboard avec gradient de tier, confetti, stats complètes (moyenne, médiane, écart-type, consensus). Le moment qu’on attend, pas qu’on expédie.',
      },
      {
        emoji: '💬',
        title: 'Le débat, là où il sert',
        body:
          'Quand un vote s’écarte, l’app ouvre une discussion neutre. On entend la voix qui aurait pu se taire, on aligne sur les faits, pas sur la majorité par défaut.',
      },
      {
        emoji: '↺',
        title: 'Re-vote en un clic',
        body:
          'Le débat fait bouger une décision ? Reclique la carte, le vote redevient privé. Pas de relance manuelle, on enchaîne.',
      },
      {
        emoji: '📊',
        title: 'Récap de session',
        body:
          'Timeline des stories, export markdown, partage du résumé. Le contexte reste, le prochain refinement démarre lancé.',
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
          'Pseudo, avatar emoji, rôle. Tu obtiens un code à partager, sans email, sans invitation.',
      },
      {
        n: '02',
        title: 'Partage le lien',
        body:
          'Les coéquipiers rejoignent en collant le code. Avatar, rôle, et hop, autour de la table virtuelle.',
      },
      {
        n: '03',
        title: 'Estime, débat, aligne',
        body:
          'Vote anonyme, reveal théâtral, calcul auto. Quand ça diverge, l’app ouvre la discussion. Tout le monde parle, tout le monde aligne, round suivant.',
      },
    ],
  },
  pricingTeaser: {
    eyebrow: 'Tarifs',
    title: 'Gratuit, tout simplement.',
    body:
      'Salles illimitées, joueurs illimités, rounds illimités. Les fonctionnalités premium arriveront quand on aura quelque chose de vraiment utile à proposer, pas avant.',
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
    title: 'Le prochain refinement, l’équipe le finit éveillée.',
    body: 'Une salle se crée en cinq secondes. Aucune installation, aucun compte, juste un code à partager.',
    cta: 'Lance une partie',
  },
  footer: {
    tagline: 'Le planning poker qui réveille l’équipe.',
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
        description: 'Pour les équipes qui veulent estimer vite, débattre franchement, aligner sans douleur.',
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
