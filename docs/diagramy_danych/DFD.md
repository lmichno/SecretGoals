# Diagramy DFD – SecretGoals

Diagramy przepływu danych (DFD) uzupełniają ERD w **widoku danych** modelu 4+1. ERD pokazuje, co
przechowujemy, a DFD skąd dane przychodzą, jakie procesy je przekształcają, gdzie trafiają i czego
nigdy nie wysyłamy dalej.

- **Źródła:** kod US01 w `server/src/` (routes → controllers → services, ADR-005) i `client/src/`
  (`api/`, `context/`, `components/auth/`), decyzje w [`docs/ADR.md`](../ADR.md), historie w
  [`user_stories.md`](../user-stories_and_use-case/user_stories.md), model w [`ERD.md`](ERD.md).
- **Notacja** (Yourdon/DeMarco, narysowana w Mermaid `flowchart`):

| Kształt                     | Element DFD                                    | Przykład                    |
| :-------------------------- | :--------------------------------------------- | :-------------------------- |
| prostokąt                   | terminator (encja zewnętrzna)                  | Użytkownik, Google          |
| koło                        | proces (numerowany, np. `1.3`)                 | Rejestracja konta           |
| cylinder                    | magazyn danych (`D1`, `D2`, ...)               | `D1 User`                   |
| strzałka z opisem           | przepływ danych                                | `e-mail, hasło`             |
| prostokąt przerywany (ramka) | granica (przeglądarka / serwer)               | Klient SPA                  |

Plik ma dwie części: **szczegółowe DFD dla US01** (poziom 0 i poziom 1, zgodne z kodem po scaleniu
logowania) oraz **orientacyjne DFD całej aplikacji** (poziom 0 i poziom 1 na podstawie ADR,
historii i prototypów).

---

## 1. DFD dla US01 – rejestracja, logowanie i anonimowy alias

### 1.1 Poziom 0 (diagram kontekstowy)

Cały podsystem uwierzytelniania jako jeden proces. Inny użytkownik jest na diagramie celowo: z
US01 (scenariusz 2) wynika, że do niego płynie wyłącznie alias.

```mermaid
flowchart LR
    U["Użytkownik<br/>(przeglądarka)"]
    I["Inny użytkownik"]
    G["Google / Facebook<br/>(planowane, ADR-016)"]
    P0(("0<br/>Uwierzytelnianie<br/>SecretGoals"))

    U -- "e-mail, hasło (rejestracja, logowanie)" --> P0
    U -- "ciasteczko sg_token (każde żądanie)" --> P0
    U -- "żądanie wylogowania" --> P0
    P0 -- "id, alias, e-mail (tylko właścicielowi)" --> U
    P0 -- "Set-Cookie sg_token (JWT) / usunięcie ciasteczka" --> U
    P0 -- "błędy walidacji { error, fields }" --> U
    P0 -- "alias (bez e-maila)" --> I
    G -. "id użytkownika u dostawcy, e-mail" .-> P0
```

### 1.2 Poziom 1

Procesy odpowiadają funkcjom w kodzie (kolumna „Gdzie w kodzie” w tabeli 1.3). Magazyn `D3` to
ciasteczko w przeglądarce, a `D4` stan aplikacji w pamięci (React Context), bo z nich korzystają
procesy, choć nie są tabelami bazy.

```mermaid
flowchart TB
    U["Użytkownik"]

    subgraph KLIENT["Klient SPA (przeglądarka)"]
        P1(("1.1<br/>Walidacja<br/>formularza"))
        P9(("1.9<br/>Przywrócenie<br/>sesji przy starcie"))
        D3[("D3 Ciasteczko sg_token<br/>(httpOnly)")]
        D4[("D4 AuthContext<br/>(zalogowany użytkownik)")]
    end

    subgraph SERWER["Serwer API (Express)"]
        P2(("1.2<br/>Walidacja<br/>i normalizacja"))
        P3(("1.3<br/>Rejestracja<br/>konta"))
        P4(("1.4<br/>Generowanie<br/>aliasu"))
        P5(("1.5<br/>Weryfikacja<br/>poświadczeń"))
        P6(("1.6<br/>Wystawienie<br/>tokenu sesji"))
        P7(("1.7<br/>Weryfikacja<br/>tokenu"))
        P8(("1.8<br/>Odczyt profilu<br/>/ wylogowanie"))
        D1[("D1 User")]
        D2[("D2 Konfiguracja<br/>server/.env")]
    end

    U -- "e-mail, hasło, powtórzone hasło, zgoda" --> P1
    P1 -- "błędy pól (przed wysłaniem)" --> U
    P1 -- "POST register / login: e-mail, hasło" --> P2
    P2 -- "400: error, fields" --> D4
    P2 -- "e-mail (trim, małe litery), hasło" --> P3
    P2 -- "e-mail, hasło" --> P5

    P3 -- "czy e-mail zajęty?" --> D1
    D1 -- "istnieje / nie istnieje" --> P3
    P3 -- "prośba o alias" --> P4
    P4 -- "czy alias zajęty?" --> D1
    D1 -- "zajęty / wolny" --> P4
    P4 -- "unikalny alias" --> P3
    P3 -- "nowy rekord: e-mail, passwordHash (bcrypt), alias" --> D1
    P3 -- "id, alias, e-mail" --> P6

    D1 -- "id, alias, e-mail, passwordHash" --> P5
    P5 -- "id, alias, e-mail (gdy hasło pasuje)" --> P6
    P5 -- "401: Nieprawidłowy e-mail lub hasło" --> D4

    D2 -- "JWT_SECRET" --> P6
    P6 -- "Set-Cookie: JWT (sub = id, exp = 7 dni)" --> D3
    P6 -- "201 / 200: id, alias, e-mail" --> D4

    D3 -- "token (każde żądanie do /api)" --> P7
    D2 -- "JWT_SECRET" --> P7
    P7 -- "userId" --> P8
    P7 -- "401 + usunięcie złego ciasteczka" --> D3
    D1 -- "id, alias, e-mail" --> P8
    P8 -- "GET me: id, alias, e-mail" --> P9
    P8 -- "logout: usunięcie ciasteczka (204)" --> D3

    P9 -- "zalogowany użytkownik albo brak sesji" --> D4
    D4 -- "alias, stan logowania, komunikaty błędów" --> U
```

### 1.3 Procesy

| Nr  | Proces                        | Wejście                                     | Wyjście                                           | Gdzie w kodzie                                                    |
| :-- | :---------------------------- | :------------------------------------------ | :------------------------------------------------ | :---------------------------------------------------------------- |
| 1.1 | Walidacja formularza          | e-mail, hasło, powtórzone hasło, zgoda      | dane do wysłania albo błędy pod polami            | `client/src/components/auth/AuthForm.tsx` (`validate`)            |
| 1.2 | Walidacja i normalizacja      | body żądania (`unknown`)                    | `{ email, password }` albo `400` z `fields`       | `server/src/utils/validation.ts` (`parseCredentials`)             |
| 1.3 | Rejestracja konta             | e-mail, hasło                               | nowy `User`; `409` przy zajętym e-mailu           | `server/src/services/authService.ts` (`registerUser`)             |
| 1.4 | Generowanie aliasu            | –                                           | unikalny alias, np. `CichyLis42`                  | `server/src/services/aliasService.ts` (`generateUniqueAlias`)     |
| 1.5 | Weryfikacja poświadczeń       | e-mail, hasło; rekord z `D1`                | użytkownik albo `null` (→ `401`)                  | `authService.ts` (`verifyCredentials`)                            |
| 1.6 | Wystawienie tokenu sesji      | `id`; `JWT_SECRET`                          | ciasteczko `sg_token` (JWT HS256, 7 dni)          | `authService.ts` (`signAuthToken`), `utils/authCookie.ts`         |
| 1.7 | Weryfikacja tokenu            | ciasteczko `sg_token`; `JWT_SECRET`         | `req.userId` albo `401`                           | `server/src/middleware/requireAuth.ts`                            |
| 1.8 | Odczyt profilu / wylogowanie  | `userId`; rekord z `D1`                     | `{ id, alias, email }` albo usunięte ciasteczko   | `controllers/authController.ts` (`me`, `logout`)                  |
| 1.9 | Przywrócenie sesji przy starcie | odpowiedź `GET /api/auth/me`              | `user` w `AuthContext` albo ekran logowania       | `client/src/context/AuthProvider.tsx`                             |

### 1.4 Magazyny danych

| Nr  | Magazyn                 | Gdzie                          | Zawartość                                         | Kto czyta / pisze                    |
| :-- | :---------------------- | :----------------------------- | :------------------------------------------------ | :----------------------------------- |
| D1  | `User`                  | SQLite (`server/prisma/dev.db`) | `id`, `email`, `passwordHash`, `alias`, `role`   | 1.3, 1.4 piszą/czytają; 1.5, 1.8 czytają |
| D2  | Konfiguracja serwera    | `server/.env` (poza repo)      | `JWT_SECRET`, `DATABASE_URL`, `PORT`              | 1.6, 1.7 czytają                     |
| D3  | Ciasteczko `sg_token`   | przeglądarka                   | JWT: `sub` (= `User.id`), `iat`, `exp`            | 1.6 zapisuje, 1.7 czyta, 1.8 i 1.7 usuwają |
| D4  | `AuthContext`           | pamięć aplikacji React         | `user` (`id`, `alias`, `email`), błędy, stan ładowania | 1.9 i odpowiedzi API zapisują, widoki czytają |

### 1.5 Ochrona danych w przepływach (ADR-007, ADR-008)

Zdecydowaliśmy się opisać wprost, czego w przepływach **nie ma**, bo to jest sedno US01:

- **Hasło w postaci jawnej** płynie tylko z formularza do procesów 1.2, 1.3 i 1.5 (przez HTTPS w
  produkcji). Nie trafia do żadnego magazynu ani do logów. Do `D1` trafia wyłącznie `passwordHash`.
- **`passwordHash`** płynie tylko z `D1` do procesu 1.5 i nigdy nie opuszcza serwera.
- **E-mail** wraca wyłącznie do właściciela konta (odpowiedzi rejestracji, logowania i `GET
  /api/auth/me`). Do innych użytkowników płynie tylko alias. Interfejs po zalogowaniu pokazuje alias,
  a e-maila nie wyświetla.
- **Token** leży w ciasteczku `httpOnly`, więc skrypt w przeglądarce nie może go odczytać. Klient zna
  stan logowania tylko z odpowiedzi API zapisanej w `D4`, nie z samego tokenu.
- **Odpowiedź na błędne logowanie** jest taka sama dla złego e-maila i złego hasła, a proces 1.5
  porównuje hasło z hashem zastępczym także wtedy, gdy konta nie ma. Z przepływu nie da się więc
  wywnioskować, czy e-mail jest zarejestrowany. Wyjątkiem jest rejestracja, która musi zwrócić
  `409` przy zajętym e-mailu (świadomy kompromis US01).

### 1.6 Przepływy dla poszczególnych scenariuszy

| Scenariusz                         | Ścieżka przez procesy                    | Wynik                                                |
| :--------------------------------- | :--------------------------------------- | :--------------------------------------------------- |
| Rejestracja (US01, scenariusz 1)    | 1.1 → 1.2 → 1.3 ↔ 1.4 → 1.6 → `D3`, `D4` | `201`, konto z aliasem, użytkownik od razu zalogowany |
| Rejestracja na zajęty e-mail       | 1.1 → 1.2 → 1.3                          | `409`, komunikat pod polem e-mail                    |
| Logowanie                          | 1.1 → 1.2 → 1.5 → 1.6 → `D3`, `D4`       | `200`, ciasteczko ustawione                          |
| Błędne logowanie                   | 1.1 → 1.2 → 1.5                          | `401`, wspólny komunikat                             |
| Powrót do aplikacji                | `D3` → 1.7 → 1.8 → 1.9 → `D4`            | użytkownik zalogowany bez ponownego logowania        |
| Wylogowanie                        | 1.7 → 1.8 → `D3`                         | `204`, ciasteczko usunięte, `D4` wyczyszczony        |
| Profil oglądany przez innego (scenariusz 2) | `D1` → (przyszły proces profilu) → inny użytkownik | tylko alias, bez e-maila                   |

---

## 2. DFD całej aplikacji (orientacyjny)

Ta część opisuje docelowe przepływy dla US01–US05 na podstawie ADR-006, ADR-007, ADR-011 i ADR-012
oraz prototypu v2. Poza US01 i podstawową obsługą celów kod jeszcze nie istnieje, więc numeracja i
podział procesów mogą się zmienić przy implementacji.

### 2.1 Poziom 0 (diagram kontekstowy)

```mermaid
flowchart LR
    U["Użytkownik"]
    I["Inni użytkownicy<br/>(Społeczność)"]
    T["Konto zespołu<br/>(role = team)"]
    G["Google / Facebook<br/>(planowane)"]
    P0(("0<br/>SecretGoals"))

    U -- "dane logowania, cele, postępy, komentarze, wsparcie" --> P0
    P0 -- "alias, cele, statystyki, feed, rówieśnik" --> U
    I -- "komentarze, wsparcie, publiczne cele i meldunki" --> P0
    P0 -- "publiczne wpisy podpisane aliasem" --> I
    T -- "poradniki" --> P0
    G -. "id u dostawcy, e-mail" .-> P0
```

### 2.2 Poziom 1

```mermaid
flowchart TB
    U["Użytkownik"]
    I["Inni użytkownicy"]
    T["Konto zespołu"]
    G["Google / Facebook"]

    P1(("1<br/>Uwierzytelnianie<br/>US01"))
    P2(("2<br/>Zarządzanie<br/>celami<br/>US02"))
    P3(("3<br/>Rejestrowanie<br/>postępów<br/>US03"))
    P4(("4<br/>Wyliczanie<br/>statystyk"))
    P5(("5<br/>Publikowanie<br/>w feedzie"))
    P6(("6<br/>Przeglądanie feedu<br/>i komentowanie<br/>US04"))
    P7(("7<br/>Dopasowanie<br/>rówieśnika<br/>i wsparcie<br/>US05"))

    D1[("D1 User")]
    D2[("D2 AuthAccount")]
    D3[("D3 Goal")]
    D4[("D4 ProgressEntry")]
    D5[("D5 Post")]
    D6[("D6 Comment")]
    D7[("D7 Support")]

    U -- "e-mail, hasło" --> P1
    G -. "id u dostawcy, e-mail" .-> P1
    P1 <-- "konto, alias" --> D1
    P1 <-. "powiązanie z dostawcą" .-> D2
    P1 -- "sesja (JWT w ciasteczku): userId" --> P2
    P1 -- "alias, sesja" --> U

    U -- "tytuł, opis, typ, kategoria, termin, widoczność" --> P2
    P2 -- "cel (userId z tokenu)" --> D3
    P2 -- "publiczny cel" --> P5
    D3 -- "lista celów" --> U

    U -- "wartość, komentarz, udostępnij?" --> P3
    D3 -- "typ celu, właściciel" --> P3
    P3 -- "wpis postępu" --> D4
    P3 -- "udostępniony wpis (isShared)" --> P5

    D4 -- "historia wpisów" --> P4
    D3 -- "typ, wartość docelowa" --> P4
    P4 -- "seria, procent, tydzień, mapa aktywności" --> U
    P4 -- "osiągnięty kamień milowy" --> P5

    T -- "treść poradnika" --> P5
    P5 -- "Post: goal / progress / milestone / guide" --> D5

    D5 -- "posty od najnowszych, filtr typu i kategorii" --> P6
    D1 -- "alias autora (bez e-maila)" --> P6
    P6 -- "feed, komentarze" --> U
    P6 -- "feed, komentarze" --> I
    U -- "treść komentarza" --> P6
    I -- "treść komentarza" --> P6
    P6 -- "komentarz" --> D6
    D6 -- "komentarze pod postem" --> P6

    D3 -- "publiczne cele w tej samej kategorii" --> P7
    D4 -- "aktywność z 7 dni" --> P7
    D5 -- "post celu rówieśnika" --> P7
    P7 -- "alias rówieśnika, krótki postęp" --> U
    U -- "Wspieram" --> P7
    I -- "Wspieram" --> P7
    P7 -- "wsparcie (postId, userId)" --> D7
    D7 -- "liczba wspierających" --> P6
```

### 2.3 Procesy

| Nr  | Proces                          | Historia   | Endpointy (ADR-006)                                         | Stan w kodzie          |
| :-- | :------------------------------ | :--------- | :---------------------------------------------------------- | :--------------------- |
| 1   | Uwierzytelnianie                | US01       | `/api/auth/register`, `login`, `logout`, `me`; OAuth z ADR-016 | e-mail i hasło: tak; OAuth: nie |
| 2   | Zarządzanie celami              | US02       | `GET`, `POST /api/goals`, `PATCH`, `DELETE /api/goals/:id`  | częściowo (`GET`, `POST`) |
| 3   | Rejestrowanie postępów          | US03       | `POST /api/goals/:id/progress`                              | nie                    |
| 4   | Wyliczanie statystyk            | US03       | w odpowiedziach celów (seria, procent)                      | nie                    |
| 5   | Publikowanie w feedzie          | US04, US05 | wewnętrzny (serwisy), poradniki przez konto zespołu        | nie                    |
| 6   | Przeglądanie feedu i komentowanie | US04     | `GET /api/feed`, `GET`, `POST /api/posts/:id/comments`      | nie                    |
| 7   | Dopasowanie rówieśnika i wsparcie | US05     | `GET /api/goals/:id/peer`, `POST /api/posts/:id/support`    | nie                    |

### 2.4 Reguły przepływów w całej aplikacji

- **Właściciel danych zawsze pochodzi z sesji** (proces 1), a nie z treści żądania (ADR-008). Dlatego
  procesy 2, 3, 6 i 7 dostają `userId` od procesu 1.
- **Do innych użytkowników płynie tylko alias.** Procesy 6 i 7 czytają z `D1` wyłącznie `id` i
  `alias` (ADR-007).
- **Prywatne cele nie wychodzą poza właściciela.** Proces 5 publikuje tylko cele z `isPublic = true`,
  a proces 7 dobiera rówieśnika tylko z publicznych celów. Zmiana celu na prywatny usuwa jego posty
  z `D5` (ADR-011).
- **Feed zasila jedna tabela.** Wszystko, co widać w Społeczności, przechodzi przez proces 5 do `D5`,
  a komentarze (`D6`) i wsparcie (`D7`) zawsze wskazują na post. Nowy rodzaj wpisu nie zmienia
  procesów 6 i 7.
- **Statystyki nie są zapisywane.** Proces 4 liczy je przy każdym odczycie z `D4`, więc nie ma
  przepływu „seria” do żadnego magazynu.
