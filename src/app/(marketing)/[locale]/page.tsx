import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Hero } from '@/components/marketing/sections/Hero'
import { ProblemSolution } from '@/components/marketing/sections/ProblemSolution'
import { FeatureGrid } from '@/components/marketing/sections/FeatureGrid'
import { HowItWorks } from '@/components/marketing/sections/HowItWorks'
import { PricingTeaser } from '@/components/marketing/sections/PricingTeaser'
import { FAQ } from '@/components/marketing/sections/FAQ'
import { FinalCTA } from '@/components/marketing/sections/FinalCTA'
import { getDictionary } from '@/lib/i18n/dict'
import { isLocale } from '@/lib/i18n/locales'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: '/fr', en: '/en' },
    },
  }
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Scrumbler',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: dict.meta.description,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero locale={locale} dict={dict.hero} loop={dict.heroLoop} />
      <ProblemSolution dict={dict.problem} />
      <FeatureGrid dict={dict.features} />
      <HowItWorks dict={dict.how} />
      <PricingTeaser locale={locale} dict={dict.pricingTeaser} />
      <FAQ dict={dict.faq} />
      <FinalCTA dict={dict.finalCta} />
    </>
  )
}
