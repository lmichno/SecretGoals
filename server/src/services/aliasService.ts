import { randomInt } from 'node:crypto'
import prisma from '../prisma.js'

// Przymiotniki i rzeczowniki w rodzaju męskim, żeby alias był poprawny gramatycznie.
const ADJECTIVES = [
  'Cichy',
  'Szybki',
  'Mądry',
  'Spokojny',
  'Dzielny',
  'Wytrwały',
  'Bystry',
  'Sprytny',
  'Pogodny',
  'Odważny',
  'Zwinny',
  'Skryty',
  'Nocny',
  'Leśny',
  'Górski',
  'Złoty',
  'Srebrny',
  'Błękitny',
  'Zielony',
  'Ciepły',
  'Wesoły',
  'Silny',
  'Ambitny',
  'Uważny',
  'Pilny',
  'Rześki',
  'Jasny',
  'Mglisty',
  'Polarny',
  'Wierny',
]

const NOUNS = [
  'Lis',
  'Wilk',
  'Sokół',
  'Jeż',
  'Borsuk',
  'Żuraw',
  'Bóbr',
  'Ryś',
  'Orzeł',
  'Kruk',
  'Dzik',
  'Łoś',
  'Zając',
  'Delfin',
  'Pingwin',
  'Tygrys',
  'Niedźwiedź',
  'Jastrząb',
  'Kot',
  'Puchacz',
  'Wróbel',
  'Słowik',
  'Dąb',
  'Klon',
  'Kamień',
  'Strumień',
  'Wiatr',
  'Księżyc',
  'Meteor',
  'Szczyt',
]

const MAX_ATTEMPTS = 20

function pick<T>(items: readonly T[]): T {
  return items[randomInt(items.length)] as T
}

function randomAlias(digits: number): string {
  const min = 10 ** (digits - 1)
  return `${pick(ADJECTIVES)}${pick(NOUNS)}${randomInt(min, min * 10)}`
}

/**
 * Losuje alias w formacie przymiotnik + rzeczownik + liczba (np. "CichyLis42") i sprawdza,
 * czy nikt go jeszcze nie ma (ADR-007). Gdy krótkie warianty się kończą, wydłuża liczbę.
 */
export async function generateUniqueAlias(): Promise<string> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const alias = randomAlias(attempt < MAX_ATTEMPTS / 2 ? 2 : 4)
    const taken = await prisma.user.findUnique({ where: { alias }, select: { id: true } })
    if (!taken) return alias
  }
  throw new Error('Nie udało się wygenerować unikalnego aliasu')
}
