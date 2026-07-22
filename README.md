# ParishHub ✝

Digitalt system för kyrkoförvaltning — med AI-tolkning live på svenska och arabiska.

## 🎯 Syfte
En modern app som hjälper en präst att hantera hela sin församling digitalt.
Ersätter papperslistor och gamla anteckningsböcker med säker, snabb kommunikation.

## 🗂 Monorepo-struktur

```
ParishHub/
├── client/           # Frontend — React + Vite + TypeScript
├── server/           # Backend — Node.js + Express + TypeScript
├── docs/             # Dokumentation
├── .claude/          # Claude Code-inställningar
├── CLAUDE.md         # Projektregler
├── CHANGELOG.md      # Ändringslogg
└── README.md         # Denna fil
```

## 🛠 Teknisk stack

### Frontend (client/)
- React + Vite + TypeScript
- React Router
- Tailwind CSS
- react-i18next (svenska + arabiska)
- @tanstack/react-query

### Backend (server/)
- Node.js + Express + TypeScript
- PostgreSQL via Prisma ORM
- JWT + bcrypt
- Deepgram (speech-to-text live)
- DeepL (arabisk → svensk översättning)

### Hosting
- Frontend: Vercel
- Backend + Databas: Railway

## 🚀 Kom igång

### Krav
- Node.js 20 eller högre
- npm
- PostgreSQL-konto (Railway)
- Deepgram-konto (gratis 200 USD)
- DeepL-konto (gratis 500 000 tecken/månad)

### Steg 1 — Klona projektet
```bash
git clone https://github.com/SimaSoolind/ParishHub.git
cd ParishHub
```

### Steg 2 — Installera backend
```bash
cd server
npm install
```

### Steg 3 — Skapa .env-fil i server/
Kopiera `.env.example` till `.env` och fyll i värden.

### Steg 4 — Starta backend
```bash
npm run dev
```
Backenden körs på http://localhost:3000

### Steg 5 — Installera och starta frontend
```bash
cd ../client
npm install
npm run dev
```
Frontenden körs på http://localhost:5173

## 📖 Vidare läsning

- [CLAUDE.md](./CLAUDE.md) — Projektregler och kodstandard
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — Systemarkitektur
- [docs/API.md](./docs/API.md) — API-dokumentation
- [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) — Vanliga fel och lösningar
- [CHANGELOG.md](./CHANGELOG.md) — Ändringslogg

## 👤 Byggd av
Sima Soolind — Fullstack-utvecklare med säkerhetsinriktning
Examensprojekt 2026