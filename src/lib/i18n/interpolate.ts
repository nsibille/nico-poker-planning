// Remplace les jetons {clé} d'un gabarit par les valeurs fournies.
// Ex: fmt('Round {n}', { n: 3 }) => 'Round 3'.
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  )
}
