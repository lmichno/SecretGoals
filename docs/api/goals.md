# API celów (`/api/goals`)

Kontrakt endpointów celów dla frontendu (US02). Ogólne zasady API, format błędów i kody odpowiedzi
opisuje ADR-006 w [`docs/ADR.md`](../ADR.md). Przykładowe żądania do uruchomienia w edytorze są w
[`server/requests/goals.http`](../../server/requests/goals.http).

Wszystkie endpointy wymagają zalogowania (ciasteczko `sg_token` z `/api/auth/login` lub
`/api/auth/register`). Bez niego zwracają `401 { "error": "Musisz się zalogować" }`, a klient
przechodzi do ekranu logowania.

| Metoda i ścieżka     | Co robi                                                         | Odpowiedzi                        |
| :------------------- | :-------------------------------------------------------------- | :-------------------------------- |
| `POST /api/goals`    | Tworzy cel. Cel publiczny dostaje też wpis „Nowy cel” w feedzie | `201`, `400`, `401`, `409`        |
| `GET /api/goals`     | Lista moich celów, najnowsze pierwsze, bez zarchiwizowanych     | `200`, `401`                      |
| `GET /api/goals/:id` | Jeden mój cel                                                   | `200`, `401`, `404` (także cudzy) |

## Obiekt celu

Ten sam kształt zwracają wszystkie trzy endpointy. Odpowiedź nigdy nie zawiera `userId`.

```json
{
  "id": "6f1c2a9e-5b1d-4c8e-9a51-2d7f3e0b9c11",
  "title": "Bieganie 3 razy w tygodniu",
  "description": "Zaczynam od zera, po kontuzji kolana.",
  "category": "sport",
  "type": "weekly_count",
  "targetValue": 3,
  "targetDate": "2027-03-01T00:00:00.000Z",
  "isPublic": true,
  "status": "active",
  "createdAt": "2026-11-08T13:40:00.000Z"
}
```

`targetDate` to sam dzień zapisany jako północ UTC. Do wyświetlenia wystarczy pierwsze 10 znaków
(`"2027-03-01"`). `description`, `targetValue` i `targetDate` mogą być `null`.

## `POST /api/goals`

Treść żądania (JSON). Wymagana jest tylko nazwa, reszta ma wartości domyślne.

| Pole          | Typ                 | Domyślnie        | Reguła                                                    |
| :------------ | :------------------ | :--------------- | :-------------------------------------------------------- |
| `title`       | string              | brak (wymagane)  | po obcięciu spacji 1–100 znaków                           |
| `description` | string              | `null`           | po obcięciu spacji do 1000 znaków, pusty = `null`         |
| `category`    | string              | `"inne"`         | `nalog`, `finanse`, `sport`, `kariera`, `zdrowie`, `inne` |
| `type`        | string              | `"daily_streak"` | `daily_streak`, `amount`, `weekly_count`                  |
| `targetValue` | number              | zależy od typu   | patrz tabela niżej                                        |
| `targetDate`  | string `YYYY-MM-DD` | `null`           | istniejący dzień, od dziś (czas polski) do 5 lat naprzód  |
| `isPublic`    | boolean             | `true`           | `true` = cel widoczny w Społeczności pod aliasem          |

Wartość docelowa zależy od typu:

| `type`         | Etykieta w UI      | `targetValue`                                                   |
| :------------- | :----------------- | :-------------------------------------------------------------- |
| `daily_streak` | Seria dzienna      | zawsze `null`; wysłana wartość jest pomijana                    |
| `amount`       | Cel kwotowy        | wymagana liczba > 0 i ≤ 10 000 000 (PLN), zaokrąglana do groszy |
| `weekly_count` | Licznik tygodniowy | wymagana liczba całkowita 1–7 („Ile razy w tygodniu?”)          |

Etykiety kategorii w UI: `nalog` Nałóg, `finanse` Finanse, `sport` Sport, `kariera` Kariera,
`zdrowie` Zdrowie, `inne` Inne.

Pola `id`, `userId` i `status` w treści są pomijane: właścicielem jest zawsze zalogowany
użytkownik, a nowy cel ma status `active`.

### Odpowiedzi

`201` zwraca utworzony cel (obiekt wyżej). Klient dodaje go na początek listy i ustawia jako wybrany.

`400` przy błędnych polach. Wszystkie błędy przychodzą naraz, klucz w `fields` to nazwa pola:

```json
{ "error": "Popraw zaznaczone pola", "fields": { "title": "Podaj nazwę celu" } }
```

| Pole          | Komunikaty                                                                                           |
| :------------ | :--------------------------------------------------------------------------------------------------- |
| `title`       | „Podaj nazwę celu”, „Nazwa może mieć najwyżej 100 znaków”                                            |
| `description` | „Opis może mieć najwyżej 1000 znaków”, „Opis musi być tekstem”                                       |
| `category`    | „Wybierz kategorię z listy”                                                                          |
| `type`        | „Wybierz typ celu”                                                                                   |
| `targetValue` | „Podaj kwotę większą od zera”, „Kwota może wynosić najwyżej 10 000 000 zł”, „Podaj liczbę od 1 do 7” |
| `targetDate`  | „Podaj poprawną datę”, „Termin nie może być w przeszłości”, „Termin może być najpóźniej za 5 lat”    |
| `isPublic`    | „Wybierz widoczność”                                                                                 |

`409` gdy konto ma już 5 aktywnych celów. Komunikat pokazujemy w banerze nad formularzem:

```json
{
  "error": "Możesz mieć najwyżej 5 aktywnych celów. Zakończ albo zarchiwizuj któryś, żeby dodać nowy."
}
```

`500` albo brak sieci: baner „Wystąpił błąd serwera…”, dane zostają w formularzu (Flow 3).

## `GET /api/goals`

Zwraca tablicę obiektów celu zalogowanego użytkownika: najnowsze pierwsze, bez celów ze statusem
`archived`. Pusta tablica oznacza pusty stan „Dodaj pierwszy cel”.

## `GET /api/goals/:id`

Zwraca jeden obiekt celu. Gdy cel nie istnieje albo należy do kogoś innego, odpowiedź to
`404 { "error": "Nie znaleziono celu" }` (nie zdradzamy, że cudzy cel istnieje).

## Walidacja w kliencie

Formularz sprawdza te same reguły przed wysłaniem (ADR-009), ale serwer i tak sprawdza wszystko
ponownie. Przy zmianie reguł trzeba zaktualizować `server/src/domain/goalRules.ts`, ten plik i
walidację w kliencie.
