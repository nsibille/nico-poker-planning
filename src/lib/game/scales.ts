export type ScaleUnit = 'points' | 'days' | 'tshirt' | 'custom'

export interface EstimationScale {
  id: string
  name: string
  unit: ScaleUnit
  values: (number | string)[]
}

export const SPECIAL_VALUES = new Set(['?', '☕'])

export const PREDEFINED_SCALES: Record<string, EstimationScale> = {
  fibonacci: {
    id: 'fibonacci',
    name: 'Fibonacci (points)',
    unit: 'points',
    values: [0, 1, 2, 3, 5, 8, 13, 21, 40, 100, '?', '☕'],
  },
  jh: {
    id: 'jh',
    name: 'Jours-homme',
    unit: 'days',
    values: [0.1, 0.5, 1, 2, 3, 5, 8, 13, 21, '?', '☕'],
  },
  tshirt: {
    id: 'tshirt',
    name: 'T-shirt',
    unit: 'tshirt',
    values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕'],
  },
  powers: {
    id: 'powers',
    name: 'Puissances de 2',
    unit: 'points',
    values: [1, 2, 4, 8, 16, 32, '?', '☕'],
  },
}

export const PREDEFINED_SCALE_IDS = ['fibonacci', 'jh', 'tshirt', 'powers'] as const

export function parseCustomValues(raw: string): (number | string)[] {
  const seen = new Set<string>()
  const out: (number | string)[] = []
  for (const token of raw.split(',').map(s => s.trim()).filter(Boolean)) {
    if (seen.has(token)) continue
    seen.add(token)
    const n = Number(token)
    out.push(!Number.isNaN(n) && token !== '' ? n : token)
  }
  return out
}

/**
 * Construit l'échelle à utiliser pour une room donnée. Pour `custom`, on
 * ajoute `?` et `☕` à la fin si l'admin ne les a pas inclus, et on auto-détecte
 * si l'échelle est numérique (toutes les valeurs hors `?`/`☕` sont des nombres).
 */
export function getScale(scaleId: string | null | undefined, customValues: (number | string)[] | null | undefined): EstimationScale {
  if (scaleId === 'custom') {
    const base = customValues ?? []
    const withSpecials = [...base]
    if (!withSpecials.some(v => String(v) === '?')) withSpecials.push('?')
    if (!withSpecials.some(v => String(v) === '☕')) withSpecials.push('☕')
    const numericish = base.every(v => typeof v === 'number')
    return {
      id: 'custom',
      name: 'Personnalisée',
      unit: numericish && base.length > 0 ? 'points' : 'custom',
      values: withSpecials,
    }
  }
  return PREDEFINED_SCALES[scaleId ?? 'fibonacci'] ?? PREDEFINED_SCALES.fibonacci
}

export function isNumericScale(scale: EstimationScale): boolean {
  return scale.unit === 'points' || scale.unit === 'days'
}

export function unitLabel(unit: ScaleUnit): string {
  if (unit === 'points') return 'pts'
  if (unit === 'days') return 'JH'
  return ''
}

/** Valeurs "actives" — sans `?`/`☕`. */
export function activeValues(scale: EstimationScale): (number | string)[] {
  return scale.values.filter(v => !SPECIAL_VALUES.has(String(v)))
}

/** Sous-ensemble numérique trié — utile pour l'axe du chart et l'arrondi JH. */
export function numericValues(scale: EstimationScale): number[] {
  return activeValues(scale)
    .filter((v): v is number => typeof v === 'number')
    .slice()
    .sort((a, b) => a - b)
}

/** Renvoie la plus petite carte de l'échelle >= value (utilisé pour l'arrondi JH). */
export function roundUpToScaleCard(scale: EstimationScale, value: number): number | null {
  const nums = numericValues(scale)
  for (const n of nums) if (n >= value) return n
  return nums.length > 0 ? nums[nums.length - 1] : null
}
