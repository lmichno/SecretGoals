/**
 * Inicjały z aliasu: „Anon_Falcon92” -> „AF”, „CichyLis42” -> „CL”.
 * Serwer generuje aliasy CamelCase, prototyp pokazuje aliasy z „_”, więc obsługujemy oba zapisy.
 */
export function initialsFromAlias(alias: string): string {
  const parts = alias.split('_').filter(Boolean)
  const source =
    parts.length > 1 ? parts.map((part) => part[0] ?? '') : (alias.match(/\p{Lu}/gu) ?? [])
  const initials = source.join('').slice(0, 2)
  return (initials || alias.slice(0, 1)).toUpperCase()
}
