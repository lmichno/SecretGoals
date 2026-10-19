# Historyjki użytkownika i kryteria akceptacji – SecretGoals

## US01 – Rejestracja i anonimowy alias

### Opis
Jako nowy użytkownik chcę założyć konto za pomocą adresu e-mail i hasła oraz otrzymać automatycznie wygenerowany alias, aby korzystać z SecretGoals anonimowo wobec innych użytkowników.

### Kryteria akceptacji

#### Scenariusz 1 – Pomyślna rejestracja
* **Mając na uwadze (Given):** Użytkownik znajduje się w formularzu rejestracji.
* **Gdy (When):** Podaje poprawny adres e-mail i hasło oraz zatwierdza formularz.
* **Wtedy (Then):** System tworzy konto użytkownika, generuje alias i przypisuje go do jego konta.

#### Scenariusz 2 – Ochrona prywatności
* **Mając na uwadze (Given):** Użytkownik posiada konto oraz wygenerowany alias.
* **Gdy (When):** Inny użytkownik przegląda jego profil w aplikacji.
* **Wtedy (Then):** System wyświetla wygenerowany alias na profilu użytkownika i nie udostępnia innym użytkownikom adresu e-mail.

---

## US02 – Dodawanie nowego celu

### Opis
Jako użytkownik SecretGoals chcę utworzyć cel, podając jego nazwę, opis, termin realizacji oraz widoczność, aby móc zaplanować jego realizację.

### Kryteria akceptacji

#### Scenariusz 1 – Prawidłowe dodanie celu
* **Mając na uwadze (Given):** Użytkownik jest zalogowany i znajduje się w sekcji „Moje cele”.
* **Gdy (When):** Podaje nazwę oraz opis celu, określa jego termin oraz widoczność i zatwierdza formularz.
* **Wtedy (Then):** System zapisuje cel i wyświetla go na liście celów użytkownika.

#### Scenariusz 2 – Brak wymaganej nazwy
* **Mając na uwadze (Given):** Użytkownik znajduje się w formularzu dodawania nowego celu.
* **Gdy (When):** Próbuje zapisać cel bez podania jego nazwy.
* **Wtedy (Then):** System informuje użytkownika o konieczności podania nazwy i nie zapisuje celu.

---

## US03 – Aktualizowanie postępów w realizacji celów

### Opis
Jako użytkownik realizujący cel chcę aktualizować swoje postępy, aby monitorować osiągnięcia i utrzymać motywację.

### Kryteria akceptacji

#### Scenariusz 1 – Pomyślna aktualizacja postępów
* **Mając na uwadze (Given):** Użytkownik jest zalogowany i posiada co najmniej jeden zapisany cel.
* **Gdy (When):** Wybiera cel, wprowadza informacje o swoich postępach oraz zatwierdza zmiany.
* **Wtedy (Then):** System zapisuje wprowadzone informacje i aktualizuje widok postępu wybranego celu.

#### Scenariusz 2 – Dodanie komentarza do postępu
* **Mając na uwadze (Given):** Użytkownik aktualizuje postępy w realizacji swojego celu.
* **Gdy (When):** Dodaje komentarz opisujący swoje postępy i zapisuje zmiany.
* **Wtedy (Then):** System zapisuje komentarz wraz z aktualizacją postępu i wyświetla go w widoku celu użytkownika.

---

## US04 – Komentowanie postępów innych użytkowników

### Opis
Jako użytkownik SecretGoals chcę komentować dostępne dla mnie wpisy innych osób, aby dzielić się doświadczeniami oraz wspierać społeczność.

### Kryteria akceptacji

#### Scenariusz 1 – Dodanie komentarza
* **Mając na uwadze (Given):** Użytkownik jest zalogowany i przegląda dostępne dla niego wpisy znajdujące się w sekcji „Społeczność”.
* **Gdy (When):** Wpisuje treść komentarza i zatwierdza publikację.
* **Wtedy (Then):** System zapisuje komentarz i wyświetla go pod wpisem osobom uprawnionym do jego wyświetlenia.

#### Scenariusz 2 – Próba publikacji pustego komentarza
* **Mając na uwadze (Given):** Użytkownik otworzył formularz dodawania komentarza.
* **Gdy (When):** Próbuje opublikować komentarz bez wpisania treści.
* **Wtedy (Then):** System informuje go o konieczności wpisania treści komentarza i nie publikuje pustego komentarza.

---

## US05 – Automatyczne wyświetlanie rówieśnika o podobnym celu

### Opis
Jako użytkownik SecretGoals chcę automatycznie widzieć wpis osoby, która realizuje podobny cel, aby czuć, że nie jestem sam w realizacji swojego celu.

### Kryteria akceptacji

#### Scenariusz 1 – Wyświetlanie rówieśnika
* **Mając na uwadze (Given):** Użytkownik jest zalogowany i posiada zapisany cel w aplikacji, a system ma dostępny wpis użytkownika realizującego podobny cel.
* **Gdy (When):** Użytkownik otwiera główny ekran celów.
* **Wtedy (Then):** System automatycznie wyświetla wpis dopasowanego użytkownika wraz z jego aliasem i krótką informacją o postępach.

#### Scenariusz 2 – Udzielenie wsparcia
* **Mając na uwadze (Given):** Na ekranie użytkownika wyświetla się wpis rówieśnika z podobnym celem.
* **Gdy (When):** Użytkownik wybiera przycisk „Wspieram”.
* **Wtedy (Then):** System rejestruje udzielenie wsparcia i wyświetla potwierdzenie wykonania tej akcji.