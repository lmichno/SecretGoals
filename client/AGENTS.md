# Instrukcje dla asystentów AI: frontend Secret Goals

Pracujesz nad frontendem (React 19 + Vite + Tailwind CSS v4, TypeScript). Zanim napiszesz kod UI:

1. Przeczytaj [`../docs/prototypes/UI_GUIDE.md`](../docs/prototypes/UI_GUIDE.md) (zasady, czego nie robić, mapa ekranów).
2. Obejrzyj zrzut ekranu, który odtwarzasz: [`../docs/prototypes/v2-ui/screenshots/`](../docs/prototypes/v2-ui/screenshots/).
3. Dokładne wartości weź ze źródła ekranu w [`../docs/prototypes/v2-ui/`](../docs/prototypes/v2-ui/) (`*.dc.html`).
4. Kolory, fonty i zaokrąglenia są w [`src/index.css`](src/index.css), opis w
   [`../docs/design/DESIGN_SYSTEM.md`](../docs/design/DESIGN_SYSTEM.md).

Najważniejsze reguły:

- Tylko TypeScript (`.tsx` / `.ts`), bez `any`.
- Tylko tokeny motywu: `bg-bg`, `bg-surface`, `bg-surface-2`, `border-border`, `text-text`, `text-muted`,
  `bg-accent text-accent-ink`, `bg-support text-support-ink`, `rounded-control`, `rounded-card`, `text-body`, `font-display`.
  Domyślna paleta Tailwinda (`slate`, `gray`, `indigo`, `blue`, `white`, `black`) jest wyłączona i nie działa.
- Najpierw komponenty z [`src/components/ui`](src/components/ui/) (`Button`, `Card`, `TextField`, `GoalPill`, `StatTile`,
  `ProgressBar`, `Avatar`, `InfoNote`, `SegmentedControl`, `IconTile`, `Badge`, `FilterChip`, `Overline`).
- Ikony tylko z `lucide-react`. Bez cieni, gradientów, `backdrop-blur`, bibliotek komponentów i jasnego motywu.
- Teksty po polsku, przepisane z prototypu. Użytkownik jest anonimowy: tylko alias i inicjały, bez e-maila i zdjęć.
- Nie wymyślaj ekranów ani funkcji spoza prototypu.
- Przed oddaniem: `npm run typecheck` i `npm run lint`.
