import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge musi znać nazwy z motywu (index.css). Bez tego np. `text-body` i `text-muted`
 * zostałyby uznane za dwa kolory i jedna z klas by zniknęła.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'tiny',
        'caption',
        'small',
        'ui',
        'body',
        'body-lg',
        'label-lg',
        'title',
        'heading',
        'heading-lg',
        'page',
        'stat',
        'stat-lg',
        'hero',
      ],
      radius: ['xs', 'chip', 'control', 'tile', 'panel', 'icon', 'card', 'sheet', 'full'],
      font: ['sans', 'display'],
    },
  },
})

/**
 * Łączy klasy CSS, pomijając puste wartości: cn('a', warunek && 'b').
 * Przy konflikcie wygrywa klasa podana później, np. cn('inline-flex', 'hidden') → 'hidden'.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return twMerge(classes)
}
