import { NextResponse, type NextRequest } from 'next/server'
import { LOCALE_COOKIE } from '@/lib/i18n/locale-cookie'
import { isLocale } from '@/lib/i18n/locales'

// Quand l'utilisateur visite une page marketing localisée (/fr, /en, et leurs
// sous-pages), on mémorise cette langue dans un cookie. L'app non localisée
// (/app, /room/[roomId]) le relit pour rester dans la même langue tout au long
// du parcours.
export function middleware(req: NextRequest) {
  const segment = req.nextUrl.pathname.split('/')[1]
  if (!isLocale(segment)) return NextResponse.next()

  const res = NextResponse.next()
  if (req.cookies.get(LOCALE_COOKIE)?.value !== segment) {
    res.cookies.set(LOCALE_COOKIE, segment, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }
  return res
}

export const config = {
  // On ne cible que les routes marketing localisées, pas les assets ni l'API.
  matcher: ['/fr/:path*', '/en/:path*', '/fr', '/en'],
}
