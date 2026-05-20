import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sprint Poker Planning',
  description: 'Planning poker en temps réel pour vos sprints agiles',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
