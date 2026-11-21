# User Journey Map — Persona 01 i Persona 02

## Secret Goals

Dokument przedstawia dwie hipotetyczne persony oparte na różnych potrzebach użytkowników aplikacji Secret Goals. Każda persona ma własną mapę podróży użytkownika, obejmującą działania, punkty styku z aplikacją, przewidywane emocje, punkty bólu i możliwości usprawnień.

**Ważne:** persony mają charakter roboczy (proto-persony). Zostały opracowane na podstawie założeń projektu, User Stories US01–US05, przypadków użycia, funkcjonalności aplikacji oraz dostępnych makiet High-Fi i User Flows. Nie są wynikiem badań z użytkownikami. Nie przypisujemy im niepotwierdzonych danych demograficznych. Różnią się przede wszystkim główną potrzebą i priorytetem korzystania z aplikacji — jedna rzeczywista osoba może odpowiadać obu profilom.

------------------------------------------------------------------------

# Persona 01 — Osoba realizująca własny cel

## 1. Charakterystyka persony

**Opis**

Użytkownik, który chce osiągnąć osobisty cel lub wyrobić nowy nawyk. Potrzebuje miejsca, w którym może określić swój cel, zapisywać postępy i obserwować efekty swoich działań. Może mieć trudności z utrzymaniem regularności, dlatego przydatne są dla niego rozwiązania wspierające motywację. Istotna jest również możliwość korzystania z aplikacji bez ujawniania swojej tożsamości innym użytkownikom.

| Obszar                       | Charakterystyka                                                                                                         |
|:-----------------------------|:------------------------------------------------------------------------------------------------------------------------|
| Główny cel                   | Osiągnięcie wybranego celu lub utrwalenie nawyku.                                                                       |
| Potrzeby                     | Utworzenie i monitorowanie celu, łatwe zapisywanie postępów, zachowanie anonimowości oraz możliwość uzyskania wsparcia. |
| Motywacje                    | Chęć wprowadzenia zmiany, obserwowania własnych postępów i utrzymania zaangażowania.                                    |
| Potencjalne trudności        | Nieregularność, spadek motywacji, trudność w dostrzeganiu postępów.                                                     |
| Obawy                        | Ujawnienie tożsamości oraz brak wsparcia lub osoby o podobnym celu.                                                     |
| Oczekiwana wartość aplikacji | Możliwość samodzielnej realizacji celu, śledzenia postępów i korzystania ze wsparcia w anonimowym środowisku.           |

## 2. Cel i etapy podróży

**Główny cel podróży:** rozpocząć realizację osobistego celu w Secret Goals, monitorować postępy i utrzymywać motywację, korzystając w razie potrzeby ze wsparcia społeczności — bez ujawniania swojej tożsamości.

``` mermaid
flowchart LR
    A["01 · Poznanie aplikacji"] --> B["02 · Rejestracja"]
    B --> C["03 · Tworzenie celu"]
    C --> D["04 · Pierwsze postępy"]
    D --> E["05 · Wsparcie"]
    E --> F["06 · Dalsza realizacja"]
    F --> D
```

Podróż przedstawia podstawową ścieżkę użytkownika: od poznania aplikacji, przez założenie konta i utworzenie celu, po regularne monitorowanie postępów. Wsparcie innych użytkowników jest dodatkową możliwością, z której persona może skorzystać, ale nie jest warunkiem realizacji głównego celu.

## 3. Mapa User Journey

### Etapy 1–3: rozpoczęcie korzystania z aplikacji

| Kategoria         | 1\. Poznanie aplikacji                                                                            | 2\. Rejestracja                                                                                      | 3\. Tworzenie celu                                                              |
|:------------------|:--------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------|
| **Actions**       | Zapoznaje się z przeznaczeniem aplikacji i sprawdza, czy może realizować cele w anonimowy sposób. | Wybiera rejestrację, podaje adres e-mail i hasło, a następnie zakłada konto. Otrzymuje losowy alias. | Przechodzi do sekcji „Cele”, otwiera formularz i podaje nazwę, kategorię, typ, termin oraz widoczność celu.          |
| **Touchpoints**   | `Flow 01` – formularz rejestracji i ekran powitania z wygenerowanym aliasem; `Flow 02` – ekran logowania. W przesłanych flow nie ma osobnego ekranu prezentującego aplikację przed rejestracją. | `Flow 01` – formularz rejestracji, walidacja pól, komunikaty błędów (400/409/500) oraz ekran „Cele: powitanie” z aliasem. | `Flow 03` – ekran „Cele” (lista lub pusty stan), formularz nowego celu, wybór widoczności i potwierdzenie utworzenia celu. |
| **Emotions**      | Ciekawość i zainteresowanie, ale także ostrożność związana z prywatnością.                        | Nadzieja i motywacja do rozpoczęcia, możliwa niepewność podczas podawania danych.                    | Motywacja i zaangażowanie; możliwa niepewność, jak sformułować cel.             |
| **Pain Points**   | Niepewność, czy zasady anonimowości są wystarczająco jasne.                                       | Możliwe problemy z poprawnym wypełnieniem formularza lub walidacją danych.                           | Trudność w określeniu celu albo niejasność dotycząca wymaganych pól formularza. |
| **Opportunities** | Wyraźne przedstawienie zasad anonimowości i korzyści wynikających z korzystania z aplikacji.      | Czytelne komunikaty walidacyjne i zrozumiały przebieg rejestracji.                                   | Jasne oznaczenie wymaganych pól i pomocne wskazówki przy tworzeniu celu.        |

### Etapy 4–6: realizacja celu i utrzymywanie motywacji

| Kategoria         | 4\. Pierwsze postępy                                                                                                                          | 5\. Wsparcie                                                                                                                        | 6\. Dalsza realizacja                                                                                                        |
|:------------------|:----------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------|
| **Actions**       | Wraca do utworzonego celu i zapisuje jego postęp, wybierając odpowiedni status, np. „Zaliczone na dziś” lub „Potknięcie”. Może dodać notatkę. | Sprawdza, czy aplikacja wskazuje osobę z podobnym celem. Jeśli taka osoba jest dostępna, otwiera jej profil i może wysłać wsparcie. | Ponownie odwiedza swoje cele, aktualizuje postępy i — zależnie od potrzeb — korzysta ze społeczności, wpisów lub poradników. |
| **Touchpoints**   | `Flow 04` – ekran „Cele: wybrany cel”, akcje postępu dla serii dziennej / celu kwotowego / licznika tygodniowego, arkusz „Inna kwota”, opcjonalna notatka i meldunek, toast „Zapisano”. | `Flow 06` – sekcja „Nie jesteś sam”, karta rówieśnika, profil rówieśnika, przycisk „Wspieram” i toast potwierdzający; pusty stan z linkiem do Społeczności. `Flow 05` – feed jako alternatywne miejsce wsparcia. | `Flow 04` – ponowna aktualizacja postępów i kamienie milowe; `Flow 05` – feed, filtry, komentarze i wpisy; `Flow 07` – profil oraz dialog „Strategie i poradniki”. Przy powrocie do aplikacji: `Flow 02` – sprawdzanie sesji i ponowne logowanie po jej wygaśnięciu. |
| **Emotions**      | Satysfakcja z wykonania działania i poczucie sprawczości; przy niepowodzeniu możliwe rozczarowanie.                                           | Nadzieja na uzyskanie wsparcia i poczucie przynależności; możliwe rozczarowanie, jeśli nie ma dostępnej osoby o podobnym celu.      | Zaangażowanie i satysfakcja z obserwowania postępów; możliwe okresowe zniechęcenie.                                          |
| **Pain Points**   | Trudność z regularnym zapisywaniem postępów lub niepewność, czy zmiana została zapisana.                                                      | Brak dostępnego rówieśnika spełniającego warunki dopasowania albo niepowodzenie podczas wysyłania wsparcia.                                                | Spadek motywacji, trudność w utrzymaniu regularności i ryzyko zaprzestania aktualizowania celu.                              |
| **Opportunities** | Czytelne potwierdzenie zapisu oraz przejrzysta prezentacja historii i postępów.                                                               | Ułatwienie odnajdywania osób o podobnych celach; gdy nie ma dopasowania, wskazanie alternatywy w postaci społeczności.              | Zachęcanie do powrotu do celu, pokazywanie osiągniętych postępów i ułatwienie odnajdywania pomocnych wpisów oraz poradników. |

## 4. Przewidywana zmiana emocji

Poniższy przebieg emocji jest hipotezą projektową, a nie wynikiem badań ani pomiaru emocji rzeczywistych użytkowników.

``` mermaid
flowchart LR
    A["🤔 Ciekawość"] --> B["😐 Ostrożność / niepewność"]
    B --> C["🙂 Motywacja"]
    C --> D["😄 Satysfakcja z pierwszego postępu"]
    D --> E["😊 Poczucie wsparcia"]
    E --> F["💪 Zaangażowanie"]
    F -. "możliwy spadek motywacji" .-> G["😕 Zniechęcenie"]
    G -. "powrót do celu i aktualizacja postępów" .-> F
```

------------------------------------------------------------------------

# Persona 02 — Osoba nastawiona na wzajemne wsparcie

## 1. Charakterystyka persony

**Opis**

Użytkownik, dla którego ważnym elementem korzystania z Secret Goals jest kontakt z innymi osobami realizującymi podobne cele. Chce dzielić się doświadczeniami, komentować postępy innych i okazywać im wsparcie. Istotne jest dla niego poczucie, że nie jest sam w podejmowaniu wysiłku i że może korzystać z doświadczeń społeczności. Jednocześnie oczekuje możliwości uczestniczenia w niej bez ujawniania swojej tożsamości.

| Obszar                       | Charakterystyka                                                                                                                   |
|:-----------------------------|:----------------------------------------------------------------------------------------------------------------------------------|
| Główny cel                   | Korzystanie ze społeczności i wzajemne wspieranie się z innymi użytkownikami.                                                     |
| Potrzeby                     | Przeglądanie wpisów, komentowanie postępów, odnajdywanie osób o podobnych celach i udzielanie wsparcia.                           |
| Motywacje                    | Poczucie wspólnoty, dzielenie się doświadczeniami i pomaganie innym.                                                              |
| Potencjalne trudności        | Mała liczba interesujących wpisów, brak osoby o podobnym celu, trudność w rozpoczęciu interakcji.                                 |
| Obawy                        | Brak odpowiedzi lub reakcji innych użytkowników oraz ujawnienie tożsamości.                                                       |
| Oczekiwana wartość aplikacji | Możliwość nawiązywania kontaktu z innymi użytkownikami, wymiany doświadczeń i wzajemnego motywowania się w anonimowym środowisku. |

## 2. Cel i etapy podróży

**Główny cel podróży:** dołączyć do społeczności Secret Goals, znaleźć wpisy i osoby, z którymi można dzielić doświadczenia, oraz udzielać i otrzymywać wsparcie.

``` mermaid
flowchart LR
    A["01 · Poznanie aplikacji"] --> B["02 · Rejestracja"]
    B --> C["03 · Utworzenie własnego celu"]
    C --> D["04 · Odkrywanie społeczności"]
    D --> E["05 · Interakcje z innymi"]
    E --> F["06 · Wzajemne wsparcie"]
    F --> D
```

Utworzenie własnego celu jest uwzględnione, ponieważ posiadanie zapisanego celu jest warunkiem wyświetlenia dopasowanego rówieśnika w scenariuszu US05. Głównym priorytetem tej persony pozostaje jednak uczestnictwo w społeczności i interakcja z innymi.

## 3. Mapa User Journey

### Etapy 1–3: rozpoczęcie korzystania z aplikacji

| Kategoria         | 1\. Poznanie aplikacji                                                                         | 2\. Rejestracja                                                                     | 3\. Utworzenie własnego celu                                                                   |
|:------------------|:-----------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------|
| **Actions**       | Poznaje aplikację i sprawdza, czy może w niej przeglądać wpisy oraz wspierać innych anonimowo. | Zakłada konto, podając adres e-mail i hasło; otrzymuje losowy alias.                | Dodaje własny cel, wybierając nazwę, kategorię, typ, termin i widoczność publiczną, aby umożliwić dopasowanie osoby realizującej podobny cel.         |
| **Touchpoints**   | `Flow 01` – formularz rejestracji i ekran powitania z aliasem; `Flow 02` – ekran logowania. Nie ma osobnego ekranu wprowadzającego do aplikacji w przesłanych flow. | `Flow 01` – formularz rejestracji, walidacja pól, komunikaty błędów oraz ekran „Cele: powitanie” z aliasem. | `Flow 03` – ekran „Cele”, formularz nowego celu (nazwa, kategoria, typ, termin i widoczność), walidacja oraz potwierdzenie zapisu. |
| **Emotions**      | Ciekawość i zainteresowanie możliwością kontaktu z innymi.                                     | Nadzieja na dołączenie do społeczności; możliwa ostrożność związana z prywatnością. | Motywacja i oczekiwanie na możliwość znalezienia osób o podobnych doświadczeniach.             |
| **Pain Points**   | Niepewność, jak działa społeczność i jakie informacje są widoczne dla innych.                  | Możliwe problemy z wypełnieniem formularza lub walidacją danych.                    | Niepewność, jaki cel i kategorię wybrać oraz czy cel będzie publiczny i pozwoli na dopasowanie rówieśnika. |
| **Opportunities** | Jasne wyjaśnienie zasad anonimowości oraz sposobu działania społeczności.                      | Czytelny proces rejestracji i komunikaty walidacyjne.                               | Wyjaśnienie, że dopasowanie wymaga publicznego celu z odpowiednią kategorią, oraz ułatwienie wyboru kategorii i widoczności podczas dodawania celu. |

### Etapy 4–6: uczestnictwo w społeczności i wzajemne wsparcie

| Kategoria         | 4\. Odkrywanie społeczności                                                                                                                     | 5\. Interakcje z innymi                                                                                                  | 6\. Wzajemne wsparcie                                                                                                            |
|:------------------|:------------------------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------|
| **Actions**       | Przechodzi do zakładki „Społeczność”, przegląda feed i zmienia filtry, np. „Dla Ciebie”, „Podobne cele” lub „Poradniki”. | Wybiera interesujący wpis, może go wesprzeć przyciskiem „Wspieram”, otwiera panel komentarzy i dodaje komentarz. W razie potrzeby może też utworzyć własny wpis – meldunek lub poradnik.                                    | Sprawdza sekcję „Nie jesteś sam”. Jeśli system znajdzie rówieśnika z publicznym celem w tej samej kategorii, którego właściciel był aktywny w ciągu ostatnich 7 dni, otwiera jego kartę lub profil i wybiera „Wspieram”. W razie braku dopasowania przechodzi do Społeczności. |
| **Touchpoints**   | `Flow 05` – zakładka „Społeczność”, stan ładowania feedu, feed (rolki), filtry („Dla Ciebie”, „Podobne cele” itd.), pusty stan i błąd wczytywania. | `Flow 05` – wpis w feedzie, przycisk „Wspieram”, panel komentarzy, pole komentarza, formularz wpisu, walidacja pustej treści i potwierdzenie publikacji. | `Flow 06` – sekcja „Nie jesteś sam”, karta rówieśnika, profil rówieśnika, przycisk „Wspieram”, toast „Wsparcie wysłane” oraz pusty stan braku rówieśnika z przejściem do Społeczności. `Flow 05` – wsparcie przy wpisach. |
| **Emotions**      | Zainteresowanie i ciekawość; możliwe poczucie przynależności.                                                                                   | Zaangażowanie i satysfakcja z możliwości podzielenia się doświadczeniem; możliwa niepewność przed publikacją komentarza. | Poczucie wspólnoty i satysfakcja z udzielenia pomocy; możliwe rozczarowanie przy braku dopasowania.                              |
| **Pain Points**   | Trudność w znalezieniu interesujących lub podobnych wpisów.                                                                                     | Niepewność, co napisać; próba wysłania pustego komentarza lub wpisu kończy się komunikatem o konieczności podania treści.                                | Brak dostępnego rówieśnika spełniającego warunki dopasowania albo niepowodzenie podczas wysyłania wsparcia.                                             |
| **Opportunities** | Ułatwienie odkrywania treści dzięki filtrom i czytelnemu podziałowi wpisów.                                                                     | Zachęcanie do komentowania i publikowania wpisów oraz czytelne informowanie o błędach formularzy.                                                 | Czytelne przedstawienie zasad dopasowania i zapewnienie alternatywnej ścieżki do Społeczności, gdy rówieśnik nie jest dostępny.      |

## 4. Przewidywana zmiana emocji

Poniższy przebieg emocji jest hipotezą projektową, a nie wynikiem badań ani pomiaru emocji rzeczywistych użytkowników.

``` mermaid
flowchart LR
    A["🤔 Ciekawość"] --> B["😐 Ostrożność"]
    B --> C["🙂 Oczekiwanie na kontakt"]
    C --> D["😊 Zainteresowanie społecznością"]
    D --> E["💬 Zaangażowanie"]
    E --> F["🤝 Poczucie wspólnoty"]
    F -. "brak dopasowania lub reakcji" .-> G["😕 Rozczarowanie"]
    G -. "odkrywanie innych wpisów" .-> D
```

------------------------------------------------------------------------

## 5. Uwagi dotyczące makiet i przebiegu

- **Anonimowość:** makieta rejestracji informuje, że inni użytkownicy widzą losowy alias, a adres e-mail służy do logowania.
- **Warunek dopasowania rówieśnika:** zgodnie z Flow 06 system szuka publicznego celu w tej samej kategorii, którego właściciel był aktywny w ciągu ostatnich 7 dni. Samo utworzenie celu nie gwarantuje dopasowania. W razie braku odpowiedniej osoby aplikacja pokazuje pusty stan „Szukamy kogoś z podobnym celem” i odsyła do Społeczności.
- **Brak rówieśnika:** ekran pustego stanu informuje o poszukiwaniu osoby z podobnym celem i proponuje przejście do społeczności. Brak dopasowania nie jest błędem aplikacji.
- **Komentowanie:** US04 opisuje możliwość komentowania dostępnych wpisów w sekcji społeczności. Próba publikacji pustego komentarza kończy się komunikatem o konieczności wpisania treści.
- **Wsparcie:** US05 opisuje akcję „Wspieram” i potwierdzenie jej wykonania.
- **Stany błędów i ładowania:** należy traktować je jako możliwe warianty przebiegu na odpowiednich etapach, a nie jako osobne główne etapy podróży.
- **Touchpoints i makiety High-Fi:** w tabelach wskazano konkretne ekrany i stany z przesłanych przepływów Flow 01–07. `Flow 00 – Mapa nawigacji` pokazuje powiązania między ekranami, ale nie jest osobnym ekranem używanym przez personę. `Flow 02 – Logowanie i sesja` dotyczy wejścia do aplikacji, powrotu po wygaśnięciu sesji i wylogowania.
- **Charakter pain points i emocji:** ponieważ nie przeprowadzono badań z użytkownikami, są to przewidywane trudności i reakcje, a nie potwierdzone wyniki badań.


### Dodatkowe powiązania z makietami

- **Powrót do aplikacji:** po ponownym wejściu Secret Goals sprawdza sesję. Jeśli sesja jest ważna, użytkownik przechodzi do ekranu „Cele”; jeśli wygasła, widzi ekran logowania z komunikatem „Sesja wygasła” (`Flow 02`). Ten scenariusz może wystąpić w dalszej realizacji celu obu person.
- **Profil i ustawienia:** ekran profilu, alias, statystyki, widoczność celów, ustawienia oraz wylogowanie są opisane w `Flow 07`. Nie stanowią osobnego głównego etapu podróży, ale są dodatkowymi punktami styku.
- **Publikowanie meldunku:** w `Flow 04` użytkownik może opcjonalnie zaznaczyć „Opublikuj jako meldunek”. Wpis w Społeczności powstaje, gdy cel jest publiczny.
- **Automatyczne wpisy:** `Flow 03` przewiduje automatyczny wpis „Nowy cel” dla celu publicznego, a `Flow 04` – automatyczny post po osiągnięciu kamienia milowego.
- **Zakres makiet:** przypisania odnoszą się do ekranów i stanów nazwanych w przesłanych plikach Flow 01–07. `Flow 00` pełni funkcję mapy nawigacji i ułatwia orientację w całym systemie.

## 6. Wnioski

Obie persony reprezentują różne priorytety korzystania z Secret Goals. Pierwsza koncentruje się przede wszystkim na planowaniu własnego celu i monitorowaniu postępów. Druga kładzie większy nacisk na uczestnictwo w społeczności, wymianę doświadczeń i wzajemne wsparcie.

Nie są to rozłączne typy użytkowników — jedna osoba może realizować własny cel i jednocześnie aktywnie korzystać ze społeczności. Podział pozwala jednak przedstawić dwie różne ścieżki korzystania z aplikacji i przeanalizować potrzeby związane z obiema grupami funkcjonalności.
