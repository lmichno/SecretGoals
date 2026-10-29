# Przewodnik UI dla frontendu (także dla asystentów AI)

Ten plik mówi, **jak ma wyglądać** aplikacja i **jak ją budować**. Zanim napiszesz lub zmienisz
jakikolwiek ekran w `client/`, przeczytaj go w całości i obejrzyj zrzut ekranu, który odtwarzasz.

## 1. Źródła prawdy (w tej kolejności)

1. **Zrzuty PNG** w [`v2-ui/screenshots/`](v2-ui/screenshots/): tak ma wyglądać wynik. Porównuj z nimi swoją pracę.
2. **Źródła HTML** w [`v2-ui/`](v2-ui/) (`*.dc.html`): dokładne wartości (odstępy, rozmiary, teksty, stany).
   Wszystkie style są inline, więc łatwo je odczytać. Format pliku opisuje punkt 6.
3. **Tokeny i komponenty**: [`client/src/index.css`](../../client/src/index.css),
   [`client/src/components/ui/`](../../client/src/components/ui/), opis w
   [`docs/design/DESIGN_SYSTEM.md`](../design/DESIGN_SYSTEM.md).
4. Interaktywny prototyp (wymaga konta claude.ai): https://claude.ai/artifact/UHzWL2uCYZhz1JscS3Xvne

Prototypy `prototype-final-alpha.html`, `prototype-final-beta.html` i `secretgoals_prot 1 i 2 old preview.html`
są **przestarzałe**. Nie bierz z nich wyglądu.

## 2. Mapa ekranów

Zrzuty są w skali 2× (Retina). Mobile: szerokość 390 px, desktop: 1440 px.

| Ekran                | Źródło                     | Zrzuty                                                                                                                |
| :------------------- | :------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| Logowanie, mobile    | `Auth.dc.html`             | `mobile-auth-login.png`, `mobile-auth-register.png`, `mobile-auth-register-scrolled.png`                              |
| Logowanie, desktop   | `DesktopAuth.dc.html`      | `desktop-auth-login.png`, `desktop-auth-register.png`                                                                 |
| Cele, mobile         | `Main.dc.html`             | `mobile-goals.png`, `mobile-goals-scrolled-mid.png`, `mobile-goals-scrolled-end.png`, `mobile-goals-guides-popup.png` |
| Cele, desktop        | `DesktopGoals.dc.html`     | `desktop-goals.png`, `desktop-goals-guides-popup.png`                                                                 |
| Społeczność, mobile  | `Community.dc.html`        | `mobile-community-1.png` … `mobile-community-4.png` (kolejne wpisy feedu)                                             |
| Społeczność, desktop | `DesktopCommunity.dc.html` | `desktop-community.png`, `desktop-community-2.png`                                                                    |
| Profil, mobile       | `Profile.dc.html`          | `mobile-profile.png`, `mobile-profile-scrolled-end.png`                                                               |
| Profil, desktop      | `DesktopProfile.dc.html`   | `desktop-profile.png`                                                                                                 |

Pliki `*-scrolled-*` pokazują dalszą część tego samego ekranu (ekran przewija się w pionie).
Na mobile dolna nawigacja jest zawsze przyklejona do dołu.

## 3. Zasady obowiązkowe

1. **TypeScript** (`.tsx`, `.ts`). Żadnych plików `.js` / `.jsx`. Bez `any`.
2. **Stylowanie tylko Tailwindem z tokenami motywu**: `bg-surface`, `text-muted`, `border-border`,
   `bg-accent text-accent-ink`, `rounded-card`, `text-body`, `font-display`. Pełna lista w `DESIGN_SYSTEM.md`.
3. **Najpierw gotowe komponenty** z `client/src/components/ui` (`Button`, `Card`, `TextField`, `GoalPill`,
   `StatTile`, `ProgressBar`, `Avatar`, `InfoNote`, `SegmentedControl` …). Nie pisz drugiego przycisku ani karty od zera.
4. **Ikony tylko z `lucide-react`** (np. `Flame`, `Target`, `Heart`, `BookOpen`, `Check`, `RotateCcw`, `Bell`,
   `Users`, `User`, `Shield`, `Plus`, `Send`, `MessageCircle`, `Bookmark`, `X`, `Eye`).
5. **Teksty po polsku**, przepisane z prototypu. Słownictwo: cel, seria, kamień milowy, meldunek,
   potknięcie, „Wspieram” (wsparcie), Społeczność, poradnik.
6. **Zielony = postęp i główna akcja, niebieski = wsparcie.** Na jednej karcie najwyżej jeden zielony przycisk.
7. **Anonimowość**: użytkownik ma tylko alias i awatar z inicjałami. Nigdy nie pokazuj e-maila,
   imienia, zdjęcia profilowego ani „avatarów” z internetu.
8. **Responsywność**: jeden komponent ekranu dla obu rozmiarów, przełączany klasami `lg:` (od 1024 px).
   Mobile: dolna nawigacja. Desktop: pasek boczny 240 px.
9. **Dostępność**: `aria-label` przy przyciskach z samą ikoną, `<label>` przy każdym polu,
   cele dotyku min. 44 × 44 px, `aria-current="page"` w nawigacji.

## 4. Czego NIE robić

- ❌ Klas domyślnej palety Tailwinda: `bg-slate-*`, `bg-gray-*`, `text-indigo-*`, `bg-blue-500`, `text-white`,
  `bg-black` itd. Są wyłączone w motywie i **nic nie zrobią**.
- ❌ Kolorów w kodzie (`#5BD69B`, `style={{ color: ... }}`, `bg-[#...]`). Kolor zawsze z tokenu.
  Wyjątek: dynamiczna szerokość paska postępu w `style`.
- ❌ Cieni (`shadow-*`), gradientów, rozmyć (`backdrop-blur`), efektu „glassmorphism”, neonowych poświat.
- ❌ Jasnego motywu ani przełącznika motywu. Aplikacja jest tylko ciemna.
- ❌ Innych fontów niż Inter i Bricolage Grotesque, innych bibliotek ikon, emoji jako ikon.
- ❌ Bibliotek komponentów (MUI, Chakra, shadcn, Bootstrap, DaisyUI, Ant Design) i innych bibliotek CSS.
- ❌ Domyślnych zaokrągleń Tailwinda (`rounded-lg`, `rounded-xl`, `rounded-2xl`). Używaj `rounded-control`,
  `rounded-card` itd.
- ❌ Animacji ozdobnych (podskakujące elementy, konfetti, pulsujące przyciski).
- ❌ Wymyślania nowych ekranów, sekcji, funkcji i tekstów, których nie ma w prototypie. Jeśli czegoś
  brakuje, zapytaj zespół, zamiast zgadywać.
- ❌ Angielskich tekstów w UI („Submit”, „Like”, „Loading…”).
- ❌ Słów „like”, „polubienie”, „porażka”. Mamy „Wspieram” i „Potknięcie”.

## 5. Wzorce, które powtarzają się na ekranach

- **Nagłówek mobile (Cele, Profil):** awatar 36 px `bg-surface-3` z inicjałami w `text-accent-light`, nad aliasem
  podpis „Twój alias” (`text-caption text-muted`), po prawej `IconButton` z dzwonkiem.
- **Przełącznik celów:** poziomy, przewijany rząd `GoalPill` (`scrollbar-none overflow-x-auto`), na końcu
  przycisk 44 × 44 z `Plus` i obramowaniem `border-dashed border-border-strong`.
- **Karta celu:** `Overline` (kategoria · typ), tytuł `text-heading font-bold`, odznaka widoczności po prawej,
  `IconTile size="xl"` z `Flame` + liczba `text-stat` (lg: `text-stat-lg`), `ProgressBar`, podpowiedź
  `text-caption text-muted`, siatka 3 × `StatTile`, tydzień (7 kółek 32 px), przycisk „Strategie i poradniki”.
- **Dni tygodnia:** zaliczony `bg-accent text-accent-ink` z ikoną `Check`; opuszczony `bg-surface-2 border-border-strong`;
  dziś `border-2 border-accent` bez tła; przyszły `bg-surface border-dashed border-border-strong`. Zaokrąglenie 10 px.
- **Aktualizacja postępu** zależy od typu celu: seria dzienna: „Zaliczone na dziś” (`primary`) + „Potknięcie” (`outline`);
  cel kwotowy: „+100 zł”, „+500 zł” (`secondary`) + „Inna kwota” (`primary`); licznik tygodniowy: „+1”.
- **Dialog „Strategie i poradniki”:** tło `bg-overlay`, panel `bg-surface rounded-t-sheet` przyklejony do dołu na mobile,
  wyśrodkowany na desktopie; w środku kafelki `bg-surface-2 rounded-tile` z `Badge tone="accent-soft"`.
- **Wpis w feedzie:** pełna wysokość ekranu, tło z tokenu `post-*` wg typu, treść przy dolnej krawędzi,
  po prawej kolumna przycisków 48 px (`rounded-tile bg-bg/35`): serce (aktywne: `bg-support text-support-ink`),
  komentarze, zapisz. Na górze tytuł „Społeczność”, przycisk „Wpis” i rząd `FilterChip`.
- **Nawigacja dolna (mobile):** wysokość 84 px, `bg-chrome border-t border-border`, ikona 24 px nad etykietą `text-caption`,
  aktywna `text-accent font-semibold`, pozostałe `text-muted`.
- **Pasek boczny (desktop):** `bg-chrome border-r border-border`, logo `font-display text-title font-extrabold`,
  elementy 44 px `rounded-chip`, aktywny `bg-accent-subtle text-accent`, na dole karta z aliasem.

## 6. Jak czytać pliki `.dc.html`

To pliki edytora prototypów. Nie otwierają się poprawnie bezpośrednio w przeglądarce (brakuje środowiska
`support.js`), ale są czytelne jako tekst:

- Wewnątrz `<x-dc>` jest zwykły HTML z inline `style`. To dokładny wygląd.
- `{{nazwa}}` to wartość liczona w skrypcie na dole pliku (`class Component extends DCLogic`, metoda `renderVals()`).
  Tam są teksty, przykładowe dane i style stanów (np. `pillOn` / `pillOff`, `tabOn` / `tabOff`).
- `<sc-for list="{{items}}" as="it">` to pętla (w React: `items.map`), `<sc-if value="{{cond}}">` to warunek.
- Przy przepisywaniu na React zamień kolory hex na tokeny (tabela w `DESIGN_SYSTEM.md`), a powtarzające się
  bloki na komponenty z `components/ui`.

## 7. Lista kontrolna przed oddaniem ekranu

- [ ] Zrzut mojego ekranu wygląda jak odpowiedni PNG z `v2-ui/screenshots/` (mobile 390 px i desktop 1440 px).
- [ ] W kodzie nie ma żadnego hexa, `slate`, `gray`, `indigo`, `blue`, `white`, `shadow`, `rounded-lg/xl`.
- [ ] Użyłem komponentów z `components/ui` tam, gdzie pasują.
- [ ] Wszystkie teksty są po polsku i pochodzą z prototypu.
- [ ] `npm run typecheck` i `npm run lint` przechodzą bez błędów.
