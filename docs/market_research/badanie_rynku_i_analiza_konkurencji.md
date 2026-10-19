# Badanie Rynku i Analiza Rozwiązań Konkurencyjnych – SecretGoals

**Projekt:** SecretGoals – Anonimowy habit tracker z modułem peer accountability  
**Przedmiot:** Inżynieria Oprogramowania  

---

## 1. Problem Badawczy i Hipoteza Rynkowa

Większość aplikacji wspierających realizację celów i zmianę nawyków cierpi na **paradoks ekspozycji społecznej**. Budowanie trudnych, wrażliwych lub stygmatyzujących nawyków — takich jak wychodzenie z nałogów (alkohol, palenie), redukcja zadłużenia, poszukiwanie pracy po zwolnieniu czy walka z prokrastynacją — rodzi silny lęk przed oceną otoczenia.

Dotychczasowy rynek dzieli się na dwa bieguny:
1. **Biegun izolacji (Solitary Trackers):** Aplikacje działające wyłącznie lokalnie na urządzeniu. Gwarantują prywatność, ale pozostawiają użytkownika samego z własną silną wolą. W rezultacie wskaźnik porzucenia (*drop-off rate*) wynosi 70–80% już po pierwszych dwóch tygodniach.
2. **Biegun presji wizerunkowej (Public Social Accountability):** Platformy społecznościowe i aplikacje sportowe promujące kult sukcesu oraz wymagające jawnej tożsamości. Narzędzia te zawodzą przy celach intymnych, gdzie ryzyko publicznej porażki wywołuje paraliż psychologiczny.

**Luka rynkowa:** Brak lekkiego, wieloplatformowego narzędzia w przeglądarce, które łączy **analityczne śledzenie nawyków** ze **wsparciem rówieśniczym (peer accountability)** w reżimie **bezwzględnej pseudonimizacji (Zero-PII)**.

---

## 2. Zestawienie Konkurencji i Czynniki Sukcesu

### 2.1. Tabela porównawcza rozwiązań rynkowych

| Kategoria / Produkt | Narzędzia pomiaru | Poziom anonimowości | Wsparcie grupy | Słabe punkty i bariery wejścia |
| :--- | :--- | :--- | :--- | :--- |
| **Lokalne aplikacje offline**<br>*(Loop Habit Tracker, HabitNow)* | Wysokie (serie dni, wykresy, harmonogramy) | **Wysoki** (dane wyłącznie w pamięci telefonu) | **Zerowy** (brak modułów sieciowych) | Samotność w procesie, brak zewnętrznej motywacji, szybkie porzucenie po pierwszym potknięciu. |
| **Aplikacje społecznościowe i sportowe**<br>*(Strava, Habitica)* | Średnie do wysokich (punkty, zadania, grywalizacja) | **Krytycznie niski** (konta powiązane z pocztą, znajomymi, lokalizacją) | **Wysoki** (tablice, gildie, polubienia) | Presja wizerunkowa. Użytkownik nie wpisze tam: *„Drugi dzień bez alkoholu”* ani *„Wysłano jedno CV po załamaniu nerwowym”*. |
| **Fora internetowe**<br>*(Reddit: r/stopdrinking, r/leaves)* | **Brak** (ręczne opisywanie sytuacji w postach) | **Wysoki** (losowe pseudonimy, brak wymogu podawania danych) | **Bardzo wysoki** (bezpośrednie wsparcie grupy) | Brak narzędzi pomiarowych, chaos informacyjny, brak powiadomień, wykresów i powtarzalnych list zadań. |
| **Aplikacje dla osób wychodzących z uzależnień**<br>*(I Am Sober)* | Wysokie (licznik trzeźwości, dziennik) | **Średni** (wymusza konto e-mail i profil w społeczności) | **Średni** (fora podzielone według nałogu) | Agresywny model płatności, ograniczenie wyłącznie do ciężkich nałogów, brak elastyczności na codzienne nawyki i karierę. |
| **SecretGoals** | **Wysokie** (szablony, liczniki ilościowe i binarne, serie dni) | **Całkowity** (automatyczny pseudonim, zero danych osobowych) | **Wysoki** (tematyczny strumień wpisów, szybkie reakcje motywacyjne) | Wymaga moderacji treści i zbudowania społeczności od zera. |

---

### 2.2. Co użytkownicy lubią najbardziej, a co najmniej w konkurencyjnych rozwiązaniach?

Zestawienie preferencji użytkowników bazujące na analizie recenzji w sklepach Google Play / App Store oraz dyskusji na forach tematycznych:

#### Co użytkownicy cenią najbardziej (czynniki pozytywne):
* **Jednoklikowe logowanie (1-tap logging):** Błyskawiczne odznaczenie nawyku z poziomu widgetu lub ekranu głównego (np. w *Loop Habit Tracker*) bez konieczności przechodzenia przez wieloetapowe formularze.
* **Wizualizacja ciągłości (Streak Visualisation):** Czytelny licznik dni z rzędu oraz kalendarze aktywności w formie siatki (ang. *heatmaps*), dające natychmiastowe poczucie dumy i sprawczości.
* **Empatia bez oceniania (Nieoceniająca społeczność):** Poczucie przynależności do grupy zmagającej się z tym samym problemem (np. społeczność *r/stopdrinking* na Reddicie), gdzie sukcesy i potknięcia spotykają się ze zrozumieniem, a nie hejtem.
* **Grywalizacja i natychmiastowa nagroda:** Elementy RPG (np. *Habitica*) czy mikro-reakcje (kudosy w *Strava*), które dostarczają dopaminy zaraz po wykonaniu trudnego zadania.

#### Co użytkownikom najbardziej przeszkadza (czynniki negatywne):
* **Agresywna monetyzacja i paywalle:** Blokowanie podstawowych statystyk, eksportu danych czy historii powyżej 7 dni za zaporowym abonamentem (30–60 zł/miesiąc w aplikacjach takich jak *Fabulous* czy *I Am Sober*).
* **Wymuszona integracja społecznościowa:** Automatyczne odpytywanie o dostęp do książki kontaktów, profilu Google/Facebooka i sugerowanie znajomych z pracy lub szkoły w kontekście wstydliwych wyzwań.
* **Poczucie winy po przerwaniu serii (*Streak Shame*):** Sztywne zerowanie licznika po jednym dniu pominięcia nawyku, co zamiast motywować, wywołuje frustrację i prowadzi do trwałego odinstalowania aplikacji.
* **Przeładowanie interfejsu (*Feature Creep*):** Nadmiar zakładek, skomplikowane drzewa konfiguracji celów, systemy punktowe odwracające uwagę od samego nawyku.
* **Natrętne i nieprzydatne powiadomienia:** Generyczne przypomnienia wysyłane w losowych momentach dnia, które użytkownicy szybko wyciszają lub traktują jako spam.

---

### 2.3. Czynniki sukcesu liderów rynkowych (Dlaczego ludzie wracają do tych aplikacji?)

Sukces najpopularniejszych aplikacji (np. *Strava*, *Habitica*, *Duolingo*) opiera się na **trzech filarach inżynierii behawioralnej**:
1. **Silna mechanika grywalizacji i pętli nawyku (Habit Loop):**
   Wykorzystanie modelu pętli dopaminowej (*Wyzwalacz $\rightarrow$ Działanie $\rightarrow$ Zmienna Nagroda $\rightarrow$ Inwestycja*). Systemy poziomów, odznak i serii dni tworzą u użytkownika mechanizm niechęci do straty (*Loss Aversion*) — im dłuższa seria, tym trudniej ją porzucić.
2. **Poczucie przynależności do aktywnej społeczności (Social Accountability):**
   Świadomość, że postęp jest obserwowany przez innych, drastycznie podnosi wskaźnik dotrzymywania postanowień. W aplikacji *Strava* użytkownicy wracają nie dla samych wykresów GPS, lecz dla interakcji społecznej (komentarze, kudosy, porównanie w segmentach).
3. **Maksymalnie uproszczone rejestrowanie postępów (Frictionless Logging):**
   Liderzy eliminują wszelkie bariery wejścia. Rejestracja postępu zajmuje poniżej 3 sekund, co pozwala na utrwalenie odruchu sięgania po aplikację bez uczucia zmęczenia decyzyjnego.

---

## 3. Trudności Użytkowników i ich Uzasadnienie Źródłowe

Analiza trudności napotykanych przez użytkowników poparta badaniami z dziedziny mHealth oraz głosami społeczności:

### 3.1. Samotność w procesie i syndrom szybkiego porzucenia
* **Problem:** Narzędzia offline wymagają nieskończonej samokontroli. W momencie kryzysu brak jakiegokolwiek zewnętrznego punktu odniesienia skutkuje cichym porzuceniem celu.
* **Uzasadnienie źródłowe:** Badania retencji w cyfrowych interwencjach zdrowotnych (*Journal of Medical Internet Research, mHealth Retention Studies*) wskazują, że **ponad 74% użytkowników rezygnuje z samodzielnych aplikacji monitorujących nawyki w ciągu pierwszych 14 dni**. Z kolei badania nad odpowiedzialnością społeczną (*The American Society of Training and Development – ASTD*) dowodzą, że **prawdopodobieństwo osiągnięcia celu wzrasta do 65%, gdy zadeklarujemy go przed drugą osobą, i aż do 95%, gdy nawiążemy regularną relację raportowania postępów (*accountability partnership*)**.
* **Głosy użytkowników (Reddit r/getdisciplined):**  
  > *„Gdy korzystam z notatnika albo aplikacji offline, po 4 dniach po prostu przestaję w nią klikać. Nikt o tym nie wie, nikt nie pyta, więc poddanie się nic nie kosztuje.”*

### 3.2. Presja wizerunkowa i lęk przed oceną (Toksyczny optymizm)
* **Problem:** W obecnych serwisach społecznościowych dominuje narracja sukcesu. Publikowanie potknięć, nawrotów nałogu czy trudnych zmagań wiąże się z ryzykiem utraty reputacji zawodowej lub rodzinnej.
* **Uzasadnienie źródłowe:** Zjawisko to w psychologii określa się mianem *Social Evaluation Anxiety*. W badaniach nad prywatnością w mHealth użytkownicy konsekwentnie odrzucają integrację celów behawioralnych z kontami Facebook/LinkedIn z obawy przed utratą prywatności i stygmatyzacją.
* **Głosy użytkowników (Reddit r/stopdrinking):**  
  > *„Chciałbym mieć miejsce, gdzie mogę wrzucić informację, że nie piję od 3 dni, ale nigdy w życiu nie zainstaluję aplikacji, która każe mi podać imię, nazwisko i łączy się z moimi kontaktami. Za bardzo boję się, że ktoś ze znajomych to zobaczy.”*

### 3.3. Chaos informacyjny forów dyskusyjnych
* **Problem:** Grupy na forach (Reddit, grupy wsparcia) oferują empatię, ale nie posiadają struktury bazodanowej. Post z prośbą o wsparcie znika w strumieniu po 24 godzinach.
* **Głosy użytkowników:**  
  > *„Grupy na Reddicie są super, gdy jest ciężko, ale nie pomagają w codziennej dyscyplinie. Nie widzę tam swoich wykresów, nie wiem, jak szło mi w zeszłym miesiącu i muszę za każdym razem pisać ten sam post od nowa.”*

---

## 4. Matryca Pozycjonowania Rynkowego

Zestawienie relacji: **Poziom anonimowości (Zero-PII)** vs **Wsparcie Społecznościowe (Peer Accountability)**.

| Poziom anonimowości \ Wsparcie grupy | Brak wsparcia grupy (Izolacja) | Silne wsparcie grupy (Accountability) |
| :--- | :--- | :--- |
| **Wysoka anonimowość (Zero-PII)** | Lokalne aplikacje offline *(Loop Habit Tracker, HabitNow)* | **SecretGoals**, Fora dyskusyjne *(Reddit)* |
| **Niska anonimowość (Jawna tożsamość)** | Notatniki, arkusze kalkulacyjne *(Excel, Notion)* | Platformy społecznościowe i sportowe *(Strava, Habitica)* |

```
                    Wysoka Anonimowość (Zero-PII)
                               ▲
                               │
               Reddit          │       SECRETGOALS
          (r/stopdrinking)     │   (Luka rynkowa: tracking
          [Brak narzędzi       │    metryk + społeczność
           pomiarowych]        │    bez lęku przed oceną)
                               │
    Brak wsparcia ─────────────┼───────────── Silne wsparcie
    społeczności               │              społecznościowe
                               │
            Loop Habit /       │          Strava / Habitica
            HabitNow           │       [Wymuszona tożsamość,
          [100% samotności     │        brak miejsca na
           w procesie]         │        trudne nałogi]
                               │
                               ▼
                     Jawna Tożsamość / PII
```

---

## 5. Analiza Barier, Czynników Churnu i Odpowiedź Projektowa

### 5.1. Bariera: „Nie chcę, by znajomi wiedzieli o moich problemach”
* **Stan rynkowy:** Integracje z kontami społecznościowymi i książkami adresowymi automatycznie łączą profile ze znajomymi. Użytkownik obawia się, że jego wrażliwe cele zostaną powiązane z prawdziwym imieniem i nazwiskiem.
* **Rozwiązanie w SecretGoals:** Standardowe, bezpieczne uwierzytelnienie z całkowitym odcięciem tożsamości w warstwie publicznej. W bazie danych i w interfejsie użytkownik występuje wyłącznie pod automatycznie nadanym, pseudonimizowanym aliasem (np. *Anon_Falcon92*). Niemożliwe jest wyszukanie profilu po adresie e-mail czy numerze telefonu.

### 5.2. Bariera: „Fora internetowe nie pomagają w systematyczności”
* **Stan rynkowy:** Fora dają doraźne wsparcie psychiczne, ale nie mierzą nawyków. Po dobie wątek znika, a użytkownik traci motywację.
* **Rozwiązanie w SecretGoals:** Silnik bazy danych (SQLite + Prisma) rejestruje atomowe wpisy postępów, automatycznie przelicza serie dni (*streaks*) i generuje zwięzłe kafelki aktywności w strumieniu tematycznym danej kategorii.

### 5.3. Bariera: „Skomplikowane i drogie aplikacje komercyjne”
* **Stan rynkowy:** Popularne aplikacje wymuszają abonament rzędu kilkudziesięciu złotych miesięcznie już po paru dniach, blokując dostęp do podstawowych statystyk i wprowadzając sztuczne ograniczenia.
* **Rozwiązanie w SecretGoals:** Model otwartości funkcjonalnej – kluczowe moduły (tworzenie celów, logowanie postępów, wskaźnik serii, dostęp do feedu) pozostają w pełni darmowe, a aplikacja nie blokuje użytkownika paywallami w trakcie wyrabiania nawyku.

### 5.4. Bariera: Skomplikowany start, zmęczenie interfejsem i ryzyko szybkiej rezygnacji (Czynniki Churnu)
* **Stan rynkowy (Dlaczego użytkownicy rezygnują z nowego oprogramowania?):**
  1. *Zbyt długi onboarding i barierowe formularze:* Wymóg przejścia przez 10 pytań ankietowych, podania karty płatniczej czy konfiguracji skomplikowanych harmonogramów zniechęca przed wykonaniem pierwszej akcji.
  2. *Zmęczenie powiadomieniami (Notification Fatigue):* Agresywne powiadomienia push traktowane jako natrętny spam zmuszają do wyłączenia notyfikacji lub odinstalowania aplikacji.
  3. *Brak natychmiastowego poczucia postępu:* Skomplikowany interfejs sprawia, że po zalogowaniu postępu użytkownik nie widzi natychmiastowej gratyfikacji wizualnej.
  4. *Konieczność instalacji ze sklepu:* Bariera pamięci w telefonie i niechęć do instalowania kolejnej ciężkiej aplikacji ze sklepów Google Play czy App Store.
* **Rozwiązanie w SecretGoals:**
  * **Błyskawiczny start (Zero-friction onboarding):** Uruchomienie aplikacji w przeglądarce pod adresem URL, natychmiastowe wygenerowanie aliasu i możliwość zalogowania pierwszego nawyku w mniej niż 30 sekund.
  * **Standard Mobile-First / PWA:** Brak konieczności instalowania ze sklepu; aplikacja działa natychmiast na telefonach z systemami Android oraz iOS w oknie przeglądarki lub w trybie standalone.
  * **Pełna kontrola nad dyskretnymi powiadomieniami:** Zero spamu marketingowego; powiadomienia wyłącznie na żądanie użytkownika w wybranych godzinach.
  * **Minimalistyczny interfejs i natychmiastowy feedback:** Centrowany, przejrzysty układ kciukowy (Google Pixel 7 frame), duże kafelki z animowanymi paskami postępu i automatycznym podbiciem licznika serii bezpośrednio po zatwierdzeniu wpisu.

---

## 6. Wnioski Końcowe

* **Wyróżnik rynkowy (USP):** SecretGoals nie ściga się z rozbudowanymi kombajnami do zarządzania zadaniami (np. Todoist, Asana). Tworzy **niszę bezpiecznego, dyskretnego habit trackingu**, w której kluczową wartością jest ochrona prywatności połączona ze wsparciem innych osób o tożsamych trudnościach życiowych.
* **Uzasadnienie inżynierskie:** Oparcie systemu o architekturę SPA w React i lekkie API w Express pozwala błyskawicznie zweryfikować kluczową hipotezę rynkową: *użytkownicy wykazują wyższą retencję i większą szczerość w dokumentowaniu trudnych nawyków, gdy ich tożsamość jest w 100% odcięta od wizerunku publicznego, a ich wysiłek jest widoczny i wspierany przez dedykowaną społeczność.*