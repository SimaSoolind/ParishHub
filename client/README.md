# ParishHub — Frontend

Detta är frontend-koden för ParishHub-kyrkoappen. En React-app som prästen
använder för att hantera sin församling.

För helhetsbilden (backend, dokumentation, roadmap), se [projektets huvud-README](../README.md).

---

## Vad appen gör

- **Dashboard** — startsida med statistik, födelsedagar och kontaktlista
- **Medlemmar** — sök, filtrera, lägg till, redigera och radera medlemmar
- **Kalender** — händelser med full CRUD + koptiska högtider från coptic.io
- **Gudstjänster** — planera gudstjänster och bocka av närvaro
- **WhatsApp-utskick** — kontakta enskilda medlemmar eller grupper via WhatsApp
- **Tvåspråkig** — svenska och arabiska med RTL-stöd
- **Mörkt läge** — hela appen växlar mellan ljust och mörkt tema

---

## Tekniker som används

**Grund:**
- **React 19** — komponent-bibliotek
- **TypeScript 6** — typsäkerhet
- **Vite 8** — utvecklingsserver och byggare
- **Tailwind CSS v4** — styling med utility-klasser

**Routing och data:**
- **React Router v7** — navigering mellan sidor
- **@tanstack/react-query** — datahämtning och cachning
- **Zod** — validering av formulär och API-svar

**Språk och UI:**
- **i18next + react-i18next** — översättningar (svenska + arabiska)
- **date-fns** — svenska datum-format
- **lucide-react** — ikoner
- **react-big-calendar** — kalender-komponent
- **sonner** — toast-notiser
- **framer-motion** — animationer
- **@dnd-kit/core** — drag-och-släpp
- **recharts** — grafer och diagram

**Tillgänglighet och kvalitet:**
- **focus-trap-react** — fångar fokus i modaler (WCAG-krav)
- **@axe-core/react** — a11y-skanner i utvecklingsläge
- **eslint-plugin-security** — säkerhets-linting
- **Vitest + @testing-library/react + jsdom** — enhetstester

---

## Så här kör du appen

Kräver **Node.js 20 eller högre**.

1. Öppna terminalen och gå till client-mappen:
   ```bash
   cd client
   ```

2. Installera alla paket:
   ```bash
   npm install
   ```

3. Starta utvecklingsservern:
   ```bash
   npm run dev
   ```

4. Öppna webbläsaren på **http://localhost:5173**

Appen använder mockdata (fejkade medlemmar) — backend byggs i vecka 5-6.

---

## Så här bygger du för produktion

```bash
npm run build
```

Bygget hamnar i `dist/`-mappen. Kör `npm run preview` för att testa det bygget lokalt.

---

## Så här kör du tester

```bash
npm run test
```

Tester finns i samma mapp som koden de testar, med filändelsen `.test.ts` eller `.test.tsx`.

För att bara kontrollera att koden är typsäker (utan att bygga):
```bash
npx tsc -p tsconfig.app.json --noEmit
```

För att formatera koden:
```bash
npm run format
```

---

## Mappstruktur i `src/`

- **`components/`** — återanvändbara UI-delar (knappar, kort, modaler)
- **`pages/`** — hela sidor (en per URL: Dashboard, Members, Calendar, Services)
- **`hooks/`** — egna React-hooks (useMembers, useTheme, useDateTime m.fl.)
- **`domain/`** — entiteter (Member, Event) och repository-gränssnitt (Clean Architecture)
- **`data/`** — mockdata + `data/mock/` med repository-implementationer
- **`use-cases/`** — ren affärslogik (attendance, family) — enkelt att testa
- **`utils/`** — hjälpfunktioner (dateUtils)
- **`lib/`** — tjänster (api, errorHandler, whatsapp)
- **`api/`** — externa API-anrop (coptic.io)
- **`schemas/`** — Zod-schemas för runtime-validering
- **`locales/`** — översättningar (sv.ts, ar.ts)
- **`i18n.ts`** — i18next-konfiguration
- **`main.tsx`** — appens startpunkt
- **`App.tsx`** — routing och ErrorBoundary
- **`index.css`** — semantiska CSS-klasser (samlad plats för färg-tokens)

**Regel att komma ihåg:** komponenter och sidor får ALDRIG importera från `data/` direkt.
De går via hook → repository. Det gör att mockdata kan bytas mot riktig backend-data
utan att röra UI-koden.

---

## Vidare läsning

- [Projektets huvud-README](../README.md) — hela projektet
- [CLAUDE.md](../CLAUDE.md) — kodregler och kommentarsstandard
- [docs/BACKLOG.md](../docs/BACKLOG.md) — alla uppgifter + vision & faser
- [docs/](../docs/) — teknisk dokumentation
