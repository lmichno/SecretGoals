# SecretGoals

Anonimowa platforma webowa łącząca mechanizmy śledzenia celów i nawyków ze wsparciem społecznościowym.

## Stos technologiczny

- **Język:** TypeScript (tryb `strict`) w kliencie i serwerze
- **Frontend (`/client`):** React 19, Vite, Tailwind CSS v4, Lucide Icons
- **Backend (`/server`):** Node.js, Express.js, `tsx` (tryb deweloperski)
- **Baza danych:** SQLite + Prisma ORM
- **Zarządzanie procesami:** Concurrently (uruchamianie jednym poleceniem)
- **Jakość kodu:** Oxlint (linter), Prettier (formatter), Husky + lint-staged (hook przed commitem)

---

## Struktura projektu

```
SecretGoals/
├── client/                 # Frontend (React + Vite)
│   ├── public/             # Pliki statyczne
│   └── src/
│       ├── api/            # Funkcje komunikacji z backendem (fetch /api/...)
│       ├── components/     # Komponenty UI wielokrotnego użytku
│       ├── hooks/          # Własne hooki React
│       ├── pages/          # Widoki/zakładki: Cele, Społeczność, Profil
│       ├── App.tsx
│       └── main.tsx
├── server/                 # Backend (Express)
│   ├── prisma/             # Schemat bazy (schema.prisma), migracje, seed.ts
│   └── src/
│       ├── controllers/    # Logika obsługi żądań
│       ├── middleware/     # Middleware Express (np. autoryzacja)
│       ├── routes/         # Definicje endpointów /api/...
│       ├── services/       # Logika biznesowa i dostęp do danych
│       ├── prisma.ts       # Klient Prisma
│       └── index.ts        # Punkt wejścia serwera
├── docs/                   # Dokumentacja: ADR, badanie rynku, user stories, SysML, prototypy UI
├── .husky/                 # Hooki Git (pre-commit)
├── .editorconfig           # Wspólne ustawienia edytora
├── .oxlintrc.json          # Konfiguracja lintera
├── .prettierrc.json        # Konfiguracja formattera
└── package.json            # Skrypty uruchamiające całość
```

---

## Szybki start

### 1. Instalacja zależności

W głównym folderze projektu:

```bash
npm run install:all
```

LUB manualnie:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

`npm install` w głównym folderze automatycznie instaluje hook Git (Husky).

### 2. Konfiguracja i baza danych

Skopiuj `server/.env.example` do `server/.env` i ustaw własny `JWT_SECRET` (bez niego serwer się nie uruchomi).
Potem utwórz lokalną bazę z migracji i załaduj dane testowe:

```bash
npm run prisma:migrate
npm run prisma:seed
```

Seed tworzy konto demo `demo@secretgoals.pl` / `demo1234`. Po pobraniu z repozytorium nowych migracji wystarczy ponownie `npm run prisma:migrate`.

### 3. Uruchomienie aplikacji deweloperskiej

W głównym folderze:

```bash
npm run dev
```

Polecenie to równolegle uruchamia:

- **Serwer Express:** `http://localhost:5000`
- **Klient Vite (React):** `http://localhost:5173` (z wbudowanym proxy `/api` skierowanym na port 5000)

---

## Przydatne polecenia

| Polecenie                | Opis                                                                                               |
| :----------------------- | :------------------------------------------------------------------------------------------------- |
| `npm run dev`            | Uruchamia jednocześnie backend i frontend                                                          |
| `npm run dev:server`     | Uruchamia tylko backend Express                                                                    |
| `npm run dev:client`     | Uruchamia tylko frontend React (Vite)                                                              |
| `npm run build`          | Sprawdza typy i buduje produkcyjną wersję frontendu                                                |
| `npm run lint`           | Sprawdza cały kod linterem (Oxlint)                                                                |
| `npm run lint:fix`       | Poprawia automatycznie to, co linter potrafi naprawić                                              |
| `npm run format`         | Formatuje cały projekt Prettierem                                                                  |
| `npm run format:check`   | Sprawdza formatowanie bez zmieniania plików                                                        |
| `npm run typecheck`      | Sprawdza typy TypeScript w serwerze i kliencie                                                     |
| `npm run check`          | Lint + formatowanie + typy (np. przed oddaniem zadania)                                            |
| `npm run prisma:studio`  | Otwiera graficzny interfejs Prisma Studio dla bazy SQLite                                          |
| `npm run prisma:migrate` | Tworzy/aktualizuje bazę z migracji; po zmianie schematu: `npm run prisma:migrate -- --name <opis>` |
| `npm run prisma:seed`    | Ładuje dane testowe (`server/prisma/seed.ts`)                                                      |
| `npm run prisma:push`    | Tylko do jednorazowych eksperymentów (bez historii zmian)                                          |

---

## Standardy kodowania

### Styl kodu (wymuszany przez Prettier)

- 2 spacje wcięcia, końce linii LF, kodowanie UTF-8 (`.editorconfig`).
- Bez średników, pojedyncze cudzysłowy, przecinki na końcu wielolinijkowych obiektów i tablic.
- Maksymalna długość linii: 100 znaków.

### Reguły lintera (Oxlint)

- Błędy poprawności (`correctness`) blokują commit, podejrzane konstrukcje (`suspicious`) dają ostrzeżenie.
- `===` zamiast `==`, `const`/`let` zamiast `var`, brak nieużywanych zmiennych.
- W kliencie: reguły hooków React (`rules-of-hooks`, `exhaustive-deps`) i dostępności (`jsx-a11y`).

### Nazewnictwo

- Komponenty React i ich pliki: `PascalCase` (`GoalCard.tsx`).
- Hooki: `useCamelCase` (`useGoals.ts`).
- Pozostałe pliki, funkcje i zmienne: `camelCase` (`goalsController.ts`).
- Typy i interfejsy: `PascalCase` (`ServerStatus`, `CreateGoalInput`).
- Endpointy API: rzeczowniki w liczbie mnogiej pod `/api` (`/api/goals`).
- Modele Prisma: `PascalCase` w liczbie pojedynczej (`Goal`, `User`).

### TypeScript

- Cały kod piszemy w TypeScripcie (`.ts`, `.tsx`), w trybie `strict`.
- Zakaz `any` (wymusza linter). Dane z zewnątrz (body żądania, odpowiedź API) traktujemy jako
  `unknown` i sprawdzamy przed użyciem.
- Na serwerze importy lokalnych plików piszemy z końcówką `.js`, mimo że plik ma `.ts`
  (`import goalsRoutes from './routes/goals.js'`). Tego wymaga Node.js przy modułach ES, a
  TypeScript sam znajdzie właściwy plik. W kliencie końcówek nie podajemy.
- Typy modeli bazy bierzemy z klienta Prisma, nie piszemy ich ręcznie.

### Automatyczne wymuszanie

Przed każdym commitem Husky uruchamia `lint-staged`, który na zmienionych plikach odpala `oxlint --fix` i `prettier --write`. Commit z błędem lintera zostaje zatrzymany.

### Git

- Gałąź główna: `main`. Nowe funkcje na gałęziach `feature/<nazwa>`, poprawki na `fix/<nazwa>`.
- Komunikaty commitów w trybie rozkazującym, krótko i konkretnie (np. „Dodaj endpoint listy celów”).
- Pliki `.env` i bazy `*.db` nie trafiają do repozytorium (`.gitignore`), wzór konfiguracji jest w `server/.env.example`.

## API logowania

Uwierzytelnianie opisuje ADR-008: token JWT w ciasteczku `httpOnly` (`sg_token`), więc klient nie przechowuje tokenu sam, wystarczy wysyłać żądania na `/api` (proxy Vite).

| Metoda i ścieżka          | Body                  | Odpowiedź                                                                     |
| :------------------------ | :-------------------- | :---------------------------------------------------------------------------- |
| `POST /api/auth/register` | `{ email, password }` | `201 { id, alias, email }` + ciasteczko; `400` błędy pól, `409` zajęty e-mail |
| `POST /api/auth/login`    | `{ email, password }` | `200 { id, alias, email }` + ciasteczko; `401` zły e-mail lub hasło           |
| `POST /api/auth/logout`   | brak                  | `204`, czyści ciasteczko                                                      |
| `GET /api/auth/me`        | brak                  | `200 { id, alias, email }` albo `401`                                         |

Błędy mają kształt `{ "error": "...", "fields": { "email": "..." } }` (ADR-006). Trasy wymagające logowania (np. `/api/goals`) mają middleware `requireAuth`, a id użytkownika w kontrolerze daje `getAuthUserId(req)`.

## Decyzje architektoniczne

Decyzje architektoniczne (stack, warstwy, API, logowanie, model danych) są w
[docs/ADR.md](docs/ADR.md).

## Prototyp UI

Aktualny prototyp interfejsu (telefon i desktop: Cele, Społeczność, Profil) opisuje [docs/prototypes/README.md](docs/prototypes/README.md).

Frontend budujemy według [docs/prototypes/UI_GUIDE.md](docs/prototypes/UI_GUIDE.md) (zrzuty ekranów, zasady) i [docs/design/DESIGN_SYSTEM.md](docs/design/DESIGN_SYSTEM.md) (motyw w `client/src/index.css`, komponenty w `client/src/components/ui`).
