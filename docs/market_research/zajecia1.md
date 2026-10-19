# SecretGoals – Raport z Etapu 1: Inicjalizacja Projektu i Inżynieria Wymagań

**Grupa:** 5C  
**Skład zespołu:** Aleksandra Nowak, Łukasz Michno  
**Wybrane IDE:** Visual Studio Code  
**Repozytorium GitHub:** [https://github.com/lmichno/SecretGoals](https://github.com/lmichno/SecretGoals)  

---

## 1. Tematyka Projektu i Założenia Domenowe

* **Opis:** Anonimowa platforma webowa łącząca mechanizmy śledzenia celów i nawyków z systemem wspólnego wsparcia społecznościowego.
* **Problem biznesowy:** Tradycyjne aplikacje do monitorowania nawyków są szybko porzucane z powodu izolacji użytkowników i braku wsparcia z zewnątrz. Z kolei klasyczne serwisy społecznościowe (np. Facebook) nie sprawdzają się przy trudnych wyzwaniach (np. walka z alkoholizmem lub paleniem) ze względu na publiczny charakter wpisów, obawę przed oceną bliskich i utratą wizerunku.
* **Rozwiązanie:** Bezwzględna anonimizacja kont – logowanie postępów pod aliasami eliminuje lęk przed oceną otoczenia i buduje poczucie wspólnoty, zapobiegając porzucaniu celów.

---

## 2. Przyjęty Stos Technologiczny

| Warstwa systemu | Wybrana technologia | Uzasadnienie |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) + Tailwind CSS | Szybki rendering, optymalizacja, modularność komponentowa, prosta i powtarzalna stylizacja. |
| **Backend** | Node.js + Express.js | Prostota i intuicyjność rozwiązania, lekka obsługa REST API. |
| **Baza danych** | SQLite + Prisma ORM | Ułatwienie operacji na bazie, eliminacja surowego SQL, obsługa błędów, bezproblemowa migracja silnika (np. do PostgreSQL). |
| **Repozytorium** | GitHub | Standard branżowy, bezpłatny hosting kodu. |

---

## 3. Business Model Canvas

* **Segmenty Klientów:** Osoby walczące z trudnymi nałogami/nawykami (palenie, alkohol, prokrastynacja), osoby w kryzysie zawodowym lub finansowym (szukanie pracy, redukcja długu), introwertycy ceniący prywatność oraz użytkownicy dążący do poprawy codziennej produktywności.
* **Propozycja Wartości:** 100% anonimowości (brak wymogu podawania maila czy imienia), wsparcie rówieśnicze w dedykowanych, tematycznych feedach oraz lekki tracker nawyków z bazą presetów i wizualizacją serii.
* **Kanały Dotarcia:** Aplikacja webowa PWA oraz fora i grupy wsparcia (Reddit, Wykop).
* **Relacje z Klientami:** Pełny self-service (start sesji pod aliasem w <30 s), współtworzenie motywacji przez mikro-interakcje użytkowników, transparentność bez inwazyjnej telemetrii i spamu.
* **Strumienie Przychodów:** Model Freemium (wersja darmowa do 3 celów; wersja Pro z nielimitowanymi celami i analityką) oraz dobrowolne wpłaty wspierających.
* **Kluczowe Zasoby:** Kod źródłowy i repozytorium GitHub, infrastruktura serwerowa (Linux VPS, konteneryzacja Docker, warstwa proxy), dwuosobowy zespół programistyczny.
* **Kluczowe Aktywności:** Rozwój oprogramowania (moduły trackera, REST API), utrzymanie infrastruktury (CI/CD, backupy bazy, monitoring) oraz mechanizmy antyspamowe i moderacja.
* **Kluczowi Partnerzy:** Dostawcy infrastruktury (OVHcloud, Cloudflare, GitHub) oraz społeczności samopomocowe.
* **Struktura Kosztów:** Koszt hostingu VPS (~20 zł/mc), koszt domeny (po roku studenckim) oraz nakład pracy zespołu.

---

## 4. Przypadki Użycia (Use Cases)

### UC1: Dodawanie nowego celu
* **Aktor główny:** Zarejestrowany użytkownik
* **Cel:** Dodanie nowego celu do monitorowania w SecretGoals
* **Warunki początkowe:** Użytkownik posiada konto i jest zalogowany
* **Scenariusz podstawowy:**
  1. Użytkownik przechodzi do sekcji „Moje cele”.
  2. Wybiera opcję „Dodaj cel”.
  3. Wprowadza nazwę i opis celu.
  4. Określa termin realizacji oraz widoczność celu.
  5. Zatwierdza wprowadzone dane.
  6. System zapisuje cel w bazie i wyświetla go na liście.
* **Scenariusz alternatywny:** W przypadku braku wymaganych pól system wyświetla komunikat o konieczności ich uzupełnienia.
* **Warunki końcowe:** Cel zostaje utrwalony na koncie użytkownika.

### UC2: Aktualizowanie postępów w realizacji celu
* **Aktor główny:** Zarejestrowany użytkownik
* **Cel:** Aktualizacja i monitorowanie postępów wybranego celu
* **Warunki początkowe:** Użytkownik jest zalogowany i posiada co najmniej jeden cel
* **Scenariusz podstawowy:**
  1. Użytkownik otwiera sekcję „Moje cele”.
  2. Wybiera cel do aktualizacji.
  3. Wprowadza dane o postępach.
  4. Opcjonalnie dodaje notatkę/komentarz.
  5. Zatwierdza zmiany.
  6. System rejestruje dane i odświeża widok postępu.
* **Scenariusz alternatywny:** Podanie nieprawidłowych danych skutkuje wyświetleniem komunikatu błędu.
* **Warunki końcowe:** Postęp zostaje zaktualizowany w bazie.

### UC3: Komentowanie postępów innych użytkowników
* **Aktor główny:** Zarejestrowany użytkownik
* **Cel:** Wzajemne motywowanie poprzez komentowanie wpisów innych osób
* **Warunki początkowe:** Użytkownik jest zalogowany i ma dostęp do publicznego wpisu w sekcji społeczności
* **Scenariusz podstawowy:**
  1. Użytkownik wchodzi w zakładkę „Społeczność”.
  2. Przegląda strumień postów.
  3. Wybiera interesujący post.
  4. Wprowadza treść komentarza.
  5. Zatwierdza wysłanie.
  6. System publikuje komentarz pod wybranym wpisem.
* **Scenariusz alternatywny:** Wysłanie pustego pola skutkuje powiadomieniem o braku treści.
* **Warunki końcowe:** Komentarz zostaje trwale powiązany z postem w feedzie.

### UC4: Wyszukiwanie osób o podobnych celach
* **Aktor główny:** Zarejestrowany użytkownik
* **Cel:** Znalezienie użytkowników o zbliżonych celach w celu wymiany doświadczeń
* **Warunki początkowe:** Użytkownik jest zalogowany i ma dostęp do modułu wyszukiwania
* **Scenariusz podstawowy:**
  1. Użytkownik przechodzi do widoku „Odkrywaj”.
  2. Wybiera kategorię lub podaje słowo kluczowe.
  3. System filtruje rekordy pod kątem kryteriów zapytania.
  4. Prezentowana jest lista pasujących anonimowych profili.
  5. Użytkownik klika w profil.
  6. System renderuje udostępnione informacje.
* **Scenariusz alternatywny:** W przypadku braku dopasowań system wyświetla monit o braku wyników.
* **Warunki końcowe:** Użytkownik uzyskuje dostęp do publicznych danych osób o wspólnych zainteresowaniach.

---

## 5. Prototypowanie i Koncepcja Wizualna

### 5.1. Wybór metody: Prototyp Ewolucyjny
W projekcie wybrano **prototyp ewolucyjny**, odrzucając prototyp jednorazowy (z porzuceniem). Ze względu na cykliczny tryb zaliczania kolejnych etapów co zajęcia, wytworzony kod stanowi produkcyjny szkielet, rozwijany i refaktoryzowany przyrostowo, co eliminuje stratę czasu na wyrzucanie wstępnych makiet.

### 5.2. Warianty Interfejsu
* **Wariant A (Dashboard-First):** Widok zorientowany na użytkownika – centralny punkt stanowią własne cele, wykresy kołowe, liczniki dni ciągłości (*streak*) oraz checklista nawyków, natomiast społeczność jest modułem w dolnym menu.
* **Wariant B (Community-First):** Widok zorientowany na społeczność – ekran główny to strumień wpisów innych użytkowników z filtrami kategorii, a wprowadzanie własnych danych wywoływane jest z wysuwanego panelu lub pływającego przycisku akcji (FAB).

---

## 6. Wykorzystanie Narzędzi AI

| Narzędzie AI | Obszar zastosowania | % wkładu AI |
| :--- | :--- | :---: |
| **Google Gemini** | Automatyzacja procesów opisowych, opracowanie struktury wymagań, wygenerowanie promptów pod prototypy wizualne. | 60% |