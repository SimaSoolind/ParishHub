---
name: parishhub-regler
description: Regler och mönster för ParishHub-monorepot. Använd alltid när Claude kodar i client/ eller server/.
---

# Regler för ParishHub

## 🗂 Mappstruktur

### client/ (Frontend)
- src/components/  → återanvändbara UI-komponenter
- src/pages/       → sidor (en per route)
- src/hooks/       → egna React hooks
- src/services/    → API-anrop till backenden
- src/types/       → TypeScript-typer (delas med server via kopia)
- src/utils/       → hjälpfunktioner
- src/i18n/        → svenska + arabiska översättningar

### server/ (Backend)
- src/routes/      → definierar API-endpoints
- src/controllers/ → logik för varje endpoint
- src/services/    → externa tjänster (Deepgram, DeepL, Prisma)
- src/middleware/  → felhantering, auth, cors
- src/types/       → TypeScript-typer
- src/db/          → databas-kod (Prisma)
- prisma/          → schema.prisma + migrations

## 📛 Namngivning
- Komponent: PascalCase.tsx (MemberList.tsx)
- Hook: camelCase.ts med "use"-prefix (useMembers.ts)
- Route: camelCase.route.ts (members.route.ts)
- Controller: camelCase.controller.ts (members.controller.ts)
- Typ/Interface: PascalCase i types/-mappen (Member, NewMember)

## 💬 Kommentarsspråk — regler
- Skriv i **lätt svenska** (studentspråk, inte akademiskt)
- Skriv **objektivt** — inga "du", "vi", "man", "jag"
- Skriv **kort och tydligt** — en mening räcker oftast
- Beskriv **VAD koden gör**, inte vem som gör den

## 🧩 Mall för en React-komponent

/**
 * MemberCard — visar information om en medlem i en kortvy
 * Används på Medlemmar-sidan och i familjekopplingar
 *
 * @param props.member - medlem att visa
 * @returns JSX-element
 */
export function MemberCard({ member }: Props) {
  // Visar namn, telefon och närvarostatus
  return <div>{member.firstName}</div>;
}

## 🧩 Mall för en Express-route

// Definierar alla endpoints för medlemmar
// Kopplar HTTP-metoder till controller-funktioner

import { Router } from "express";
import { getAllMembers } from "../controllers/members.controller";

const router = Router();

router.get("/", getAllMembers);

export default router;

## 🎨 Design-tokens (från kyrkoapp-presentation.jsx)
- Använd CSS-variabler: --accent, --bg, --surface, --text
- Ljust läge + mörkt läge stöds
- Svenska: Inter för text, Cormorant Garamond för rubriker
- Arabiska: Cairo (RTL-riktning)
- Siffror/kod: JetBrains Mono