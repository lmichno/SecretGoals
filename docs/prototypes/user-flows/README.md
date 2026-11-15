# User flows i stany ekranów

Schemat wszystkich ścieżek w interfejsie Secret Goals (sukcesy i błędy), stany systemu (ładowanie, puste, błędy)
oraz powiązanie każdego kroku z makietami High-Fi.

Interaktywna wersja (wymaga konta claude.ai): https://claude.ai/artifact/UHzWL2uCYZhz1JscS3Xvne,
strony „User flows” i „Stany ekranów”. Linki „Mobile” / „Desktop” w kartach działają w trybie Play.

## Flows (`flows/`)

| Plik | Zakres |
| :--- | :--- |
| `Flow-00-Mapa.dc.html` | mapa nawigacji i stany globalne |
| `Flow-01-Rejestracja.dc.html` | US01: rejestracja, walidacja, 400 / 409 / 500, powitanie z aliasem |
| `Flow-02-Logowanie.dc.html` | US01: sprawdzanie sesji, logowanie, 400 / 401 / 500, wygaśnięcie sesji, wylogowanie |
| `Flow-03-Nowy-cel.dc.html` | US02: formularz celu, brak nazwy, zapis, post publicznego celu |
| `Flow-04-Postep.dc.html` | US03: postęp zależnie od typu celu, „Inna kwota”, 409, błąd zapisu, meldunek, kamień milowy |
| `Flow-05-Spolecznosc.dc.html` | US04: feed, pusty filtr, „Wspieram”, komentarze, pusty komentarz, nowy wpis |
| `Flow-06-Rowiesnik.dc.html` | US05: dopasowanie rówieśnika, brak rówieśnika, wsparcie i jego błąd |
| `Flow-07-Profil.dc.html` | profil: alias, widoczność, ustawienia, wylogowanie; dialog poradników |

Legenda kart: ekran, akcja użytkownika, system / API, decyzja (romb), stan ładowania (linia przerywana),
stan pusty (kropkowana), błąd (czerwony), sukces (zielony).

## Stany ekranów (`stany/`)

`S-<grupa>-<wariant>.dc.html` to mobile (390 × 844), `SD-<grupa>-<wariant>.dc.html` to desktop (1440 px).
Grupy: `global`, `auth`, `cele`, `cel` (nowy cel), `spol`, `kom` (komentarze), `wpis` (nowy wpis), `profil`.

## Ustalenia zawarte we flow

- Hasło: co najmniej 8 znaków, w tym cyfra.
- Alias nadaje serwer przy rejestracji, formularz go nie pokazuje; użytkownik widzi go na powitaniu.
- „Powtórz hasło” i zgoda na regulamin są sprawdzane w przeglądarce przed wysłaniem.
- „Nie pamiętasz hasła?” dodamy później.
- Po rejestracji spokojne powitanie: alias, jedno zdanie i przycisk „Dodaj pierwszy cel”.
- Formularz celu: nazwa (wymagana), opis, kategoria, typ, wartość docelowa, termin, widoczność.

Format plików `.dc.html` opisuje [UI_GUIDE.md](../UI_GUIDE.md), punkt 6.
