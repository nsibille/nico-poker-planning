import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n/locales'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scrumbler.app'

const paths = ['', '/pricing', '/changelog', '/legal/privacy', '/legal/terms', '/legal/cookies']

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return locales.flatMap(locale =>
    paths.map(path => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map(alt => [alt, `${baseUrl}/${alt}${path}`]),
        ),
      },
    })),
  )
}
