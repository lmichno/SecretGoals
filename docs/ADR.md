# Architecture Decision Records – SecretGoals

W tym pliku zapisujemy decyzje architektoniczne, które podjęliśmy przy budowie SecretGoals. Używamy
formatu **Architecture Decision Records** (Michael Nygard): każda decyzja ma stały numer, status,
kontekst, samą decyzję, rozważone alternatywy i konsekwencje.

**Statusy:**

- **Zaakceptowana** – decyzja obowiązuje. Kolumna „W kodzie” w spisie pokazuje, czy jest już
  wdrożona.
- **Proponowana** – pomysł do omówienia, jeszcze nie przyjęty.
- **Zastąpiona przez ADR-XXX** – decyzja nieaktualna. Starych wpisów nie usuwamy ani nie
  przepisujemy, tylko dodajemy nowy ADR i zmieniamy status starego.

**Jak dodajemy nową decyzję:** kopiujemy szablon z końca pliku, nadajemy kolejny numer i dopisujemy
wiersz do spisu. Decyzje zmieniające architekturę (nowa biblioteka, nowa warstwa, zmiana modelu
danych) zapisujemy tutaj _przed_ ich wdrożeniem.

## Spis decyzji

| Nr      | Decyzja                                                           | Status        | W kodzie  | Widok 4+1         |
| :------ | :---------------------------------------------------------------- | :------------ | :-------- | :---------------- |
| ADR-001 | Architektura klient–serwer (SPA + REST API) w jednym repozytorium | Zaakceptowana | Tak       | Fizyczny, Dev.    |
| ADR-002 | Frontend: React + Vite + Tailwind CSS                             | Zaakceptowana | Tak       | Deweloperski      |
| ADR-003 | Backend: Node.js + Express                                        | Zaakceptowana | Tak       | Deweloperski      |
| ADR-004 | Baza danych: SQLite + Prisma ORM                                  | Zaakceptowana | Tak       | Logiczny, Dane    |
| ADR-005 | Warstwy backendu: routes → controllers → services → Prisma        | Zaakceptowana | Tak       | Deweloperski      |
| ADR-006 | Kontrakt REST API pod `/api` w formacie JSON                      | Zaakceptowana | Częściowo | Procesu           |
| ADR-007 | Anonimowość: alias publiczny, e-mail tylko do logowania           | Zaakceptowana | Nie       | Logiczny, Dane    |
| ADR-008 | Uwierzytelnianie: hasło (bcrypt) + JWT w ciasteczku httpOnly      | Zaakceptowana | Nie       | Procesu           |
| ADR-009 | Walidacja danych na serwerze i w kliencie                         | Zaakceptowana | Częściowo | Procesu           |
| ADR-010 | Zmiany schematu bazy przez migracje Prisma                        | Zaakceptowana | Nie       | Dane              |
| ADR-011 | Model danych i feed oparty na tabeli `Post`                       | Zaakceptowana | Nie       | Logiczny, Dane    |
| ADR-012 | Dopasowanie „rówieśnika” (US05) po kategorii celu                 | Zaakceptowana | Nie       | Logiczny, Procesu |
| ADR-013 | Frontend: routing, stan i komunikacja z API                       | Zaakceptowana | Nie       | Deweloperski      |
| ADR-014 | Responsywny web zamiast aplikacji mobilnej                        | Zaakceptowana | Tak       | Fizyczny          |
| ADR-015 | Jakość kodu: Oxlint, Prettier, Husky i review przez Pull Request  | Zaakceptowana | Tak       | Deweloperski      |
| ADR-016 | Logowanie przez Google i Facebook (OAuth 2.0)                     | Zaakceptowana | Nie       | Procesu, Dane     |
| ADR-017 | TypeScript na frontendzie i backendzie                            | Zaakceptowana | Tak       | Deweloperski      |

Wymagania, z których wynikają decyzje (widok „+1”, czyli przypadki użycia), są w
[`docs/user-stories_and_use-case/user_stories.md`](user-stories_and_use-case/user_stories.md)
(US01–US05) oraz na diagramie przypadków użycia `docs/user-stories_and_use-case/usecase.jpg`.

---

## ADR-001: Architektura klient–serwer (SPA + REST API) w jednym repozytorium

**Status:** Zaakceptowana · **Data:** 2026-10-24

### Kontekst

SecretGoals to aplikacja webowa z kontami użytkowników, danymi współdzielonymi między nimi (feed
społeczności, komentarze, wsparcie) i interfejsem dla telefonu i komputera. Budujemy ją we dwójkę
w ramach jednego semestru, więc zależało nam na architekturze, którą łatwo ogarnąć i uruchomić
jednym poleceniem.

### Decyzja

- Podzieliliśmy aplikację na dwie części: **klienta** (Single Page Application w przeglądarce) i
  **serwer** (REST API), które komunikują się przez HTTP i JSON.
- Obie części trzymamy w **jednym repozytorium** (monorepo bez narzędzi typu Nx/Turborepo):
  `client/`, `server/`, `docs/`, a w katalogu głównym wspólne skrypty i konfiguracja jakości kodu.
- W trybie deweloperskim `npm run dev` uruchamia oba procesy przez `concurrently`. Serwer Vite
  (port 5173) przekazuje żądania `/api/*` do Expressa (port 5000) przez proxy, więc klient zawsze
  woła względne adresy `/api/...`.

### Rozważone alternatywy

- **Aplikacja renderowana po stronie serwera (np. Next.js, szablony EJS):** jedna technologia, ale
  więcej „magii” frameworka i trudniej rozdzielić pracę na frontend i backend.
- **Osobne repozytoria dla klienta i serwera:** dwa razy więcej konfiguracji i trudniej trzymać
  zgodne wersje i wspólne standardy.
- **Backend-as-a-Service (Firebase, Supabase):** mniej kodu, ale chcieliśmy samodzielnie
  zaprojektować architekturę, model danych i API.

### Konsekwencje

- (+) Wyraźny podział odpowiedzialności: UI w `client/`, logika i dane w `server/`.
- (+) `git clone`, `npm run install:all` i `npm run dev` wystarczą, żeby uruchomić całość.
- (+) Proxy Vite eliminuje problemy z CORS i adresami w trybie deweloperskim.
- (−) Trzy pliki `package.json` (root, client, server) i trzy `npm install` (skrypt `install:all`).
- (−) Typy danych API na razie opisujemy osobno w kliencie i na serwerze (ADR-017).

---

## ADR-002: Frontend: React + Vite + Tailwind CSS

**Status:** Zaakceptowana · **Data:** 2026-10-24 (zmieniona 2026-10-29)

### Kontekst

Prototyp UI v2 (`docs/prototypes/`) zakłada wiele interaktywnych widoków (przełącznik celów, feed
w stylu rolek, statystyki, popupy) w dwóch układach: telefon i desktop. Potrzebowaliśmy biblioteki
komponentowej z dużą społecznością i wygodnego sposobu na responsywne style.

### Decyzja

- Wybraliśmy **React 19** jako bibliotekę UI, z komponentami funkcyjnymi i hookami.
- **Vite** jako narzędzie budowania i serwer deweloperski (szybki start, HMR).
- **Tailwind CSS v4** (plugin `@tailwindcss/vite`) do stylowania, z kolorami i fontami z
  prototypu v2 (`#0F1115`, `#5BD69B`, Bricolage Grotesque, Inter).
- **Lucide** (`lucide-react`) jako jedyna biblioteka ikon.
- Piszemy w **TypeScripcie (TSX)**, szczegóły w ADR-017.

### Rozważone alternatywy

- **Vue / Svelte:** prostsza składnia, ale mniejszy ekosystem i mniej gotowych rozwiązań niż w
  React.
- **Create React App:** porzucony przez twórców, wolniejszy od Vite.
- **CSS Modules / zwykły CSS:** więcej plików i ręcznie pisanych media queries przy dwóch układach.

### Konsekwencje

- (+) Duża społeczność, łatwo znaleźć przykłady i pomoc.
- (+) Responsywność prefiksami Tailwinda (`md:`, `lg:`) bez osobnych arkuszy.
- (+) React, React Router i Lucide mają wbudowane typy, więc edytor podpowiada propsy komponentów.
- (−) Długie listy klas Tailwinda w JSX, które ograniczamy wydzielaniem komponentów.

---

## ADR-003: Backend: Node.js + Express

**Status:** Zaakceptowana · **Data:** 2026-10-24 (zmieniona 2026-10-29)

### Kontekst

Serwer ma udostępniać REST API dla kilku zasobów (użytkownicy, cele, postępy, posty, komentarze,
wsparcie) i obsługiwać logowanie. Obciążenie będzie niewielkie, a frontend piszemy w
TypeScripcie, więc chcieliśmy jednego języka w całym projekcie.

### Decyzja

- Wybraliśmy **Node.js + Express 4** w **TypeScripcie** (ADR-017), z modułami ES (`import`/`export`).
- Konfigurację trzymamy w zmiennych środowiskowych z pliku `server/.env` (`dotenv`). Wzór jest w
  `server/.env.example`, a prawdziwy `.env` nie trafia do repozytorium.
- W trybie deweloperskim serwer uruchamia `tsx watch` (zastępuje `nodemon`), który restartuje go
  po zmianach.

### Rozważone alternatywy

- **NestJS:** dobra struktura, ale dużo pojęć (moduły, dekoratory, DI) i narzuca własną
  architekturę, a my chcieliśmy prostego przepływu żądania.
- **Fastify:** szybszy, ale mniej materiałów i przykładów.
- **Python (Django/FastAPI) lub Java (Spring):** drugi język w projekcie, brak wspólnego kodu i
  narzędzi z frontendem.

### Konsekwencje

- (+) Jeden język (TypeScript) w całym projekcie.
- (+) Express jest minimalny i dobrze udokumentowany, przepływ żądania jest łatwy do prześledzenia.
- (−) Express niczego nie narzuca, więc strukturę kodu ustaliliśmy sami (ADR-005).
- (−) Express 4 nie łapie błędów z funkcji `async` automatycznie, więc każdy kontroler ma
  `try/catch` albo przekazuje błąd do middleware obsługi błędów (ADR-006).

---

## ADR-004: Baza danych: SQLite + Prisma ORM

**Status:** Zaakceptowana · **Data:** 2026-10-24

### Kontekst

Nasze dane są relacyjne (użytkownik ma cele, cel ma wpisy postępu, posty mają komentarze i
wsparcie). Chcieliśmy, żeby baza działała na naszych komputerach bez instalowania serwera bazy
danych.

### Decyzja

- Wybraliśmy **SQLite** z plikiem `server/prisma/dev.db` (poza repozytorium, `.gitignore`).
- Do bazy sięgamy wyłącznie przez **Prisma ORM** (`@prisma/client`). Schemat jest w
  `server/prisma/schema.prisma`, a jedna współdzielona instancja klienta w `server/src/prisma.ts`.
- Identyfikatory rekordów to **UUID** (`@default(uuid())`), a nie kolejne liczby, żeby z adresu
  URL nie dało się odczytać liczby użytkowników ani zgadywać cudzych zasobów.
- Surowych zapytań SQL (`$queryRaw`) używamy tylko wyjątkowo (np. w health checku).

### Rozważone alternatywy

- **PostgreSQL / MySQL:** pełniejsze możliwości, ale wymagają instalacji serwera bazy.
- **MongoDB:** nasze dane są wyraźnie relacyjne, a dokumentowa baza utrudniłaby relacje i spójność.
- **Sequelize / Knex / czysty SQL:** więcej ręcznego kodu, brak tak czytelnego schematu i
  podpowiedzi jak w Prisma.

### Konsekwencje

- (+) Zero instalacji: baza to jeden plik, każdy z nas ma własną lokalną kopię.
- (+) Schemat Prisma jest jednocześnie dokumentacją modelu danych i podstawą ERD.
- (+) Prisma Studio (`npm run prisma:studio`) pozwala podejrzeć dane bez pisania SQL.
- (+) Prisma generuje typy TypeScript dla modeli, więc zapytania do bazy są sprawdzane przy
  kompilacji.
- (−) SQLite nie obsługuje typu `enum` w Prisma, więc typy wyliczeniowe zapisujemy jako `String`,
  w kodzie opisujemy je typem unii (np. `'daily_streak' | 'amount'`) i sprawdzamy w walidacji
  (ADR-009).
- (−) Ograniczona współbieżność zapisów, wystarczająca w naszej skali. Gdybyśmy kiedyś zmieniali
  bazę, Prisma ogranicza zmianę głównie do `provider` w schemacie.

---

## ADR-005: Warstwy backendu: routes → controllers → services → Prisma

**Status:** Zaakceptowana · **Data:** 2026-10-24

### Kontekst

Express nie narzuca struktury kodu. Chcieliśmy od początku ustalić, gdzie trafia jaka logika, żeby
kod był przewidywalny dla nas obojga, łatwy do przeglądania w PR-ach i żeby nie skończyło się
całym API w jednym `index.ts`.

### Decyzja

Podzieliliśmy kod serwera na warstwy, z których każda ma jedną odpowiedzialność:

| Warstwa     | Katalog                   | Odpowiedzialność                                                                    |
| :---------- | :------------------------ | :---------------------------------------------------------------------------------- |
| Routes      | `server/src/routes/`      | Mapowanie metody i ścieżki na kontroler, podpięcie middleware (np. `requireAuth`)   |
| Middleware  | `server/src/middleware/`  | Logika wspólna dla wielu tras: autoryzacja, obsługa błędów                          |
| Controllers | `server/src/controllers/` | Odczyt `req`, walidacja wejścia, wywołanie serwisu, ustawienie statusu i `res.json` |
| Services    | `server/src/services/`    | Logika biznesowa i zapytania Prisma, bez `req` i `res`                              |
| Prisma      | `server/src/prisma.ts`    | Jedna instancja klienta bazy                                                        |

Reguły:

- Zależności idą tylko w dół: route → controller → service → prisma. Serwis nie wie nic o HTTP.
- Jeden plik na zasób w każdej warstwie: `routes/goals.ts`, `controllers/goalsController.ts`,
  `services/goalsService.ts`.
- Kontroler nie importuje `prisma` bezpośrednio (wyjątek: `healthController`, który sprawdza samo
  połączenie z bazą).

Zapytania o cele są w `services/goalsService.ts`, a `goalsController.ts` tylko je wywołuje.

### Rozważone alternatywy

- **Wszystko w kontrolerach (2 warstwy):** mniej plików, ale logika biznesowa (np. liczenie serii)
  miesza się z obsługą HTTP i trudno ją ponownie użyć.
- **Podział według funkcji (`features/goals/...`):** wygodny w dużych projektach, ale przy kilku
  zasobach warstwy są czytelniejsze i odpowiadają diagramowi komponentów.

### Konsekwencje

- (+) Wiadomo, gdzie szukać kodu i gdzie dodać nowy, a w review łatwo sprawdzić, czy coś jest w
  dobrej warstwie.
- (+) Struktura bezpośrednio przekłada się na diagram komponentów (widok deweloperski).
- (+) Serwisy można testować bez uruchamiania serwera HTTP.
- (−) Więcej plików przy prostych operacjach CRUD.

---

## ADR-006: Kontrakt REST API pod `/api` w formacie JSON

**Status:** Zaakceptowana · **Data:** 2026-10-24 (uzupełniona 2026-10-29)

### Kontekst

Frontend i backend rozwijamy równolegle. Bez wspólnych zasad każdy endpoint zwracałby błędy i dane
w innym kształcie, a klient musiałby obsługiwać każdy przypadek osobno.

### Decyzja

- Wszystkie endpointy są pod prefiksem `/api`, a zasoby to rzeczowniki w liczbie mnogiej:
  `/api/auth`, `/api/goals`, `/api/goals/:id/progress`, `/api/feed`, `/api/posts/:id/comments`,
  `/api/posts/:id/support`.
- Metody HTTP stosujemy zgodnie z przeznaczeniem: `GET` odczyt, `POST` utworzenie, `PATCH`
  częściowa zmiana, `DELETE` usunięcie.
- Treść żądań i odpowiedzi to JSON. Daty w formacie ISO 8601 (UTC).
- Kody odpowiedzi: `200` OK, `201` utworzono, `204` brak treści, `400` błędne dane, `401`
  niezalogowany, `403` brak uprawnień, `404` nie znaleziono, `409` konflikt (np. zajęty e-mail),
  `500` błąd serwera.
- Błędy zawsze mają jeden kształt: `{ "error": "Komunikat dla użytkownika po polsku" }`, a przy
  błędach walidacji dodatkowo `"fields": { "title": "Tytuł celu jest wymagany" }`.
- Szczegóły techniczne błędów (stack trace, komunikaty Prismy) trafiają tylko do logów serwera
  (`console.error`), nigdy do odpowiedzi.
- Na końcu łańcucha w `index.ts` dodajemy jeden middleware obsługi błędów, który zamienia
  nieobsłużony wyjątek na `500` w powyższym formacie.
- Listy, które mogą rosnąć (feed, komentarze), zwracamy stronami: parametry `limit` i `cursor`
  (identyfikator ostatniego elementu), w odpowiedzi `{ "items": [...], "nextCursor": "..." }`.

### Rozważone alternatywy

- **GraphQL:** elastyczne zapytania, ale dodatkowa warstwa narzędzi, niepotrzebna przy kilku
  zasobach.
- **Brak ustalonego formatu błędów:** prostsze na start, ale każdy formularz w kliencie musiałby
  inaczej czytać błędy.

### Konsekwencje

- (+) Frontend ma jedną funkcję obsługi błędów (ADR-013).
- (+) API łatwo opisać na diagramach sekwencji i komunikacji.
- (+) Stronicowanie kursorem pasuje do feedu przewijanego jak rolki (dociąganie kolejnych wpisów).
- (−) Obecny `healthController` zwraca w błędzie pole `error: error.message`. Poprawimy to przy
  wprowadzaniu middleware błędów.

---

## ADR-007: Anonimowość: alias publiczny, e-mail tylko do logowania

**Status:** Zaakceptowana · **Data:** 2026-10-29

### Kontekst

Anonimowość to główny wyróżnik SecretGoals (z naszego badania rynku: „Zero-PII” w warstwie
publicznej). Jednocześnie US01 zakłada rejestrację e-mailem i hasłem. Użytkownik nie może być
rozpoznawalny dla innych, ale musi móc zalogować się na swoje konto z dowolnego urządzenia.

### Decyzja

- Rozdzieliliśmy dane konta na dwie warstwy:
  - **prywatną:** e-mail, hash hasła i powiązania z kontami Google/Facebook (ADR-016), używane
    wyłącznie do logowania,
  - **publiczną:** losowo generowany **alias** (np. `CichyLis42`) widoczny przy celach, postach i
    komentarzach.
- Alias generuje serwer przy rejestracji (przymiotnik + rzeczownik + liczba) i sprawdza jego
  unikalność. Użytkownik może wylosować nowy alias w profilu, ale nie wpisuje własnego, co
  zmniejsza ryzyko, że poda prawdziwe imię.
- **Żaden endpoint poza `GET /api/auth/me` (dane zalogowanego o sobie) nie zwraca e-maila.**
  Serwisy zwracające dane innych użytkowników wybierają pola jawnie (`select: { id, alias }`),
  zamiast zwracać cały obiekt `User`.
- Nie zbieramy imienia, nazwiska, zdjęcia, numeru telefonu ani lokalizacji, także przy logowaniu
  przez Google/Facebook. Nie ma wyszukiwania użytkowników po e-mailu.
- Cel ma flagę widoczności (`isPublic`). Prywatny cel i jego wpisy nie pojawiają się w feedzie ani
  w dopasowaniu rówieśnika (ADR-012).

### Rozważone alternatywy

- **Konto bez e-maila (sam alias + hasło)**, jak w pierwotnej propozycji wartości z zajęć 1:
  maksymalna anonimowość, ale brak możliwości odzyskania konta i sprzeczność z US01.
- **Szyfrowanie lub hashowanie e-maila w bazie:** lepsza ochrona przy wycieku bazy, ale komplikuje
  logowanie i ewentualny reset hasła. Możemy do tego wrócić osobnym ADR-em.

### Konsekwencje

- (+) Realizuje US01 (scenariusz 2: e-mail niewidoczny dla innych).
- (+) Jasna reguła do review: każde zapytanie o dane innego użytkownika ma `select` bez `email` i
  `passwordHash`.
- (−) Pomyłka w jednym endpoincie (zwrócenie całego `User`) łamie anonimowość, dlatego sprawdzamy
  to przy każdym review.
- (−) E-mail jest w bazie w postaci jawnej, więc plik bazy traktujemy jako dane wrażliwe (nie
  commitujemy go i nie wysyłamy).

---

## ADR-008: Uwierzytelnianie: hasło (bcrypt) + JWT w ciasteczku httpOnly

**Status:** Zaakceptowana · **Data:** 2026-10-29

### Kontekst

Większość historii użytkownika (US02–US05) zaczyna się od „użytkownik jest zalogowany”, a kolejnym
krokiem w projekcie jest rejestracja i logowanie (US01). Chcieliśmy rozwiązania bezpiecznego na
rozsądnym poziomie, bez zewnętrznych usług i bez przechowywania sesji na serwerze.

### Decyzja

- Hasła hashujemy biblioteką **bcrypt** (`bcryptjs`, koszt 10). Nigdy nie zapisujemy ani nie
  logujemy hasła w postaci jawnej.
- Po poprawnym logowaniu lub rejestracji serwer wystawia **JWT** (`jsonwebtoken`) z `userId` i
  czasem ważności 7 dni, podpisany sekretem `JWT_SECRET` z `server/.env`.
- Token trafia do **ciasteczka `httpOnly`, `sameSite=lax`** (w produkcji także `secure`), a nie do
  `localStorage`, więc skrypt na stronie nie ma do niego dostępu (ochrona przed kradzieżą tokenu
  przez XSS). Ciasteczko czyta `cookie-parser`.
- Endpointy:
  - `POST /api/auth/register` – e-mail + hasło → tworzy konto z aliasem, ustawia ciasteczko, `201`,
  - `POST /api/auth/login` – e-mail + hasło → ustawia ciasteczko, `200`,
  - `POST /api/auth/logout` – czyści ciasteczko, `204`,
  - `GET /api/auth/me` – dane zalogowanego (`id`, `alias`, `email`) albo `401`.
- Middleware `requireAuth` (`server/src/middleware/requireAuth.ts`) weryfikuje token, ustawia
  `req.userId` i zwraca `401`, gdy token jest nieprawidłowy. Podpinamy go w plikach `routes/` do
  każdej trasy wymagającej logowania.
- Właściciela zasobu bierzemy **zawsze z `req.userId`**, nigdy z treści żądania (np. `userId` w
  body jest ignorowane).
- Przy błędnym logowaniu zwracamy ten sam komunikat dla złego e-maila i złego hasła („Nieprawidłowy
  e-mail lub hasło”), żeby nie zdradzać, czy konto istnieje.
- Minimalne wymagania: poprawny format e-maila, hasło min. 8 znaków.
- Ten sam mechanizm (JWT w ciasteczku) wykorzystuje logowanie przez Google i Facebook (ADR-016).

### Rozważone alternatywy

- **Sesje po stronie serwera (`express-session` + tabela sesji):** łatwe wylogowanie ze wszystkich
  urządzeń, ale dodatkowy magazyn sesji i konfiguracja.
- **JWT w `localStorage` + nagłówek `Authorization`:** popularne w tutorialach, ale token jest
  dostępny dla każdego skryptu na stronie.
- **Zewnętrzny dostawca (Auth0, Firebase Auth, Clerk):** mniej kodu, ale dane logowania u strony
  trzeciej i mniej kontroli nad tym, co o użytkowniku przechowujemy.

### Konsekwencje

- (+) Serwer nie przechowuje sesji, wystarczy sprawdzić podpis tokenu.
- (+) Dzięki proxy Vite klient i API są pod tym samym adresem, więc ciasteczka działają bez
  dodatkowej konfiguracji CORS.
- (−) Wylogowanie usuwa ciasteczko, ale wystawiony token jest ważny do wygaśnięcia (akceptujemy to
  na tym etapie).
- (−) Ciasteczka wymagają ochrony przed CSRF. Uznaliśmy, że `sameSite=lax` i to, że zmiany stanu
  idą tylko przez `POST/PATCH/DELETE` z JSON, wystarczą w naszym zakresie.
- (−) Na razie nie mamy resetu hasła ani weryfikacji e-maila (możliwy przyszły ADR).

---

## ADR-009: Walidacja danych na serwerze i w kliencie

**Status:** Zaakceptowana · **Data:** 2026-10-29

### Kontekst

Kryteria akceptacji wymagają odrzucania błędnych danych (US02: cel bez nazwy, US04: pusty
komentarz). Formularz w przeglądarce można obejść, wysyłając żądanie bezpośrednio do API, więc
sama walidacja w kliencie nie wystarczy.

### Decyzja

- **Serwer zawsze waliduje** każde wejście w kontrolerze, przed wywołaniem serwisu, i zwraca `400`
  w formacie z ADR-006 (`error` + `fields`). To serwer jest źródłem prawdy.
- **Klient waliduje to samo** przed wysłaniem, dla wygody użytkownika (natychmiastowy komunikat pod
  polem). Walidacja w kliencie nie zastępuje serwerowej.
- Teksty przycinamy (`trim`) przed sprawdzeniem, więc „ ” to pusty komentarz.
- Limity długości: tytuł celu do 100 znaków, opis do 1000, komentarz do 500.
- Na razie walidację piszemy ręcznie (proste `if`). Gdy reguł przybędzie, wprowadzimy bibliotekę
  schematów (np. Zod) osobnym ADR-em.

### Rozważone alternatywy

- **Tylko walidacja w kliencie:** łatwo obejść, łamie kryteria akceptacji.
- **Zod od razu:** czytelne schematy współdzielone przez obie strony, ale przy kilku formularzach
  to więcej konfiguracji niż korzyści.

### Konsekwencje

- (+) Kryteria US02 i US04 są spełnione niezależnie od klienta.
- (−) Reguły są zapisane dwa razy (serwer i klient) i mogą się rozjechać, więc w review
  sprawdzamy, czy limity są takie same.

---

## ADR-010: Zmiany schematu bazy przez migracje Prisma

**Status:** Zaakceptowana · **Data:** 2026-10-29

### Kontekst

Do tej pory synchronizowaliśmy schemat poleceniem `prisma db push`, które nie zostawia historii
zmian. Przy logowaniu i kolejnych historiach schemat będzie się często zmieniał, a każde z nas ma
własną lokalną bazę. Bez historii zmian trudno odtworzyć u siebie bazę po zmianach drugiej osoby.

### Decyzja

- Od implementacji rejestracji zmieniamy schemat przez **`prisma migrate dev --name <opis>`**.
  Wygenerowane pliki w `server/prisma/migrations/` **commitujemy** razem ze zmianą schematu.
- Po pobraniu zmian z repozytorium wystarczy `npx prisma migrate dev`, żeby lokalna baza miała
  aktualny schemat.
- Nie edytujemy ręcznie zacommitowanych migracji. Błąd poprawiamy nową migracją.
- Dane testowe ładuje skrypt seed (`server/prisma/seed.ts`, `npx prisma db seed`), a nie ręczne
  wpisy w Prisma Studio.
- Do skryptów `package.json` dodajemy `prisma:migrate`, a `prisma:push` zostaje tylko do
  jednorazowych eksperymentów.

### Rozważone alternatywy

- **Zostać przy `db push`:** szybsze przy prototypowaniu, ale bez historii i z ryzykiem utraty
  danych przy zmianach.

### Konsekwencje

- (+) Historia zmian schematu w Git i spójne bazy u nas obojga.
- (+) Seed daje powtarzalne dane do demonstracji na zajęciach.
- (−) Przy przejściu trzeba utworzyć migrację bazową (lokalna `dev.db` może zostać zresetowana).
- (−) Konflikty migracji przy równoległej pracy na dwóch gałęziach rozwiązujemy ręcznie, dlatego
  zmiany schematu robimy w jednym PR naraz.

---

## ADR-011: Model danych i feed oparty na tabeli `Post`

**Status:** Zaakceptowana · **Data:** 2026-10-29

### Kontekst

Obecny schemat ma tylko `User` (alias) i `Goal` (z polem `streak`). Historie US01–US05 i prototyp
v2 wymagają konta z logowaniem, różnych typów celów (seria dzienna, cel kwotowy, licznik
tygodniowy), historii postępów z komentarzem, feedu społeczności, komentarzy i „wsparcia”.

Na start feed ma pokazywać proste rzeczy: nowe publiczne cele, meldunki z postępów, kamienie
milowe i poradniki. Wiemy jednak, że będziemy chcieli go rozbudowywać (np. rolki z wideo, ankiety,
inne rodzaje wpisów), więc model powinien pozwalać dodać nowy rodzaj wpisu bez przebudowy
komentarzy, wsparcia i samego feedu.

### Decyzja

Model danych opiera się na encjach (szczegóły pól pokaże diagram ERD):

| Encja           | Najważniejsze pola                                                                                            | Historia   |
| :-------------- | :------------------------------------------------------------------------------------------------------------ | :--------- |
| `User`          | `id`, `email` (unikalny, opcjonalny), `passwordHash` (opcjonalny), `alias` (unikalny), `role`, `createdAt`    | US01       |
| `AuthAccount`   | `userId`, `provider` (`google` / `facebook`), `providerUserId` (unikalna para z `provider`)                   | US01       |
| `Goal`          | `id`, `userId`, `title`, `description`, `type`, `category`, `targetValue`, `targetDate`, `isPublic`, `status` | US02, US05 |
| `ProgressEntry` | `id`, `goalId`, `value`, `note` (komentarz do postępu), `isShared`, `createdAt`                               | US03       |
| `Post`          | `id`, `authorId`, `type`, `goalId?`, `progressEntryId?`, `content?`, `createdAt`                              | US04, US05 |
| `Comment`       | `id`, `postId`, `authorId`, `content`, `createdAt`                                                            | US04       |
| `Support`       | `postId`, `userId` (unikalna para), `createdAt`                                                               | US05       |

**Feed to tabela `Post`.** Każdy wpis widoczny w społeczności jest rekordem `Post` z polem `type`,
który mówi, czym jest wpis:

| `type`      | Kiedy powstaje                                                   | Powiązanie        |
| :---------- | :--------------------------------------------------------------- | :---------------- |
| `goal`      | Automatycznie przy utworzeniu publicznego celu („cel jako post”) | `goalId`          |
| `progress`  | Automatycznie przy wpisie postępu z `isShared = true` (meldunek) | `progressEntryId` |
| `milestone` | Automatycznie, gdy cel osiągnie kamień milowy (np. 30 dni serii) | `goalId`          |
| `guide`     | Poradnik dodany przez konto zespołu (`User.role = 'team'`)       | `content`         |

Zasady modelu:

- **Komentarze i wsparcie zawsze wskazują na `Post`**, niezależnie od jego typu. „Wspieram” przy
  celu to `Support` na poście typu `goal` tego celu.
- Posty typu `goal`, `progress` i `milestone` tworzy **serwis**, a nie klient (np. `goalsService`
  przy zapisie publicznego celu). Gdy cel staje się prywatny, serwis usuwa jego posty z feedu.
- **Nowy rodzaj wpisu** (np. rolka z wideo, ankieta) to nowa wartość `type` plus, jeśli potrzeba,
  osobna tabela z dodatkowymi danymi powiązana z `Post` (np. `PostMedia`). Komentarze, wsparcie,
  stronicowanie i endpoint `/api/feed` działają bez zmian.
- Feed (`GET /api/feed`) to lista postów od najnowszych, stronicowana kursorem (ADR-006), z filtrem
  typu („Kamienie milowe”, „Poradniki”) i kategorii celu („Podobne cele”, ADR-012).
- **Seria i postęp są wyliczane z `ProgressEntry`**, a nie trzymane jako licznik w `Goal`. Pole
  `Goal.streak` usuwamy przy pierwszej migracji (ADR-010), żeby licznik nie rozjechał się z
  historią.
- `Goal.type`: `daily_streak` | `amount` | `weekly_count` (string, ADR-004). Od niego zależą
  przyciski aktualizacji postępu w UI.
- `Goal.userId` staje się wymagane, bo po wprowadzeniu logowania każdy cel ma właściciela.
- Usunięcie użytkownika usuwa kaskadowo jego cele, wpisy postępu, posty, komentarze i wsparcie.

### Rozważone alternatywy

- **Feed składany z kilku tabel bez `Post`** (publiczne cele + udostępnione wpisy postępu): mniej
  tabel na start, ale każdy nowy rodzaj wpisu wymagałby zmian w zapytaniu feedu oraz w `Comment` i
  `Support`, które musiałyby wskazywać na kilka różnych tabel.
- **Osobna tabela dla każdego rodzaju wpisu** (`GoalPost`, `MilestonePost`, ...): czytelne pola, ale
  feed wymaga łączenia wielu tabel, a komentarze i wsparcie trzeba by powielać.
- **Licznik serii w `Goal`:** prostsze odczyty, ale łatwo o niespójność przy edycji historii.

### Konsekwencje

- (+) Model pokrywa historie US01–US05 i jest podstawą ERD oraz DFD.
- (+) Rozbudowa feedu o nowe rodzaje treści nie wymaga zmian w komentarzach, wsparciu ani
  stronicowaniu.
- (+) Statystyki (seria, procent realizacji, mapa aktywności) liczy jeden serwis z historii wpisów.
- (−) Część danych jest powiązana dwa razy (cel i jego post), więc serwisy muszą pilnować spójności
  (np. przy zmianie widoczności celu).
- (−) Większość pól `Post` jest opcjonalna i ich znaczenie zależy od `type`, co sprawdzamy w
  walidacji (ADR-009).
- (−) Wyliczanie serii przy każdym odczycie, akceptowalne w naszej skali.

---

## ADR-012: Dopasowanie „rówieśnika” (US05) po kategorii celu

**Status:** Zaakceptowana · **Data:** 2026-10-29

### Kontekst

US05 zakłada, że na ekranie celu użytkownik automatycznie widzi wpis innej osoby z podobnym celem.
Musieliśmy zdefiniować „podobieństwo” tak, żeby dało się je zaimplementować i przetestować.

### Decyzja

- Przy tworzeniu celu użytkownik wybiera **kategorię** z zamkniętej listy (np. `nalogi`,
  `zdrowie`, `finanse`, `nauka`, `praca`, `inne`), zapisywaną w `Goal.category`.
- Rówieśnik to **publiczny cel innego użytkownika w tej samej kategorii** (i tego samego typu, jeśli
  taki istnieje), z aktywnością (wpis postępu) w ostatnich 7 dniach. Spośród pasujących wybieramy
  losowo.
- Odpowiada za to `GET /api/goals/:id/peer`, który zwraca post celu rówieśnika (alias, tytuł,
  krótkie podsumowanie postępu) albo `204`, gdy nikt nie pasuje (UI wtedy nie pokazuje sekcji).
- Przycisk „Wspieram” tworzy rekord `Support` dla tego posta (`POST /api/posts/:id/support`).
  Ponowne kliknięcie nie tworzy duplikatu.

### Rozważone alternatywy

- **Podobieństwo tekstu tytułów (wyszukiwanie pełnotekstowe, embeddingi, AI):** lepsze dopasowania,
  ale złożone, trudne do przetestowania i zależne od zewnętrznych usług.
- **Tagi wpisywane przez użytkownika:** elastyczne, ale literówki i synonimy psują dopasowanie.

### Konsekwencje

- (+) Prosta, deterministyczna reguła, łatwa do pokazania na diagramie sekwencji.
- (+) Lista kategorii służy też do filtra „Podobne cele” w społeczności.
- (−) Dopasowanie jest zgrubne (wszyscy w kategorii `zdrowie` są „podobni”).
- (−) Do dopasowania trafiają tylko cele publiczne, zgodnie z ADR-007.

---

## ADR-013: Frontend: routing, stan i komunikacja z API

**Status:** Zaakceptowana · **Data:** 2026-10-29

### Kontekst

Prototyp v2 ma widoki: Logowanie/Rejestracja, Cele, Społeczność, Profil, z nawigacją dolną na
telefonie i boczną na desktopie. Obecnie klient ma jeden komponent `App.jsx` z testem połączenia,
więc ustalamy strukturę, zanim zaczniemy dodawać widoki.

### Decyzja

- Do nawigacji używamy **React Router** (`/login`, `/goals`, `/community`, `/profile`). Widoki
  chronione przekierowują niezalogowanego na `/login`.
- Struktura katalogów `client/src/` (już założona):
  - `pages/` – jeden plik na widok (`GoalsPage.tsx`, `CommunityPage.tsx`, ...),
  - `components/` – komponenty wielokrotnego użytku (`GoalCard.tsx`, `BottomNav.tsx`, ...),
  - `hooks/` – własne hooki z logiką i pobieraniem danych (`useGoals.ts`, `useAuth.ts`),
  - `api/` – **jedyne miejsce, w którym wywołujemy `fetch`**. Wspólna funkcja `apiRequest` dodaje
    `credentials: 'include'` i nagłówek JSON oraz zamienia odpowiedź z błędem (ADR-006) na wyjątek
    z komunikatem.
- Stan globalny to tylko zalogowany użytkownik w **React Context** (`AuthContext`). Resztę stanu
  trzymają komponenty i hooki (`useState`, `useEffect`). Nie używamy Reduxa.
- Komponenty w `pages/` i `components/` nie wołają `fetch` bezpośrednio, tylko funkcje z `api/`
  (zwykle przez hook).

### Rozważone alternatywy

- **Redux / Zustand:** niepotrzebne przy jednym globalnym stanie (zalogowany użytkownik).
- **TanStack Query:** cache i odświeżanie danych, ale na tym etapie wystarczą nam zwykłe hooki.
  Możemy go wprowadzić później osobnym ADR-em, np. przy rozbudowie feedu.
- **Przełączanie widoków przez `useState` bez routera:** brak adresów URL, przycisk „wstecz” nie
  działa i nie da się wysłać linku do widoku.

### Konsekwencje

- (+) Jasne miejsca na kod: wygląd w `components/`, widok w `pages/`, dane w `hooks/` i `api/`.
- (+) Zmiana adresu lub formatu API dotyka tylko plików w `api/`.
- (−) Dodatkowa zależność `react-router` i obsługa tras chronionych.

---

## ADR-014: Responsywny web zamiast aplikacji mobilnej

**Status:** Zaakceptowana · **Data:** 2026-10-24

### Kontekst

Z habit trackera korzysta się głównie na telefonie, ale SecretGoals budujemy jako aplikację
webową i nie chcieliśmy utrzymywać dwóch baz kodu. Prototyp v2 projektuje każdy ekran w wersji
telefon i desktop.

### Decyzja

- Robimy jedną aplikację webową, **mobile-first**, dostosowaną do desktopu przez breakpointy
  Tailwinda.
- Na telefonie nawigacja dolna, na desktopie boczna. Feed społeczności przewija się pionowo na
  obu.
- Nie robimy aplikacji natywnej ani React Native. PWA (instalacja na ekranie głównym) to możliwe
  rozszerzenie, ale nie jest wymagane.

### Rozważone alternatywy

- **Aplikacja natywna / React Native:** lepsze doświadczenie na telefonie, ale osobny kod i
  publikacja w sklepach, poza zakresem projektu.
- **Tylko widok mobilny:** prostsze, ale słabe doświadczenie na komputerze, na którym będziemy
  prezentować aplikację na zajęciach.

### Konsekwencje

- (+) Jedna baza kodu, działa wszędzie, gdzie jest przeglądarka.
- (−) Brak natywnych powiadomień push (przypomnienia o nawykach).
- (−) Każdy widok sprawdzamy w dwóch szerokościach ekranu.

---

## ADR-015: Jakość kodu: Oxlint, Prettier, Husky i review przez Pull Request

**Status:** Zaakceptowana · **Data:** 2026-10-24 (uzupełniona 2026-10-29)

### Kontekst

Kod piszemy we dwójkę, równolegle i częściowo z pomocą narzędzi AI. Chcieliśmy, żeby styl i
podstawowe błędy pilnował automat, a w przeglądzie kodu skupiać się na logice i bezpieczeństwie
(np. żeby żaden endpoint nie ujawniał danych prywatnych).

### Decyzja

- **Oxlint** (konfiguracja `.oxlintrc.json` w katalogu głównym) – błędy `correctness` blokują
  commit, w kliencie dochodzą reguły hooków React i dostępności (`jsx-a11y`).
- **Prettier** – jednolite formatowanie (bez średników, pojedyncze cudzysłowy, 100 znaków).
- **Husky + lint-staged** – przed każdym commitem automatycznie `oxlint --fix` i
  `prettier --write` na zmienionych plikach.
- **Gałęzie i Pull Requesty:** nie pracujemy bezpośrednio na `main`. Zmiany trafiają przez gałąź
  `feature/<nazwa>` lub `fix/<nazwa>` i Pull Request, który przegląda druga osoba przed scaleniem.
- **Lista kontrolna review** (krótka, sprawdzana przy każdym PR):
  1. `npm run check` (linter, formatowanie i sprawdzenie typów) przechodzi bez błędów.
  2. Kod jest w odpowiedniej warstwie (ADR-005, ADR-013).
  3. Żaden endpoint nie zwraca `email` ani `passwordHash` innych użytkowników (ADR-007).
  4. Trasy zmieniające dane mają `requireAuth`, a właściciel jest brany z `req.userId` (ADR-008).
  5. Dane wejściowe są walidowane na serwerze (ADR-009).
  6. Zmiana schematu ma migrację (ADR-010).
  7. Brak sekretów, plików `.env` i baz `*.db` w commicie.
  8. Brak `any` i wyciszania błędów typów (`@ts-ignore`) bez komentarza z uzasadnieniem (ADR-017).

### Rozważone alternatywy

- **ESLint:** standard branżowy, ale wolniejszy i z bardziej złożoną konfiguracją niż Oxlint.
- **Commity bezpośrednio na `main`:** szybciej, ale bez szansy na wyłapanie błędów przed scaleniem.

### Konsekwencje

- (+) Styl i podstawowe błędy pilnuje automat, a review skupia się na logice i bezpieczeństwie.
- (+) Lista kontrolna łączy decyzje z tego pliku z codzienną pracą.
- (−) Hook pre-commit działa dopiero po `npm install` w katalogu głównym. Jeśli ktoś go pominie,
  niesformatowany kod wyłapie `npm run check` przy review.
- (−) Wymóg review spowalnia scalanie zmian.

---

## ADR-016: Logowanie przez Google i Facebook (OAuth 2.0)

**Status:** Zaakceptowana · **Data:** 2026-10-29

### Kontekst

Rejestracja e-mailem i hasłem (ADR-008) to podstawa US01, ale logowanie jednym kliknięciem przez
Google lub Facebook obniża próg wejścia i zwalnia użytkownika z pamiętania kolejnego hasła.
Jednocześnie nie może to naruszyć anonimowości wobec innych użytkowników (ADR-007).

### Decyzja

- Obok e-maila i hasła dodajemy logowanie przez **Google** (OpenID Connect) i **Facebook**
  (OAuth 2.0). Wdrażamy je po działającej rejestracji e-mailem i hasłem.
- Przepływ obsługuje **Passport.js** (`passport-google-oauth20`, `passport-facebook`) w trybie bez
  sesji (`session: false`). Passport służy tylko do wymiany kodu z dostawcą, a po powrocie serwer
  wystawia **nasz własny JWT w ciasteczku**, tak samo jak w ADR-008. Reszta aplikacji (middleware
  `requireAuth`, `/api/auth/me`) nie wie, jak użytkownik się zalogował.
- Endpointy:
  - `GET /api/auth/google` i `GET /api/auth/facebook` – przekierowanie do dostawcy,
  - `GET /api/auth/google/callback` i `GET /api/auth/facebook/callback` – powrót od dostawcy,
    ustawienie ciasteczka i przekierowanie na `/goals`.
- Prosimy dostawcę o **minimalny zakres danych** (Google: `openid email`, Facebook: `email`).
  Zapisujemy tylko identyfikator użytkownika u dostawcy (`AuthAccount.providerUserId`) i e-mail.
  Nie pobieramy ani nie zapisujemy imienia, nazwiska ani zdjęcia profilowego.
- Alias generujemy tak samo jak przy zwykłej rejestracji. W interfejsie informujemy, że dane z
  Google/Facebooka nie są widoczne dla innych.
- Jeśli dostawca zwróci zweryfikowany e-mail, który ma już konto w SecretGoals, łączymy logowanie z
  tym kontem (nowy rekord `AuthAccount`). W przeciwnym razie tworzymy nowe konto. Konto założone
  przez Google/Facebook nie ma hasła (`passwordHash` jest pusty).
- Identyfikatory i sekrety aplikacji (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
  `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`) trzymamy w `server/.env`, a ich nazwy dopisujemy do
  `server/.env.example`.

### Rozważone alternatywy

- **Ręczna implementacja OAuth (bez Passporta):** pełna kontrola, ale więcej kodu związanego z
  bezpieczeństwem (parametr `state`, wymiana kodu, weryfikacja tokenu), w którym łatwo o błąd.
- **Firebase Auth / Auth0:** gotowe przyciski i obsługa wielu dostawców, ale dane logowania u
  strony trzeciej i drugi system tożsamości obok naszego JWT.
- **Tylko e-mail i hasło:** prościej, ale wygoda logowania jednym kliknięciem ma znaczenie przy
  aplikacji, do której wraca się codziennie.

### Konsekwencje

- (+) Szybsza rejestracja i brak kolejnego hasła do zapamiętania.
- (+) Jeden mechanizm sesji (JWT w ciasteczku) dla wszystkich metod logowania.
- (−) Google i Facebook wiedzą, że użytkownik korzysta z SecretGoals. Dla innych użytkowników
  pozostaje anonimowy, ale dlatego logowanie przez dostawcę jest opcją, a nie wymogiem.
- (−) Trzeba zarejestrować aplikację w Google Cloud Console i Meta for Developers oraz ustawić
  adresy powrotu (lokalnie `http://localhost:5173/api/auth/<dostawca>/callback`, przez proxy Vite).
- (−) Facebook nie zawsze zwraca e-mail. Takie konto powstaje bez e-maila (dlatego `User.email`
  jest opcjonalny) i nie da się go połączyć z istniejącym kontem.

---

## ADR-017: TypeScript na frontendzie i backendzie

**Status:** Zaakceptowana · **Data:** 2026-10-29

### Kontekst

Pierwszy setup projektu powstał w JavaScripcie, ale od początku chcieliśmy pisać w TypeScripcie.
Model danych (ADR-011) ma sporo pól opcjonalnych i typów zależnych od pola `type`, a API zwraca
dane w ustalonym kształcie (ADR-006). Typy pozwalają wyłapać niezgodności w edytorze i przy
kompilacji, zanim trafią do PR.

### Decyzja

- Cały kod aplikacji piszemy w **TypeScripcie**: klient w `.ts`/`.tsx`, serwer w `.ts`. Pliki
  konfiguracyjne narzędzi mogą zostać w JS, jeśli narzędzie tego wymaga.
- W obu częściach włączamy tryb **`strict`** w `tsconfig.json`.
- **Klient:** Vite kompiluje TypeScript bez sprawdzania typów, więc typy sprawdza osobno
  `tsc --noEmit` (skrypt `typecheck`).
- **Serwer:** w trybie deweloperskim kod uruchamia `tsx watch`, a `npm run build --prefix server`
  kompiluje go `tsc` do `server/dist/`, skąd startuje `node dist/index.js`.
- Typy modeli bazy bierzemy z wygenerowanego klienta Prisma, a nie definiujemy ich ręcznie.
- Typy żądań i odpowiedzi API opisujemy w `client/src/api/types.ts`. Wspólny katalog typów dla
  klienta i serwera (np. `shared/`) rozważymy osobnym ADR-em, gdy API się ustabilizuje.
- Unikamy `any`. Dane spoza aplikacji (body żądania, odpowiedź z API) traktujemy jako `unknown` i
  zawężamy je walidacją (ADR-009).
- `npm run check` w katalogu głównym obejmuje też sprawdzenie typów w obu częściach, a Oxlint
  dostaje plugin `typescript`.
- Pierwotne pliki JS (`client/src/*.jsx`, `server/src/**/*.js`) przepisaliśmy na TypeScript
  29.10.2026, przed implementacją logowania.

### Rozważone alternatywy

- **JavaScript:** brak kroku kompilacji, ale błędy typów wychodzą dopiero w czasie działania, a
  przy modelu z wieloma polami opcjonalnymi to częste źródło błędów.
- **JavaScript z JSDoc i `checkJs`:** częściowe sprawdzanie typów bez zmiany rozszerzeń, ale
  rozwlekła składnia i słabsze wsparcie niż w zwykłym TypeScripcie.
- **`ts-node` / `nodemon` zamiast `tsx`:** wolniejszy start i więcej konfiguracji przy modułach ES.

### Konsekwencje

- (+) Edytor podpowiada pola modeli i odpowiedzi API, a literówki w nazwach pól wychodzą od razu.
- (+) Typy Prismy chronią przed zapytaniami o nieistniejące pola i relacje.
- (+) Typy pomagają w review: sygnatury funkcji serwisów pokazują, co przyjmują i zwracają.
- (−) Dochodzi krok kompilacji serwera i osobne sprawdzanie typów w kliencie.
- (−) Jednorazowa migracja istniejących plików JS i konfiguracji (`tsconfig.json`, skrypty,
  `.oxlintrc.json`, `lint-staged` dla `*.ts`/`*.tsx`).

---

## Poza zakresem obecnych decyzji

Świadomie odkładamy na później (osobne ADR-y, gdy staną się potrzebne): testy automatyczne,
wdrożenie aplikacji na serwer, konteneryzację i CI/CD, przechowywanie plików multimedialnych (np.
wideo do rolek), reset hasła i weryfikację e-maila, moderację treści i zgłaszanie nadużyć oraz
powiadomienia o nawykach.

---

## Szablon nowego ADR

```markdown
## ADR-XXX: Krótki tytuł decyzji

**Status:** Proponowana · **Data:** RRRR-MM-DD

### Kontekst

Jaki problem rozwiązujemy i jakie mamy ograniczenia?

### Decyzja

Co postanowiliśmy zrobić (konkretnie: „robimy X”)?

### Rozważone alternatywy

- **Opcja A:** dlaczego jej nie wybraliśmy.

### Konsekwencje

- (+) Co zyskujemy.
- (−) Co tracimy albo co będziemy musieli zrobić.
```
