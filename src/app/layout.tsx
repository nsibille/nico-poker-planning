import type { Metadata, Viewport } from 'next'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scrumbler.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Scrumbler · Le planning poker qui réveille l’équipe',
    template: '%s · Scrumbler',
  },
  description:
    'Estime vite, débat franchement, aligne pour de bon. Vote anonyme, calcul auto, et un rituel d’estimation qui devient enfin un bon moment.',
  applicationName: 'Scrumbler',
  authors: [{ name: 'Scrumbler' }],
  keywords: [
    'planning poker',
    'scrum poker',
    'estimation agile',
    'sprint planning',
    'fibonacci',
    'équipes agiles',
    'scrum master',
    'developer',
  ],
  manifest: '/brand/favicon/site.webmanifest',
  icons: {
    icon: [
      { url: '/brand/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/favicon/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/brand/favicon/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Scrumbler',
    title: 'Scrumbler · Le planning poker qui réveille l’équipe',
    description:
      'Estime vite, débat franchement, aligne pour de bon. Vote anonyme, calcul auto, rituel enfin vivant.',
    url: siteUrl,
    images: [
      {
        url: '/brand/social/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Scrumbler · Le planning poker qui réveille l’équipe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scrumbler · Le planning poker qui réveille l’équipe',
    description:
      'Estime vite, débat franchement, aligne pour de bon. Vote anonyme, calcul auto, rituel enfin vivant.',
    images: ['/brand/social/twitter-card.png'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#4970FF',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
