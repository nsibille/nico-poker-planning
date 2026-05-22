// English mirrors the French dictionary structure.
// Em dash forbidden (see CLAUDE.md, non-negotiable rule).
export const en = {
  meta: {
    title: 'Scrumbler, planning poker for agile teams',
    description:
      'Vote in seconds, debate what matters, walk out aligned. Planning poker that turns the ritual into a real team moment.',
  },
  nav: {
    product: 'Product',
    pricing: 'Pricing',
    changelog: 'Changelog',
    cta: 'Start a game',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  hero: {
    eyebrow: 'Planning poker, alive',
    title: 'Vote fast,\ndebate better,\nleave aligned.',
    lead:
      'Scrumbler speeds up the vote and crunches the stats for you. You save time on the tool and spend it where it counts: hearing every voice, sparking the debate, and having a bit of fun while you’re at it.',
    ctaPrimary: 'Start a game',
    ctaSecondary: 'See the product',
    proof: 'No account. Share a room code, that’s it.',
  },
  problem: {
    eyebrow: 'Why Scrumbler',
    title:
      'A refinement can be a team moment people actually want to show up for.',
    items: [
      {
        title: 'Fast votes, sharper debate',
        body:
          'A room ready in five seconds, stats computed on the fly. Less time counting, more time talking.',
      },
      {
        title: 'Every voice counts',
        body:
          'Votes stay hidden until reveal, nobody anchors on the first card down. When opinions diverge you get an open conversation, not a courtroom. A space to challenge without feeling judged.',
      },
      {
        title: 'The ritual becomes a game',
        body:
          'Theatrical reveal, confetti, tiered scoreboard. Gamification means everyone plays, and the team walks out a touch more aligned and a touch more bonded.',
      },
    ],
  },
  features: {
    eyebrow: 'What you’ll love',
    title: 'Everything to estimate fast and debate better.',
    items: [
      {
        emoji: '🎯',
        title: 'Dedicated roles',
        body:
          'Scrum Master or Developer: each role gets its own surface, palette and gestures.',
      },
      {
        emoji: '🎲',
        title: 'Fibonacci cards',
        body:
          'The agile classic: 1, 2, 3, 5, 8, 13, 21, ?, ☕. The ? when info is missing, the ☕ when the room needs a break.',
      },
      {
        emoji: '🎉',
        title: 'Theatrical reveal',
        body:
          'Tiered scoreboard, confetti, stats computed for you: mean, median, deviation, consensus. You spot the sticking point at a glance.',
      },
      {
        emoji: '💬',
        title: 'Debate, not silence',
        body:
          'When a vote diverges, Scrumbler offers a neutral discussion. No finger pointing, every voice gets the floor.',
      },
      {
        emoji: '↺',
        title: 'One-click re-vote',
        body:
          'Did the debate change a mind? Click your card again, the vote turns private. No need to restart the round.',
      },
      {
        emoji: '📊',
        title: 'Session recap',
        body:
          'Timeline of stories, markdown export, shareable summary. Next refinement starts with full context.',
      },
    ],
  },
  how: {
    eyebrow: 'How it works',
    title: 'Three steps, not one more.',
    steps: [
      {
        n: '01',
        title: 'Create the room',
        body:
          'Pick a nickname, an emoji avatar, a role. You get a code to share, no email invites.',
      },
      {
        n: '02',
        title: 'Share the link',
        body:
          'Teammates join by pasting the code. Avatar, role, done. They’re at the virtual table.',
      },
      {
        n: '03',
        title: 'Estimate, debate, align',
        body:
          'The Scrum Master enters a story and opens the vote. Everyone plays a card. Reveal, stats, conversation if needed, next round.',
      },
    ],
  },
  pricingTeaser: {
    eyebrow: 'Pricing',
    title: 'Free, plain and simple.',
    body:
      'Scrumbler is free for teams: unlimited rooms, players, rounds. Premium tiers will land when we have something genuinely worth charging for, not before.',
    cta: 'See the full pricing',
  },
  faq: {
    eyebrow: 'Frequently asked',
    title: 'You might be wondering…',
    items: [
      {
        q: 'Do I need an account?',
        a: 'No, fully anonymous. You pick a nickname and an emoji avatar, the session stays on your device.',
      },
      {
        q: 'How many players per room?',
        a: 'No hard limit. Comfortable sessions usually cap around 10 players. Beyond that, it depends on your connection.',
      },
      {
        q: 'Is my data shared?',
        a: 'No. No ad tracking, no resale. Votes stay in the room, the room clears when everyone leaves.',
      },
      {
        q: 'Can I use something other than Fibonacci?',
        a: 'Not yet, that’s the next big step. T-shirt sizes (XS to XXL) and custom scales are coming soon.',
      },
      {
        q: 'Open source?',
        a: 'Not yet. The codebase is private during stabilization. We’ll revisit once V1 is solid.',
      },
    ],
  },
  finalCta: {
    title: 'Ready to turn your next refinement into a team moment that actually lands?',
    body: 'A room spins up in five seconds. The rest follows, faster and livelier.',
    cta: 'Start a game',
  },
  footer: {
    tagline: 'Vote fast, debate better, leave aligned.',
    columns: {
      product: {
        title: 'Product',
        links: [
          { label: 'Pricing', href: '/pricing' },
          { label: 'Changelog', href: '/changelog' },
        ],
      },
      legal: {
        title: 'Legal',
        links: [
          { label: 'Privacy', href: '/legal/privacy' },
          { label: 'Terms', href: '/legal/terms' },
          { label: 'Cookies', href: '/legal/cookies' },
        ],
      },
    },
    rights: '© 2026 Scrumbler. All rights reserved.',
    langSwitch: 'FR',
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Free today, sustainable tomorrow.',
    lead:
      'We’d rather start clean and simple. Scrumbler stays free until we have something worth charging for.',
    plans: [
      {
        name: 'Crew',
        price: '€0',
        cadence: 'forever',
        description: 'For teams that want to estimate fast, debate better, and walk out aligned.',
        features: [
          'Unlimited rooms',
          'Unlimited players',
          'Full reveal scoreboard',
          'Exportable session recap',
          'Anonymous sign-in',
          'Sub-second real-time',
        ],
        cta: 'Start a game',
        href: '/app',
        highlight: true,
      },
      {
        name: 'Studio (soon)',
        price: 'Coming',
        cadence: '',
        description: 'For organisations that want history and tool integrations.',
        features: [
          'Persistent session history',
          'Jira / Linear / GitHub integrations',
          'Custom estimation scales (t-shirt, powers of 2…)',
          'SSO and workspaces',
          'Priority support',
        ],
        cta: 'Notify me at launch',
        href: 'mailto:hello@scrumbler.app?subject=Scrumbler%20Studio',
        highlight: false,
      },
    ],
    note: 'No credit card, no trial period. You use Scrumbler, or you don’t.',
  },
  changelog: {
    eyebrow: 'Changelog',
    title: 'What we shipped recently.',
    lead: 'Most recent first, versioned at every meaningful milestone.',
    entries: [
      {
        version: '0.4.0',
        date: '2026-05-22',
        title: 'Brand pack & marketing site',
        items: [
          'Visual identity locked: logo, palette, typography, official voice.',
          'Marketing site shipped: landing, pricing, changelog, legal.',
          'Favicons, OpenGraph, PWA manifest.',
        ],
      },
      {
        version: '0.3.0',
        date: '2026-04-30',
        title: 'Session recap',
        items: [
          'Story timeline with per-round vote snapshots.',
          'Markdown export and one-click copy.',
          'One-click re-vote straight from the timeline.',
        ],
      },
      {
        version: '0.2.0',
        date: '2026-04-12',
        title: 'Reveal Dashboard',
        items: [
          'Tiered scoreboard (Easy / Medium / Hard / Epic).',
          'Automatic outlier detection: discussion suggested, never imposed.',
          'Reveal confetti.',
        ],
      },
      {
        version: '0.1.0',
        date: '2026-03-20',
        title: 'Public V1',
        items: [
          'Real-time rooms via Supabase Realtime.',
          'Scrum Master and Developer roles.',
          'Full Fibonacci card set (1 to 21, ?, ☕).',
        ],
      },
    ],
  },
  legal: {
    privacy: {
      title: 'Privacy policy',
      updated: 'Updated 22 May 2026.',
      body: [
        { h: 'In short', p: 'Scrumbler is anonymous by default. We don’t ask for an email, a legal name, or a phone number. No ad cookies, no third-party trackers.' },
        { h: 'What we collect', p: 'A nickname and an emoji avatar you pick yourself. Your votes during the session. A technical player ID stored locally in your browser.' },
        { h: 'Where it lives', p: 'On Supabase, in Europe. Idle rooms are purged automatically.' },
        { h: 'Your rights', p: 'You can leave a room at any time, your player record is deleted. For anything else, reach out at hello@scrumbler.app.' },
      ],
    },
    terms: {
      title: 'Terms of service',
      updated: 'Updated 22 May 2026.',
      body: [
        { h: 'Service', p: 'Scrumbler is a planning poker provided "as is". No SLA is attached to the free tier.' },
        { h: 'Behaviour', p: 'Respectful nicknames and messages. No harassment, no illegal content. Abuse leads to a room block.' },
        { h: 'Liability', p: 'You use Scrumbler to estimate, not to store critical data. No long-term backup is guaranteed in V1.' },
        { h: 'Changes', p: 'These terms may evolve. The current version applies from the date shown above.' },
      ],
    },
    cookies: {
      title: 'Cookies',
      updated: 'Updated 22 May 2026.',
      body: [
        { h: 'What we use', p: 'Strict minimum: a local session identifier so a page refresh doesn’t boot you out of your room.' },
        { h: 'No ads', p: 'No advertising cookies. No Google Analytics. No cross-site tracking.' },
        { h: 'Opt out', p: 'You can clear your browser’s local storage at any time, that just signs you out of the current room.' },
      ],
    },
  },
} as const
