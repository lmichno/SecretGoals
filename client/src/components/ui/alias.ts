/** Inicjały z aliasu: „Anon_Falcon92” -> „AF”. */
export function initialsFromAlias(alias: string): string {
  return alias
    .split('_')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
