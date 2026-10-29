# Prototypy UI

## Aktualny prototyp (v2, październik 2026)

Interaktywny prototyp: https://claude.ai/artifact/UHzWL2uCYZhz1JscS3Xvne

Źródła ekranów są w folderze [`v2-ui/`](v2-ui/) (format `.dc.html` edytora prototypów, otwierają się poprawnie tylko w nim).

| Ekran | Telefon | Desktop |
| :--- | :--- | :--- |
| Cele | `Main.dc.html` | `DesktopGoals.dc.html` |
| Społeczność | `Community.dc.html` | `DesktopCommunity.dc.html` |
| Profil | `Profile.dc.html` | `DesktopProfile.dc.html` |
| Logowanie i rejestracja | `Auth.dc.html` | `DesktopAuth.dc.html` |

### Założenia

- **Cele:** u góry przełącznik między celami. W celu seria, pasek do kamienia milowego, 3 statystyki i podgląd tygodnia. Postęp aktualizowany przyciskami zależnymi od typu celu (seria dzienna: „Zaliczone” / „Potknięcie”, cel kwotowy: wpłaty, licznik tygodniowy: +1) oraz opcjonalnym meldunkiem publikowanym w społeczności. Pod celem przycisk „Strategie i poradniki” otwierający popup z treściami przygotowanymi przez zespół.
- **Cel jako post:** każdy publiczny cel jest automatycznie postem w społeczności, a „polubienie” to wsparcie („Wspieram”). Na ekranie celu widać liczbę wspierających, ostatni komentarz i osobę z podobnym celem (US05).
- **Społeczność:** pionowy feed pełnoekranowych wpisów jak rolki (meldunki, kamienie milowe, poradniki, nowe cele), przewijany scrollem także na desktopie. Filtry: Dla Ciebie, Podobne cele, Kamienie milowe, Poradniki.
- **Profil:** alias z możliwością wylosowania nowego, podsumowanie, mapa aktywności, widoczność celów, ustawienia.
- **Logowanie i rejestracja:** jeden ekran z przełącznikiem. Rejestracja wymaga tylko e-maila i hasła, a alias jest generowany automatycznie (można go wylosować ponownie). Informacja, że e-mail nie jest nigdy pokazywany innym (US01).
- **Responsywność:** aplikacja webowa dla telefonów i komputerów (nawigacja dolna na telefonie, boczna na desktopie).

### Styl

- Ciemne tło `#0F1115`, karty `#181B21`, obramowania `#2C313A`.
- Akcent zielony `#5BD69B` (seria, główne akcje), niebieski `#8AB4FF` (wsparcie).
- Fonty: Bricolage Grotesque (nagłówki, liczby), Inter (tekst). Ikony: Lucide.

## Wcześniejsze podejścia

`prototype-final-alpha.html`, `prototype-final-beta.html` i `secretgoals_prot 1 i 2 old preview.html` to wcześniejsze podejścia (alfa i beta to nazwy dwóch koncepcji, nie wersje). Z nich pochodzą pomysły funkcji, wygląd został zaprojektowany od nowa w v2.
