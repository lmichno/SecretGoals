# SecretGoals

Anonimowa platforma webowa łącząca mechanizmy śledzenia celów i nawyków ze wsparciem społecznościowym.

## Stos technologiczny

- **Frontend (`/client`):** React 19, Vite, Tailwind CSS v4, Lucide Icons
- **Backend (`/server`):** Node.js, Express.js
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
│       ├── App.jsx
│       └── main.jsx
├── server/                 # Backend (Express)
│   ├── prisma/             # Schemat bazy danych (schema.prisma)
│   └── src/
│       ├── controllers/    # Logika obsługi żądań
│       ├── middleware/     # Middleware Express (np. autoryzacja)
│       ├── routes/         # Definicje endpointów /api/...
│       ├── services/       # Logika biznesowa i dostęp do danych
│       ├── prisma.js       # Klient Prisma
│       └── index.js        # Punkt wejścia serwera
├── docs/                   # Dokumentacja: badanie rynku, user stories, SysML, prototypy UI
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

### 2. Uruchomienie aplikacji deweloperskiej

W głównym folderze:

```bash
npm run dev
```

Polecenie to równolegle uruchamia:

- **Serwer Express:** `http://localhost:5000`
- **Klient Vite (React):** `http://localhost:5173` (z wbudowanym proxy `/api` skierowanym na port 5000)

---

## Przydatne polecenia

| Polecenie               | Opis                                                         |
| :---------------------- | :----------------------------------------------------------- |
| `npm run dev`           | Uruchamia jednocześnie backend i frontend                    |
| `npm run dev:server`    | Uruchamia tylko backend Express                              |
| `npm run dev:client`    | Uruchamia tylko frontend React (Vite)                        |
| `npm run build`         | Buduje produkcyjną wersję frontendu                          |
| `npm run lint`          | Sprawdza cały kod linterem (Oxlint)                          |
| `npm run lint:fix`      | Poprawia automatycznie to, co linter potrafi naprawić        |
| `npm run format`        | Formatuje cały projekt Prettierem                            |
| `npm run format:check`  | Sprawdza formatowanie bez zmieniania plików                  |
| `npm run check`         | Lint + sprawdzenie formatowania (np. przed oddaniem zadania) |
| `npm run prisma:studio` | Otwiera graficzny interfejs Prisma Studio dla bazy SQLite    |
| `npm run prisma:push`   | Synchronizuje schemat Prisma z bazą SQLite (`dev.db`)        |

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

- Komponenty React i ich pliki: `PascalCase` (`GoalCard.jsx`).
- Hooki: `useCamelCase` (`useGoals.js`).
- Pozostałe pliki JS, funkcje i zmienne: `camelCase` (`goalsController.js`).
- Endpointy API: rzeczowniki w liczbie mnogiej pod `/api` (`/api/goals`).
- Modele Prisma: `PascalCase` w liczbie pojedynczej (`Goal`, `User`).

### Automatyczne wymuszanie

Przed każdym commitem Husky uruchamia `lint-staged`, który na zmienionych plikach odpala `oxlint --fix` i `prettier --write`. Commit z błędem lintera zostaje zatrzymany.

### Git

- Gałąź główna: `main`. Nowe funkcje na gałęziach `feature/<nazwa>`, poprawki na `fix/<nazwa>`.
- Komunikaty commitów w trybie rozkazującym, krótko i konkretnie (np. „Dodaj endpoint listy celów”).
- Pliki `.env` i bazy `*.db` nie trafiają do repozytorium (`.gitignore`), wzór konfiguracji jest w `server/.env.example`.

## Prototyp UI

Aktualny prototyp interfejsu (telefon i desktop: Cele, Społeczność, Profil) opisuje [docs/prototypes/README.md](docs/prototypes/README.md).
