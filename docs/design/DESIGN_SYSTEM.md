# Design system Secret Goals

Ten dokument opisuje motyw aplikacji wyciągnięty z prototypu UI v2. Jest jedynym źródłem
prawdy dla kolorów, typografii, zaokrągleń i podstawowych komponentów frontendu.

- Tokeny w kodzie: [`client/src/index.css`](../../client/src/index.css) (blok `@theme`, Tailwind CSS v4).
- Gotowe komponenty: [`client/src/components/ui/`](../../client/src/components/ui/).
- Wygląd ekranów (zrzuty PNG, źródła HTML): [`docs/prototypes/UI_GUIDE.md`](../prototypes/UI_GUIDE.md).

## Charakter

Ciemny, spokojny interfejs z jednym zielonym akcentem. Aplikacja dotyczy trudnych, często
wstydliwych celów (nałogi, długi), więc wygląd ma być dyskretny i poważny, a nie krzykliwy.
Zielony oznacza postęp i główną akcję, niebieski oznacza wsparcie od innych ludzi. Nic poza
tym nie dostaje mocnego koloru.

## Kolory

Domyślna paleta Tailwinda jest wyłączona (`--color-*: initial`). Klasy typu `bg-slate-800`,
`text-indigo-400` czy `bg-blue-500` nie działają. Używamy tylko nazw z tabel poniżej, w
dowolnym narzędziu Tailwinda: `bg-*`, `text-*`, `border-*`, `outline-*`, `fill-*` itd.

### Tła i powierzchnie

| Token       | Hex                | Klasa          | Gdzie                                                                  |
| :---------- | :----------------- | :------------- | :--------------------------------------------------------------------- |
| `bg`        | `#0F1115`          | `bg-bg`        | tło strony                                                             |
| `chrome`    | `#12151A`          | `bg-chrome`    | dolna nawigacja (mobile), pasek boczny (desktop), lewy panel logowania |
| `surface`   | `#181B21`          | `bg-surface`   | karty, pola formularzy, dialog, nieaktywne pigułki celów               |
| `surface-2` | `#22262E`          | `bg-surface-2` | kafelki statystyk, przyciski drugorzędne, kafelki w dialogu            |
| `surface-3` | `#2A2F3A`          | `bg-surface-3` | awatar w nagłówku, tor paska postępu, nieaktywna odznaka               |
| `overlay`   | `rgb(5 6 8 / .72)` | `bg-overlay`   | przyciemnienie pod dialogiem                                           |

### Obramowania

| Token           | Hex       | Klasa                  | Gdzie                                                                             |
| :-------------- | :-------- | :--------------------- | :-------------------------------------------------------------------------------- |
| `border`        | `#2C313A` | `border-border`        | domyślne, 1 px, na kartach, polach i przyciskach                                  |
| `border-strong` | `#3A404B` | `border-border-strong` | przycisk obrysowany („Potknięcie”), przyszły dzień (dashed), „dodaj cel” (dashed) |

### Tekst

| Token            | Hex       | Klasa                 | Gdzie                                         |
| :--------------- | :-------- | :-------------------- | :-------------------------------------------- |
| `text`           | `#F3F1EC` | `text-text`           | tekst główny (ciepła biel, nie `#FFF`)        |
| `text-soft`      | `#DAD7D0` | `text-text-soft`      | treść na kolorowych kartach feedu             |
| `text-secondary` | `#C9CED8` | `text-text-secondary` | etykiety pól, tekst przycisków drugorzędnych  |
| `muted`          | `#A3A9B5` | `text-muted`          | podpisy, opisy, nieaktywne zakładki nawigacji |

### Akcent zielony (postęp, główne akcje)

| Token            | Hex       | Klasa                 | Gdzie                                                             |
| :--------------- | :-------- | :-------------------- | :---------------------------------------------------------------- |
| `accent`         | `#5BD69B` | `bg-accent`           | przycisk główny, pasek postępu, zaliczony dzień, aktywna zakładka |
| `accent-light`   | `#8BE5B8` | `text-accent-light`   | linki, procent postępu, nadtytuł z akcentem                       |
| `accent-lighter` | `#B9F0D2` | `text-accent-lighter` | hover linków                                                      |
| `accent-ink`     | `#06180F` | `text-accent-ink`     | tekst i ikony na zielonym tle (nigdy biały)                       |
| `accent-soft`    | `#173527` | `bg-accent-soft`      | kafelek ikony, awatar „accent”, karta kamienia milowego           |
| `accent-subtle`  | `#13291F` | `bg-accent-subtle`    | aktywny element nawigacji bocznej, wybrana pigułka celu           |

### Niebieski (tylko wsparcie i prywatność)

| Token           | Hex       | Klasa                | Gdzie                                                      |
| :-------------- | :-------- | :------------------- | :--------------------------------------------------------- |
| `support`       | `#8AB4FF` | `bg-support`         | przycisk „Wspieram”, ikona tarczy, aktywne serce w feedzie |
| `support-ink`   | `#0B1626` | `text-support-ink`   | tekst na niebieskim tle                                    |
| `support-soft`  | `#1B2638` | `bg-support-soft`    | boks o prywatności, kafelek „osób wspiera”                 |
| `support-text`  | `#C9D6EE` | `text-support-text`  | tekst w boksie o prywatności                               |
| `support-muted` | `#B8C8E6` | `text-support-muted` | podpis w kafelku wsparcia, stan „Wspierasz”                |

### Pozostałe

| Token            | Hex       | Gdzie                                                                |
| :--------------- | :-------- | :------------------------------------------------------------------- |
| `danger`         | `#F2A7A7` | tekst akcji niebezpiecznej („Wyloguj”), komunikat błędu pola         |
| `danger-border`  | `#5A2E2E` | obramowanie przycisku „Wyloguj”, pola z błędem                       |
| `heat-mid`       | `#1E5A3E` | średni poziom w mapie aktywności (brak: `surface-2`, dużo: `accent`) |
| `post-milestone` | `#173527` | tło wpisu „Kamień milowy” w feedzie                                  |
| `post-guide`     | `#16273D` | tło wpisu „Poradnik”                                                 |
| `post-checkin`   | `#2B2238` | tło wpisu „Meldunek”                                                 |
| `post-goal`      | `#33261B` | tło wpisu „Nowy cel”                                                 |

Na kolorowych kartach feedu elementy nakładane mają półprzezroczyste tła: etykieta
`bg-black/30` nie działa (brak `black`), więc używamy `bg-bg/40`, przyciski akcji `bg-bg/35`,
awatar `bg-text/15`, tor paska `bg-text/15`, wypełnienie paska `bg-text`.

## Typografia

Dwa fonty z Google Fonts, załadowane w `client/index.html`:

- **Bricolage Grotesque** (`font-display`, wagi 500/700/800): nagłówki, nazwa aplikacji, duże liczby
  (seria, statystyki). `h1`, `h2`, `h3` dostają go automatycznie.
- **Inter** (`font-sans`, wagi 400/500/600/700): cały pozostały tekst, przyciski, pola.

| Klasa                        | Rozmiar    | Użycie                                                                           |
| :--------------------------- | :--------- | :------------------------------------------------------------------------------- |
| `text-tiny`                  | 11 px      | podpis w kafelku statystyki, dni tygodnia, małe odznaki                          |
| `text-caption`               | 12 px      | nadtytuły (UPPERCASE, `tracking-[0.06em]`, 600), meta, etykiety dolnej nawigacji |
| `text-small`                 | 13 px      | etykiety pól, linki pomocnicze, tekst w boksie informacyjnym                     |
| `text-ui`                    | 14 px      | przyciski 44 px, pigułki celów, opis pod licznikiem                              |
| `text-body`                  | 15 px      | tekst podstawowy, pola formularzy, przyciski 48 px, nawigacja boczna             |
| `text-body-lg`               | 16 px      | przycisk główny 52 px, treść wpisu w feedzie, „Jak dziś idzie?”                  |
| `text-label-lg`              | 17 px      | alias, tytuły w liście zalet                                                     |
| `text-title`                 | 22 px      | tytuł ekranu na mobile („Społeczność”), logo w pasku bocznym                     |
| `text-heading`               | 26 px      | tytuł celu na mobile                                                             |
| `text-heading-lg`            | 30 px      | tytuł formularza na desktopie                                                    |
| `text-page`                  | 34 px      | tytuł strony na desktopie („Twoje cele”)                                         |
| `text-stat` / `text-stat-lg` | 48 / 60 px | licznik serii (mobile / desktop), waga 800, `tabular-nums`                       |
| `text-hero`                  | 96 px      | liczba na karcie kamienia milowego w feedzie                                     |

Wysokość linii: tekst ciągły `leading-[1.45]`–`leading-[1.5]`, nagłówki mają ją w tokenie (1.1).
Nagłówki mają wagę 700, nazwa aplikacji i duże liczby 800.

## Zaokrąglenia

Każdy element ma swój stopień. Nie używamy `rounded`, `rounded-lg`, `rounded-xl` z Tailwinda.

| Klasa             | Wartość | Element                                                               |
| :---------------- | :------ | :-------------------------------------------------------------------- |
| `rounded-[6px]`   | 6 px    | kratka mapy aktywności                                                |
| `rounded-[10px]`  | 10 px   | kółko dnia tygodnia (32 px)                                           |
| `rounded-chip`    | 12 px   | przyciski 40 px, element nawigacji bocznej, awatar 36 px              |
| `rounded-control` | 14 px   | przyciski 44–52 px, pola formularzy, pigułki celów, kafelki statystyk |
| `rounded-tile`    | 16 px   | boks informacyjny, przełącznik zakładek, przyciski w feedzie (48 px)  |
| `rounded-panel`   | 18 px   | boks aliasu, kafelek ikony 56 px                                      |
| `rounded-icon`    | 20 px   | kafelek ikony 64 px (płomień serii)                                   |
| `rounded-card`    | 24 px   | karty główne                                                          |
| `rounded-sheet`   | 28 px   | dialog (bottom sheet na mobile: tylko górne rogi)                     |
| `rounded-full`    | 999 px  | odznaki, filtry feedu, paski postępu                                  |

## Odstępy i rozmiary

- Padding kart: 20 px (`p-5`), odstęp między kartami: 14 px na mobile (`gap-3.5`), 20–24 px na desktopie.
- Odstęp wewnątrz karty: 16 px (`gap-4`); w formularzu: 14 px między polami.
- Margines ekranu na mobile: 20 px (`px-5`), na desktopie `clamp(16px, 4vw, 48px)`.
- Wysokości: przycisk główny 52 px (formularze) lub 48 px (karty), przycisk 44 px, mały 40 px,
  pole formularza 50 px, cel dotyku nie mniejszy niż 44 × 44 px.
- Ikony: Lucide (`lucide-react`), `strokeWidth` 2 (2.5 dla „check” i „plus” w przyciskach głównych),
  18–20 px w przyciskach, 24 px w nawigacji.
- Bez cieni (`shadow-*`) i bez gradientów. Głębię dają kolejne odcienie powierzchni i obramowanie 1 px.
  Jedyny gradient to zanikające tło pod nagłówkiem feedu (z `bg` do przezroczystości).

## Układ

- **Mobile (< 1024 px):** kolumna, dolna nawigacja 84 px (`bg-chrome`, `border-t`), 3 pozycje:
  Cele, Społeczność, Profil. Aktywna pozycja ma kolor `accent`, reszta `muted`.
- **Desktop (≥ 1024 px):** pasek boczny 240 px (`bg-chrome`, `border-r`) z logo, nawigacją i aliasem
  na dole; treść obok (`flex: 999 1 560px`). Na ekranie Cele dwie kolumny kart
  (`grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))]`), w Społeczności trzecia kolumna z komentarzami (320 px).
- Feed Społeczności to pełnoekranowe wpisy z `scroll-snap-type: y mandatory`, także na desktopie.

## Komponenty (`client/src/components/ui`)

Import: `import { Button, Card } from '../components/ui'`.

| Komponent          | Co to jest                                                                                                                                | Przykład z prototypu                                                                                 |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| `Button`           | warianty `primary`, `secondary`, `outline`, `ghost`, `support`, `danger`; rozmiary `sm` 40, `md` 44, `lg` 48, `xl` 52 px; `icon`, `block` | „Zaloguj się” (`xl`, `block`), „Zaliczone na dziś”, „Potknięcie” (`outline`), „Wspieram” (`support`) |
| `IconButton`       | kwadrat 44 px z samą ikoną, wymagany `label`                                                                                              | dzwonek, zamknięcie dialogu                                                                          |
| `Card`             | karta 24 px, `surface`, obramowanie, `p-5`, `gap-4`                                                                                       | karta celu, „Jak dziś idzie?”                                                                        |
| `Overline`         | nadtytuł 12 px, uppercase; `accent` dla zielonego                                                                                         | „NAŁÓG · SERIA DZIENNA”, „TWÓJ ANONIMOWY ALIAS”                                                      |
| `GoalPill`         | pigułka w przełączniku celów, z odznaką                                                                                                   | „Bez nikotyny · 18 dni”                                                                              |
| `Badge`            | mała pigułka: `neutral`, `accent`, `accent-soft`                                                                                          | „Publiczny”, „Kryzys” w poradnikach                                                                  |
| `FilterChip`       | filtr feedu (biały, gdy wybrany)                                                                                                          | „Dla Ciebie”, „Poradniki”                                                                            |
| `Avatar`           | inicjały aliasu, tony `neutral`, `accent`, `support`                                                                                      | „AF”, „SL”                                                                                           |
| `IconTile`         | zielony kafelek z ikoną, `md` 44, `lg` 56, `xl` 64 px                                                                                     | logo, płomień serii                                                                                  |
| `StatTile`         | liczba + podpis, ton `support` dla wsparcia                                                                                               | „18 najdłuższa seria”, „42 osób wspiera”                                                             |
| `ProgressBar`      | pasek 8 px z etykietą i procentem                                                                                                         | „18 / 21 dni do kamienia milowego”                                                                   |
| `TextField`        | etykieta, pole 50 px, `hint`, `error`, `labelAside`, `trailing`                                                                           | e-mail, hasło z przyciskiem oka                                                                      |
| `SegmentedControl` | przełącznik zakładek                                                                                                                      | „Logowanie / Rejestracja”                                                                            |
| `InfoNote`         | niebieski boks z tarczą                                                                                                                   | „E-mail służy tylko do logowania…”                                                                   |

Brakujące elementy (dzień tygodnia, mapa aktywności, element nawigacji, dialog, wpis w feedzie)
budujemy z tych samych tokenów, wzorując się na zrzutach i źródle HTML ekranu. Gdy element
powtarza się na dwóch ekranach, wydzielamy go do `components/`.

## Język i treść

- Cały interfejs po polsku, zwracamy się do użytkownika na „Ty” (wielką literą w „Twój”, „Ci”).
- Krótkie, ciepłe komunikaty bez wykrzykników i emoji: „Jak dziś idzie?”, „Nie jesteś sam”.
- Użytkownik występuje wyłącznie pod aliasem (`Anon_Falcon92`). Nigdzie nie pokazujemy e-maila,
  imienia ani zdjęcia.
- Słownik: cel, seria, kamień milowy, meldunek, potknięcie (nie „porażka”), wsparcie / „Wspieram”
  (nie „polubienie” / „like”), Społeczność, poradnik.
