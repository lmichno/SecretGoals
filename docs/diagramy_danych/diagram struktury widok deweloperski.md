# Diagram struktury systemu SecretGoals

Diagram przedstawia **aktualną implementację widoczną w przesłanym projekcie**. Pokazuje istniejące moduły i zależności, a nie docelowe funkcje, które są jeszcze tylko zaplanowane.

```mermaid
flowchart TB
    subgraph FRONT["FRONTEND — React"]
        direction TB
        APP["App.tsx<br/>główny komponent"]
        AUTH_PAGE["AuthPage.tsx<br/>strona logowania i rejestracji"]
        AUTH_FORM["AuthForm.tsx<br/>formularz"]
        AUTH_HOOK["useAuth.ts<br/>hook"]
        AUTH_PROVIDER["AuthProvider.tsx<br/>stan uwierzytelniania"]
        AUTH_CONTEXT["authContext.ts<br/>kontekst"]
        AUTH_API["api/auth.ts<br/>funkcje API uwierzytelniania"]
        API_CLIENT["api/client.ts<br/>wspólny klient HTTP"]
        UI["components/ui/<br/>komponenty interfejsu"]

        APP --> AUTH_PAGE
        APP --> AUTH_PROVIDER
        AUTH_PAGE --> AUTH_FORM
        AUTH_PAGE --> UI
        AUTH_FORM --> AUTH_HOOK
        AUTH_FORM --> UI
        AUTH_HOOK --> AUTH_CONTEXT
        AUTH_PROVIDER --> AUTH_CONTEXT
        AUTH_PROVIDER --> AUTH_API
        AUTH_API --> API_CLIENT
    end

    subgraph BACK["BACKEND — Node.js / Express"]
        direction TB
        SERVER["index.ts<br/>konfiguracja serwera i podłączenie tras"]

        subgraph ROUTING["Trasy API"]
            direction TB
            AUTH_ROUTE["routes/auth.ts"]
            GOALS_ROUTE["routes/goals.ts"]
            HEALTH_ROUTE["routes/health.ts"]
        end

        subgraph MIDDLE["Obsługa żądań"]
            direction TB
            AUTH_MW["requireAuth.ts<br/>sprawdzanie uwierzytelnienia"]
            ASYNC["asyncHandler.ts<br/>przekazywanie błędów async"]
            ERRORS["errorHandler.ts<br/>obsługa błędów i nieznanych tras"]
        end

        subgraph CTRL["Kontrolery"]
            direction TB
            AUTH_CTRL["authController.ts"]
            GOALS_CTRL["goalsController.ts"]
            HEALTH_CTRL["healthController.ts"]
        end

        subgraph SERVICES["Usługi"]
            direction TB
            AUTH_SERVICE["authService.ts<br/>rejestracja, logowanie, token JWT"]
            ALIAS_SERVICE["aliasService.ts<br/>generowanie unikalnego aliasu"]
            GOALS_SERVICE["goalsService.ts<br/>pobieranie i tworzenie celów"]
        end

        SERVER --> AUTH_ROUTE
        SERVER --> GOALS_ROUTE
        SERVER --> HEALTH_ROUTE
        SERVER --> ERRORS

        AUTH_ROUTE --> AUTH_MW
        AUTH_ROUTE --> ASYNC
        GOALS_ROUTE --> AUTH_MW
        GOALS_ROUTE --> ASYNC

        AUTH_ROUTE --> AUTH_CTRL
        GOALS_ROUTE --> GOALS_CTRL
        HEALTH_ROUTE --> HEALTH_CTRL

        AUTH_CTRL --> AUTH_SERVICE
        AUTH_SERVICE --> ALIAS_SERVICE
        GOALS_CTRL --> GOALS_SERVICE
    end

    subgraph DATA["WARSTWA DANYCH"]
        direction TB
        PRISMA["prisma.ts<br/>Prisma Client"]
        SCHEMA["schema.prisma<br/>modele danych"]
        SQLITE[("SQLite<br/>baza danych")]

        PRISMA --> SQLITE
        SCHEMA -. "definiuje strukturę danych" .-> PRISMA
    end

    API_CLIENT -->|"HTTP / JSON"| AUTH_ROUTE
    API_CLIENT -->|"HTTP / JSON"| GOALS_ROUTE
    APP -->|"bezpośrednie fetch('/api/health')"| HEALTH_ROUTE

    AUTH_SERVICE --> PRISMA
    ALIAS_SERVICE --> PRISMA
    GOALS_SERVICE --> PRISMA
    HEALTH_CTRL --> PRISMA
```

## Opis elementów

### Frontend

| Element | Rola |
|---|---|
| `App.tsx` | Główny komponent aplikacji. Korzysta z kontekstu uwierzytelniania i wyświetla stronę logowania albo widok po zalogowaniu. Sprawdza też stan serwera przez bezpośrednie `fetch('/api/health')`. |
| `AuthPage.tsx` | Strona logowania i rejestracji. |
| `AuthForm.tsx` | Formularz, walidacja danych po stronie interfejsu i wywołanie funkcji logowania lub rejestracji z hooka. |
| `useAuth.ts` | Hook udostępniający komponentom dane i funkcje z kontekstu uwierzytelniania. |
| `AuthProvider.tsx` | Zarządza stanem użytkownika, sprawdza sesję po uruchomieniu aplikacji oraz udostępnia funkcje logowania, rejestracji i wylogowania. |
| `authContext.ts` | Definiuje kontekst i typ udostępnianych danych uwierzytelniania. |
| `api/auth.ts` | Funkcje wywołujące endpointy rejestracji, logowania, wylogowania i pobrania danych zalogowanego użytkownika. |
| `api/client.ts` | Wspólna funkcja `apiRequest`, która wykonuje żądania HTTP i obsługuje odpowiedzi oraz błędy API. |
| `components/ui/` | Współdzielone elementy interfejsu, np. przyciski, pola tekstowe, karty i awatary. |

### Backend

| Element | Rola |
|---|---|
| `index.ts` | Tworzy aplikację Express, konfiguruje middleware i podłącza trasy pod adresami `/api/health`, `/api/auth` i `/api/goals`. |
| `routes/auth.ts` | Definiuje endpointy rejestracji, logowania, wylogowania i pobierania danych zalogowanego użytkownika. |
| `routes/goals.ts` | Definiuje endpointy pobierania i tworzenia celów. Wszystkie trasy w tym routerze wymagają uwierzytelnienia. |
| `routes/health.ts` | Definiuje endpoint sprawdzający stan serwera i połączenia z bazą. |
| `requireAuth.ts` | Sprawdza token JWT zapisany w ciasteczku i udostępnia identyfikator zalogowanego użytkownika. |
| `asyncHandler.ts` | Przekazuje błędy z asynchronicznych kontrolerów do obsługi błędów Express. |
| `errorHandler.ts` | Obsługuje nieznane trasy API i błędy zwracane przez backend. |
| `authController.ts` | Obsługuje żądania uwierzytelniania i korzysta z `authService`. |
| `goalsController.ts` | Obsługuje żądania dotyczące celów i korzysta z `goalsService`. |
| `healthController.ts` | Sprawdza połączenie z bazą danych, wykonując zapytanie przez Prisma Client. |
| `authService.ts` | Realizuje logikę rejestracji, weryfikacji danych logowania i obsługi tokenów JWT. |
| `aliasService.ts` | Generuje losowy, unikalny alias użytkownika i sprawdza jego dostępność w bazie. |
| `goalsService.ts` | Odczytuje cele użytkownika i tworzy nowe cele. |

### Warstwa danych

| Element | Rola |
|---|---|
| `prisma.ts` | Tworzy i udostępnia instancję Prisma Client. |
| `schema.prisma` | Definiuje modele i relacje danych wykorzystywane przez Prisma. |
| SQLite | Relacyjna baza danych wskazana w konfiguracji Prisma. |

## Ważne uwagi o zgodności z kodem

- `AuthProvider` korzysta z `api/auth.ts`, a ten moduł korzysta ze wspólnego klienta `api/client.ts`.
- Sprawdzenie stanu serwera w `App.tsx` wykonuje **bezpośrednie** `fetch('/api/health')` — nie przechodzi przez `api/client.ts`.
- `requireAuth` jest używany dla `GET /api/auth/me` oraz dla wszystkich endpointów w `routes/goals.ts`. Rejestracja, logowanie i wylogowanie nie wymagają wcześniejszego zalogowania.
- `healthController.ts` korzysta bezpośrednio z Prisma Client; w tej ścieżce nie ma osobnej usługi.
- W backendzie istnieją endpointy pobierania i tworzenia celów, ale aktualny widok celów w `App.tsx` zawiera przykładowe, zapisane w kodzie dane. W przesłanym frontendzie nie ma jeszcze modułu API wywołującego endpointy `/api/goals`.
- `schema.prisma` zawiera również modele `ProgressEntry`, `Post`, `Comment`, `Support` i `AuthAccount`. Samo istnienie modeli w schemacie nie oznacza, że odpowiadające im funkcje API są już zaimplementowane.
- Diagram pokazuje zależności modułów, a nie pełny przebieg pojedynczego procesu, np. rejestracji użytkownika.
