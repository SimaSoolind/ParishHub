# 💼 CV-punkter — ParishHub

**Byggd av:** Sima Soolind
**Projekt:** ParishHub — digitalt kyrkoförvaltningssystem
**GitHub:** https://github.com/SimaSoolind/ParishHub

Detta är en levande lista över färdigheter och prestationer från projektet.
Kopieras direkt in i CV, LinkedIn eller LIA-portfölj.

**Uppdatera denna fil VARJE gång du gör något värdefullt!**

---

## 🎨 Frontend-utveckling

- Byggde en fullstack-app-frontend med React 19 + Vite + TypeScript i monorepo-struktur
- Implementerade svensk lokalisering med date-fns för svenska datum-format
- Byggde återanvändbara UI-komponenter (StatCard, Badge, MemberCard, EventCard) enligt DRY-principen
- Integrerade Tailwind CSS v4 för konsekvent design och snabb prototypning
- Implementerade tillgänglighet (a11y) med aria-labels och semantisk HTML
- Byggde responsiv UI med mörkt och ljust läge (data-theme-toggle, semantiska Tailwind-klasser, minns valet i localStorage)
- Konfigurerade React Router v7 med nested routes och Layout-komponent

## 🔒 Säkerhet & Validering

- Implementerade schema-baserad input-validering med Zod i separat modul (återanvändbar för backend)
- XSS-skydd via input-sanering (trim, toLowerCase) på alla formulär-fält
- Regex-mönster för telefonnummer och andra strukturerade fält
- DoS-skydd via längdgränser (max()) på alla textfält
- Konsekvent Escape-tangent-hantering för keyboard-navigering i alla modaler
- Separation av mockdata och komponentkod för säker databas-migration senare

## ⚛️ React-mönster & Arkitektur

- Custom hooks för separation av logik och JSX (useDateTime, useMemberSearch)
- Controlled components för React Router (view, date) och formulär
- Immutable state-updates med spread-operatorn
- Conditional rendering för modaler och tomma listor
- TypeScript-typer med union types, generics och Omit för säkra API:er
- Prop drilling minimerat via custom hooks

## 📅 Externa integrationer

- Integrerade react-big-calendar med anpassad toolbar och svenska översättningar
- Live-hämtning av koptisk-ortodoxa högtider från coptic.io API
- @tanstack/react-query för professionell datahämtning med caching
- Förberedde för Google Calendar-integration (backend v.7-8)
- Förberedde för Speechmatics speech-to-text via WebSocket (backend v.8)
- Förberedde för DeepL för arabisk→svensk översättning

## 🧪 Formulär & Validering

- Byggde formulär med kontrollerade komponenter och Zod-validering (safeParse) för säker input
- Full CRUD-funktionalitet (Create, Read, Update, Delete) för events
- E-post-validering med format-kontroll och case-normalisering
- Telefon-validering med regex för internationella format
- Numeriska fält med min/max-intervall

## 📝 Dokumentation & Process

- Skrev komplett projektdokumentation (README, CLAUDE.md, ARCHITECTURE, API, TROUBLESHOOTING)
- Underhöll daglig utvecklingslogg (DAGBOK.md) med lärdomar och utmaningar
- Skapade komplett roadmap med 12 huvudfunktioner och 4 utvecklingsfaser
- Följde kodregler för svenska kommentarer i objektivt studentspråk
- Använde git med tydliga commit-meddelanden och feature-fokuserad historik

## 🛠 Verktyg & bibliotek

- **Frontend:** React, Vite, TypeScript, Tailwind CSS v4, React Router v7
- **State:** React hooks (useState, useEffect, useMemo)
- **Data:** @tanstack/react-query, Zod
- **UI:** lucide-react, react-big-calendar, framer-motion, recharts
- **Datum:** date-fns med svensk locale
- **Utveckling:** Git, GitHub, VS Code, npm

## 🎯 Kärnkompetenser demonstrerade

- Fullstack-tänk: bygga UI som förbereder för backend-integration
- Säkerhetsmedvetenhet: validering, sanering, XSS-skydd
- Kodkvalitet: DRY, separation of concerns, TypeScript-säkerhet
- Användarupplevelse: keyboard-navigering, aria-labels, tydliga felmeddelanden
- Projektstruktur: monorepo, komponent-arkitektur, återanvändbara mönster
- Problem-lösning: debugging av trunkerade filer, controlled/uncontrolled components

---

## 🏆 Milstolpar

| Datum | Prestation |
|-------|-----------|
| 22 juli 2026 | Första ParishHub-sidan igång — grundstruktur för monorepo |
| 23 juli 2026 | Dashboard komplett med statistikkort, födelsedagslista, prioritetslista |
| 25 juli 2026 | Dashboard klar med custom hooks (useDateTime), Badge, PriorityList och statusMap-mönster |
| 28 juli 2026 | Kalender med full CRUD, coptic.io API-integration, react-query, Zod, egen CalendarToolbar |
| 30 juli 2026 | Medlems-CRUD, Gudstjänst-modul med närvaro, ErrorBoundary, säkerhet, första tester och CI-pipeline |
| 3 augusti 2026 | Tvåspråkighet: hela appen migrerad till svenska + arabiska (i18next + RTL + Cairo-font) |
| 3 augusti 2026 | Mörkt läge på hela appen — semantiska DRY-klasser, egen Dropdown (native select gick inte att styla) |
| 3 augusti 2026 | Familjekoppling (familyId) + WhatsApp-integration (buildWhatsAppLink, GroupMessageModal, mallar) |
| 3 augusti 2026 | Avatar-komponent (initialer i färgcirkel) + profilbild via kamera eller filuppladdning (base64) |
| 3 augusti 2026 | Clean Architecture på hela appen: domain/repositories/, data/mock/, use-cases/, presentation-hooks |
| 3 augusti 2026 | Maxad TypeScript (5 extra strict-flaggor) — 57 av 58 typfel åtgärdade, äkta latenta buggar hittade |
| 3 augusti 2026 | WCAG-plan implementerad: semantiska taggar, focus-trap i modaler, Skeleton, toast (sonner), axe-core, focus-visible |
| 3 augusti 2026 | Prestanda: React.memo, useCallback, lazy() + Suspense med code-splitting per route, path aliases |

---

## 💡 Hur man använder detta i CV

**Kort version (LinkedIn-headline):**
> "Byggde fullstack Kyrko-app med React, TypeScript, Zod-validering och externt API"

**Mellanlång version (LinkedIn about):**
> "Fullstack-utvecklare med säkerhetsinriktning. Bygger ParishHub — ett digitalt system för kyrkoförvaltning med React, TypeScript, Zod-validering, live-API från coptic.io och planerad AI-tolkning via Speechmatics. Fokus på ren kod, DRY-principen och a11y."

**Lång version (CV-sektion):**
> Se punkterna ovan — välj 5-8 relevanta för jobbet.

---

## 📝 Att lägga till framöver

När följande blir klart — uppdatera denna fil:
- Backend-utveckling (Express, REST API)
- Databas-arkitektur (PostgreSQL, Prisma)
- Autentisering (JWT, bcrypt, refresh tokens)
- Realtids-kommunikation (WebSocket, Speechmatics)
- Kryptering (crypto för anteckningar)
- Deployment (Vercel, Railway)
- Testing (om vi bygger tester)

---

*Uppdaterad regelbundet av Sima. Detta är ditt bevis på progress. Var stolt över varje punkt. 💜*