# SecretGoals

Anonimowa platforma webowa łącząca mechanizmy śledzenia celów i nawyków ze wsparciem społecznościowym.

## Stos technologiczny

- **Frontend (`/client`):** React 19, Vite, Tailwind CSS v4, Lucide Icons
- **Backend (`/server`):** Node.js, Express.js
- **Baza danych:** SQLite + Prisma ORM
- **Zarządzanie procesami:** Concurrently (uruchamianie jednym poleceniem)

---

## Szybki start

### 1. Instalacja zależności

W głównym folderze projektu:

```bash
npm run install:all
```

LUB manualnie:
```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 2. Uruchomienie aplikacji deweloperskiej

W głównym folderze:

```bash
npm run dev
```

Polecenie to równolegle uruchamia:
- **Serwer Express:** `http://localhost:5000`
- **Klient Vite (React):** `http://localhost:5173` (z wbudowanym proxy `/api` skierowanym na port 5000)

---

## Przydatne polecenia

| Polecenie | Opis |
| :--- | :--- |
| `npm run dev` | Uruchamia jednocześnie backend i frontend |
| `npm run dev:server` | Uruchamia tylko backend Express |
| `npm run dev:client` | Uruchamia tylko frontend React (Vite) |
| `npm run build` | Buduje produkcyjną wersję frontendu |
| `npm run prisma:studio` | Otwiera graficzny interfejs Prisma Studio dla bazy SQLite |
| `npm run prisma:push` | Synchronizuje schemat Prisma z bazą SQLite (`dev.db`) |
