import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n/locales'

type Props = {
  locale: Locale
  size?: number
  variant?: 'horizontal' | 'mark' | 'vertical'
  theme?: 'light' | 'dark'
  className?: string
}

// BRAND.md §6.2 official lockup. Tilt is baked into the SVG, do not rotate.
// theme="dark" picks the dark-surface variant of the horizontal lockup.
export function Lockup({ locale, size = 40, variant = 'horizontal', theme = 'light', className }: Props) {
  let src: string
  if (variant === 'mark') src = '/brand/logo/logo-mark.svg'
  else if (variant === 'vertical') src = '/brand/logo/logo-vertical.svg'
  else src = theme === 'dark'
    ? '/brand/logo/logo-horizontal-dark.svg'
    : '/brand/logo/logo-horizontal.svg'

  const width = variant === 'mark' ? size : size * 4.2
  const height = variant === 'mark' ? size : size

  return (
    <Link
      href={`/${locale}`}
      aria-label="Scrumbler"
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
    >
      <Image
        src={src}
        alt="Scrumbler"
        width={width}
        height={height}
        priority
        style={{ height: size, width: 'auto' }}
      />
    </Link>
  )
}
