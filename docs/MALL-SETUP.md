# 📘 Mall: Sätt upp Claude Code + Dokumentation
## Version 2.0 — med full dokumentation för långsiktig kontroll

Denna mall är gjord för Sima.
Läs ETT steg i taget. Bocka av när du är klar.
Efter 6 månader ska du (eller vem som helst) kunna öppna projektet och FÖRSTÅ ALLT.

---

## 🎯 Mål med denna mall

1. Sätta upp Claude Code i alla dina framtida projekt
2. Ha DOKUMENTATION som gör att du kommer ihåg allt
3. Kunna felsöka snabbt när något går fel
4. Kunna visa upp projektet på LIA och för arbetsgivare

---

## 📋 Total översikt — 10 steg

| Steg | Vad | Kategori |
|------|-----|----------|
| 1 | Skapa mappstruktur | Setup |
| 2 | Skriv CLAUDE.md | Setup |
| 3 | Sätt behörigheter | Setup |
| 4 | Skapa första skill | Setup |
| 5 | Skapa slash-kommando | Setup |
| 6 | **Skriv README.md** | 📚 Dokumentation |
| 7 | **Skapa CHANGELOG.md** | 📚 Dokumentation |
| 8 | **Skapa docs/-mapp** | 📚 Dokumentation |
| 9 | Testa allt | Kontroll |
| 10 | Uppdatera .gitignore | Säkerhet |

---

# STEG 1 — Skapa mappstrukturen

## 🟠 VAD är det?
Du skapar tomma mappar och filer där alla dina inställningar och dokumentation ska bo.

## 🟢 VARFÖR är det bra?
Utan strukturen vet varken du eller Claude var saker ska ligga. Rörigt = fel.

**Exempel utan struktur:** Du har regler i chat-historiken, färger i en post-it, säkerhets-regler i huvudet. Om 6 månader minns du INGET.

**Exempel med struktur:** Allt ligger på fasta platser. Öppna mappen → hitta direkt.

## 🔧 HUR gör jag?
Öppna terminalen i projektets rot-mapp:

```bash
# Kontrollera att du står rätt
pwd

# Skapa Claude-mappar
mkdir -p .claude/skills
mkdir -p .claude/commands
mkdir -p .claude/agents

# Skapa dokumentations-mapp
mkdir -p docs

# Skapa filer
touch CLAUDE.md
touch README.md
touch CHANGELOG.md
touch .claude/settings.json
touch docs/ARCHITECTURE.md
touch docs/TROUBLESHOOTING.md
```

## 📌 NÄR ska jag göra det?
En gång per projekt. Aldrig igen i samma projekt.

## ✅ Checklista
- [ ] Jag står i rätt mapp (kontrollerat med `pwd`)
- [ ] Alla mappar skapade
- [ ] Alla filer skapade
- [ ] Jag ser mapparna i VS Code (visa dolda filer om det behövs)

---

# STEG 2 — Fyll i CLAUDE.md

## 🟠 VAD är det?
Projektreglerna som Claude läser VARJE gång du öppnar projektet.

## 🟢 VARFÖR är det bra?
Du slipper upprepa samma sak. Claude vet allt om projektet från början.

**Exempel:** Utan CLAUDE.md måste du säga "använd Tailwind" 100 gånger. Med CLAUDE.md — noll gånger.

## 🔧 HUR gör jag?
Öppna `CLAUDE.md` och skriv (byt ut [text i hakparenteser]):

```markdown
# [Projektnamn]

## 📖 Om projektet
[En mening om vad appen gör och för vem]

## 🛠 Teknisk stack
- Frontend: [React + Vite + TypeScript]
- Styling: [Tailwind CSS v4]
- Routing: [React Router]
- Backend: [Node.js + Express]
- Databas: [MongoDB]
- Hosting: [Netlify + Railway]

## 📐 Kodregler
- Skriv ALLA kommentarer på svenska
- Använd TypeScript — inga .js-filer
- Funktionella komponenter, aldrig class components
- PascalCase för komponenter (MemberList.tsx)
- camelCase för hooks (useMembers.ts) med "use"-prefix
- En komponent per fil

## 💬 Kommentarsregler (VIKTIGT för långsiktighet)
- Skriv ALLA kommentarer på **lätt svenska** och i **studentspråk**
- Använd **objektivt språk** — undvik "du", "vi", "man", "jag"
- Skriv som en lärobok: neutralt, tydligt, kort
- Varje funktion ska ha en kommentar som beskriver:
  1. Vad funktionen gör (i en mening)
  2. Vilka argument den tar
  3. Vad den returnerar
- Varje "tricky" kodrad ska ha en förklarande kommentar
- Använd JSDoc-format för funktioner

### Exempel på RÄTT och FEL kommentarer

❌ FEL (subjektivt, personligt):
```typescript
// Här hämtar vi medlemmen från databasen
// Du kan använda denna funktion om du vill visa profil
```

✅ RÄTT (objektivt, studentspråk):
```typescript
// Hämtar en medlem från databasen med hjälp av ID
// Används vid visning av medlemsprofil
```

❌ FEL:
```typescript
// Vi loopar igenom alla medlemmar
```

✅ RÄTT:
```typescript
// Går igenom listan med medlemmar och skriver ut namnet
```

❌ FEL:
```typescript
// Du måste kolla att lösenordet är rätt först
```

✅ RÄTT:
```typescript
// Kontrollerar att lösenordet stämmer innan inloggning tillåts
```

## 🎨 Design
- Färger: [lista här]
- Rubriker: [t.ex. Cormorant Garamond]
- Text: [t.ex. Inter]

## 🔒 Säkerhet
- API-nycklar ALDRIG i frontend
- Alla hemligheter i .env på servern
- Ingen "dangerouslyAllowBrowser: true"
- Validera all input

## 🤝 Så vill jag att du hjälper mig
- Svara alltid på svenska
- Förklara VAD, VARFÖR, HUR
- En sak i taget
- Fråga innan stora ändringar
- Lägg alltid till kommentarer på svenska i koden
```

## 📌 NÄR ska jag göra det?
En gång per projekt. Uppdatera när något ändras.

## ✅ Checklista
- [ ] Filen är ifylld
- [ ] Jag har läst igenom och det stämmer

---

# STEG 3 — Behörigheter (settings.json)

## 🟠 VAD är det?
En fil som bestämmer vad Claude får och inte får göra.

## 🟢 VARFÖR är det bra?
Skyddar dig från misstag. Claude kan inte råka radera din .env-fil.

**Exempel:** Utan skydd kan Claude köra `rm -rf` och förstöra allt. Med skydd blockeras det.

## 🔧 HUR gör jag?
Öppna `.claude/settings.json` och skriv:

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Write",
      "Grep",
      "Glob",
      "Bash(npm run:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)"
    ],
    "ask": [
      "Bash(git push:*)",
      "Bash(git commit:*)",
      "Bash(npm install:*)",
      "Bash(rm:*)"
    ],
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Read(*.pem)",
      "Read(*.key)"
    ]
  }
}
```

**Förklaring rad för rad:**
- ✅ `allow` = får göra automatiskt (läsa filer, köra tester)
- ⚠️ `ask` = MÅSTE fråga dig först (push, commit, install)
- ❌ `deny` = FÅR ALDRIG göra (läsa hemliga filer)

## 📌 NÄR ska jag göra det?
En gång per projekt. Uppdatera när du får nya hemliga filer.

## ✅ Checklista
- [ ] Filen är ifylld med korrekt JSON
- [ ] `.env` är i deny-listan
- [ ] Farliga kommandon är i ask-listan

---

# STEG 4 — Skapa ditt första skill

## 🟠 VAD är det?
En djupare instruktionsfil för ett specifikt område i projektet.

## 🟢 VARFÖR är det bra?
CLAUDE.md blir för lång om du stoppar in allt. Skills håller det organiserat.

**Exempel:**
- Skill 1: `komponenter` — hur du bygger UI
- Skill 2: `säkerhet` — regler för JWT och lösenord
- Skill 3: `databas` — MongoDB-mönster

## 🔧 HUR gör jag?
```bash
mkdir -p .claude/skills/projekt-regler
touch .claude/skills/projekt-regler/SKILL.md
```

Fyll i:

```markdown
---
name: projekt-regler
description: Regler och mönster för [PROJEKTNAMN]. Använd alltid när du kodar i detta projekt.
---

# Regler för [PROJEKTNAMN]

## Mappstruktur
- src/components/ → återanvändbara komponenter
- src/pages/ → sidor (en per route)
- src/hooks/ → egna hooks
- src/services/ → API-anrop
- src/types/ → TypeScript-typer

## Namngivning
- Komponent: PascalCase.tsx
- Hook: useSomething.ts

## Mall för en komponent

/**
 * KomponentNamn — kort beskrivning i objektiv, lätt svenska
 * (använd studentspråk, undvik "du", "vi", "man")
 *
 * @param props.name - beskrivning av prop
 * @returns JSX-element
 */
export function KomponentNamn({ name }: Props) {
  // Visar namnet i en div. Används på startsidan.
  return <div>{name}</div>;
}
```

## Kommentarsspråk — regler
- Skriv i **lätt svenska** (studentspråk, inte akademiskt)
- Skriv **objektivt** — inga "du", "vi", "man", "jag"
- Skriv **kort och tydligt** — en mening räcker oftast
- Beskriv **VAD koden gör**, inte vem som gör den

## 📌 NÄR ska jag göra det?
När du märker att du upprepar samma instruktion 3+ gånger.

## ✅ Checklista
- [ ] Skill-mapp skapad
- [ ] SKILL.md ifylld

---

# STEG 5 — Slash-kommandon

## 🟠 VAD är det?
Snabb-kommandon som `/granska` som gör en hel uppgift på en gång.

## 🟢 VARFÖR är det bra?
Sparar tid och energi. Perfekt för dig med ADHD — du behöver inte tänka.

## 🔧 HUR gör jag?
Skapa tre kommandon som du kommer använda mycket:

### Kommando 1: /granska
```bash
touch .claude/commands/granska.md
```

Innehåll:
```markdown
Granska koden jag just ändrat. Kolla:
1. Säkerhetsproblem (särskilt API-nycklar)
2. TypeScript-fel eller "any"-typer
3. Saknad felhantering
4. Otillgänglighet (a11y)
5. Prestanda-problem
6. **Saknade kommentarer på svenska**

Ge feedback på svenska. En sak i taget.
```

### Kommando 2: /kommentera
```bash
touch .claude/commands/kommentera.md
```

Innehåll:
```markdown
Läs filen jag pekar på och lägg till svenska kommentarer:
1. En JSDoc-kommentar över varje funktion
2. En kort kommentar över varje "tricky" rad
3. Beskriv vad, varför och när koden används

Ändra INGEN logik. Bara lägg till kommentarer.
```

### Kommando 3: /förklara
```bash
touch .claude/commands/förklara.md
```

Innehåll:
```markdown
Förklara koden jag pekar på för mig som om jag är nybörjare.
Använd:
- Enkel svenska
- VAD → VARFÖR → HUR och när det är bra att använda det
- Ett kort exempel
- Inga metaforer
```

## 📌 NÄR ska jag göra det?
Skapa ett nytt kommando varje gång du upptäcker att du gör samma sak ofta.

## ✅ Checklista
- [ ] /granska skapat
- [ ] /kommentera skapat
- [ ] /förklara skapat

---

# 📚 STEG 6 — Skriv README.md (VIKTIGT för långsiktighet)

## 🟠 VAD är det?
Projektets "framsida". Det första någon läser när de öppnar projektet på GitHub.

## 🟢 VARFÖR är det bra?
Om 6 månader glömmer du hur du startade projektet. README.md räddar dig.

**Exempel utan README:** Du öppnar projektet efter LIA. "Vad var kommandot igen? npm start? npm run dev?" — timmar av googlande.

**Exempel MED README:** Du läser 30 sekunder, sen är du igång.

## 🔧 HUR gör jag?
Öppna `README.md` och skriv:

```markdown
# [Projektnamn]

En mening om vad appen gör.

## 🎯 Syfte
[Vad löser appen? För vem?]

## 🛠 Teknisk stack
- Frontend: React + Vite + TypeScript
- Styling: Tailwind v4
- Backend: Node.js + Express
- Databas: MongoDB
- Hosting: Netlify + Railway

## 🚀 Kom igång (för nya utvecklare eller mig själv om 6 månader)

### Krav
- Node.js version 20 eller högre
- npm eller pnpm
- Ett MongoDB-konto (Atlas)

### Steg 1: Klona projektet
git clone [URL]
cd [projektnamn]

### Steg 2: Installera paket
npm install

### Steg 3: Skapa .env-fil
Kopiera .env.example till .env och fyll i:
- VITE_API_URL=http://localhost:3000
- OPENAI_API_KEY=[din nyckel]

### Steg 4: Starta utvecklingsservern
npm run dev

Öppna sedan http://localhost:5173

## 📁 Mappstruktur

src/
  components/  → UI-komponenter
  pages/       → Sidor (en per route)
  hooks/       → Egna React hooks
  services/    → API-anrop
  types/       → TypeScript-typer
  utils/       → Hjälpfunktioner

## 🧪 Kör tester
npm run test

## 🏗 Bygg för produktion
npm run build

## 📖 Vidare läsning
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) — Hur systemet är uppbyggt
- [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) — Vanliga fel och lösningar
- [CHANGELOG.md](./CHANGELOG.md) — Vad som har ändrats över tid

## 👤 Byggd av
Sima Elias — 2026
```

## 📌 NÄR ska jag göra det?
- Skapa: När projektet startas
- Uppdatera: När du lägger till stora funktioner eller ändrar hur man startar appen

## ✅ Checklista
- [ ] README.md är ifylld
- [ ] Steg för att starta funkar (testa själv!)
- [ ] Länkar till andra docs är med

---

# 📚 STEG 7 — Skapa CHANGELOG.md

## 🟠 VAD är det?
En logg-bok över allt du ändrat i projektet. En rad per ändring.

## 🟢 VARFÖR är det bra?
Om något plötsligt slutar fungera kan du se: "Aha, jag ändrade X den 15 juli — det är därför".

**Exempel:** "Vad var det som gjorde att appen kraschade?" → Kolla CHANGELOG → hittar direkt.

## 🔧 HUR gör jag?
Öppna `CHANGELOG.md` och skriv:

```markdown
# Ändringslogg

Alla viktiga ändringar dokumenteras här.
Format: `## [Version] - YYYY-MM-DD`

## [0.1.0] - 2026-07-20
### Tillagt
- Första versionen av projektet
- Grundstruktur med React + Vite + TypeScript
- CLAUDE.md och docs-mapp

### Ändrat
- (inget än)

### Fixat
- (inget än)

### Borttaget
- (inget än)
```

**Regel:** Varje gång du gör en betydande ändring, lägg till EN rad högst upp.

Exempel på framtida rader:
```markdown
## [0.2.0] - 2026-07-25
### Tillagt
- Inloggning med JWT
- Medlemsregister-sida

### Fixat
- Bugg: knappen på Home-sidan fungerade inte i Safari
```

## 📌 NÄR ska jag göra det?
- Skapa: När projektet startas
- Uppdatera: Varje gång du gör en betydande ändring (INTE varje litet fix)

## ✅ Checklista
- [ ] CHANGELOG.md är skapad
- [ ] Första raden är ifylld med dagens datum

---

# 📚 STEG 8 — Fyll i docs/-mappen

## 🟠 VAD är det?
Djupare dokumentation som inte får plats i README.

Två filer att börja med:
1. `ARCHITECTURE.md` — hur systemet är uppbyggt
2. `TROUBLESHOOTING.md` — vanliga fel och lösningar

## 🟢 VARFÖR är det bra?

**ARCHITECTURE.md:** När du börjar backend om en månad — hur kopplas frontend till servern? Var lagras data? Ditt framtida jag TACKAR dig.

**TROUBLESHOOTING.md:** Samma bugg dyker upp två gånger. Andra gången minns du inte hur du löste det. Här sparar du lösningen.

## 🔧 HUR gör jag?

### ARCHITECTURE.md

```markdown
# Arkitektur

## Översikt
Beskriv i EN mening hur systemet är uppbyggt.

Exempel: "Frontend (React) → Backend (Express) → Databas (MongoDB)"

## Dataflöde

1. Användaren klickar på "Spara medlem"
2. Frontend skickar POST /api/members till backend
3. Backend validerar och sparar i MongoDB
4. Backend returnerar den nya medlemmen
5. Frontend uppdaterar listan

## Viktiga beslut (varför gjorde vi så?)

### Varför MongoDB istället för PostgreSQL?
- Enklare att komma igång
- Passar bra för dokument-liknande data (medlemmar)
- Gratis molntjänst (Atlas)

### Varför JWT istället för session-cookies?
- Fungerar med mobilappen senare
- Inget behov av server-side session

## Beroenden (vilka andra tjänster används?)
- OpenAI API — AI-tolkning
- MongoDB Atlas — databas
- Netlify — frontend-hosting
- Railway — backend-hosting

## Diagram
[Om möjligt: lägg till en enkel skiss här]
```

### TROUBLESHOOTING.md

```markdown
# Felsökningsguide

Vanliga fel och deras lösningar. Uppdatera varje gång du löser en bugg.

## 🔴 Fel: "Cannot connect to MongoDB"

**När:** Vid start av backend

**Orsak:** Fel i MONGODB_URI eller MongoDB Atlas är nere

**Lösning:**
1. Kolla .env-filen
2. Kolla att din IP är godkänd i MongoDB Atlas
3. Testa att pinga: `ping cluster0.xxx.mongodb.net`

---

## 🔴 Fel: "CORS blocked"

**När:** Frontend anropar backend

**Orsak:** Backend tillåter inte anrop från frontend-URL

**Lösning:**
- I server/index.ts: kolla att din frontend-URL är i cors-listan

---

## 🔴 Fel: "Module not found"

**När:** Efter npm install

**Orsak:** Cache-problem eller korrupt node_modules

**Lösning:**
rm -rf node_modules package-lock.json
npm install
```

## 📌 NÄR ska jag göra det?
- ARCHITECTURE.md: När du gör större arkitektur-beslut
- TROUBLESHOOTING.md: Varje gång du löser en bugg som tog mer än 15 min

## ✅ Checklista
- [ ] ARCHITECTURE.md fylld med grunderna
- [ ] TROUBLESHOOTING.md skapad (kan vara tom först)

---

# STEG 9 — Testa allt

## 🟠 VAD är det?
Ett litet test för att kolla att allt fungerar.

## 🟢 VARFÖR är det bra?
Bättre upptäcka fel NU än om två veckor.

## 🔧 HUR gör jag?
Öppna projektet i Claude Code och testa dessa tre saker:

### Test 1: Läser Claude CLAUDE.md?
Fråga: "Läs CLAUDE.md och sammanfatta reglerna."
✅ Om Claude svarar med dina regler → funkar

### Test 2: Fungerar slash-kommandot?
Skriv: `/förklara`
✅ Om Claude ber om vilken kod du vill förklara → funkar

### Test 3: Blockeras hemliga filer?
Fråga: "Läs .env"
✅ Om Claude säger "kan inte läsa" → funkar

## ✅ Checklista
- [ ] Test 1 passerade
- [ ] Test 2 passerade
- [ ] Test 3 passerade

---

# STEG 10 — Uppdatera .gitignore

## 🟠 VAD är det?
En fil som säger till git: "dessa filer får INTE laddas upp till GitHub".

## 🟢 VARFÖR är det bra?
Skyddar hemligheter. En läckt API-nyckel kan kosta tusentals kronor.

## 🔧 HUR gör jag?
Öppna `.gitignore` (finns oftast redan) och lägg till på slutet:

```
# Hemligheter — får ALDRIG till GitHub
.env
.env.*
!.env.example
*.pem
*.key

# Claude — personliga inställningar
.claude/settings.local.json

# Beroenden
node_modules/

# Byggda filer
dist/
build/

# System-filer
.DS_Store
Thumbs.db
```

## 📌 NÄR ska jag göra det?
INNAN första `git push`. Alltid.

## ✅ Checklista
- [ ] .gitignore uppdaterad
- [ ] .env är INTE med i git (kör `git status` — den ska inte synas)

---

# 🎉 Slutlig checklista

Innan du säger "klart":

- [ ] Alla 10 steg är gjorda
- [ ] Jag kan starta projektet från README.md-instruktionerna
- [ ] CLAUDE.md innehåller alla mina regler
- [ ] settings.json skyddar .env
- [ ] README.md förklarar hur man kommer igång
- [ ] CHANGELOG.md har första raden
- [ ] docs/-mappen har ARCHITECTURE och TROUBLESHOOTING
- [ ] .gitignore skyddar hemligheter
- [ ] Testerna passerade

---

# 📖 Löpande regler för dokumentation

Följ dessa varje dag när du kodar:

## Regel 1: Kommentera varje funktion
**Använd lätt svenska. Använd studentspråk. Skriv objektivt — inga "du", "vi", "man" eller "jag".**

```typescript
/**
 * Hämtar en medlem från databasen med hjälp av ID.
 * @param id - Medlemmens unika identifierare
 * @returns Medlem-objekt eller null om medlemmen saknas
 */
async function getMember(id: string): Promise<Member | null> {
  // findById är en Mongoose-metod som söker på _id-fältet
  return await MemberModel.findById(id);
}
```

**Jämför med FEL exempel:**
```typescript
// Vi hämtar en medlem här — du kan använda detta överallt   ❌
// Hämtar en medlem från databasen med hjälp av ID           ✅
```

## Regel 2: Uppdatera CHANGELOG vid stora ändringar
Efter varje betydande commit → lägg till EN rad.

## Regel 3: Uppdatera TROUBLESHOOTING vid buggar
Löst en bugg som tog över 15 min? → Skriv upp den.

## Regel 4: Uppdatera ARCHITECTURE vid designbeslut
Bytt databas? Ny extern tjänst? → Skriv varför.

## Regel 5: Uppdatera README vid nya krav
Nytt npm-paket? Ny .env-variabel? → Uppdatera README.

## Regel 6: Avsluta ALLTID dagen med en dags-logg i DAGBOK.md
Innan datorn stängs för dagen — öppna DAGBOK.md och skriv:
- Tid lagt ner
- Vad som gjordes
- Lärdomar
- Utmaningar
- Fel att komma ihåg
- Reflektion
- Nästa steg

Tar 5 minuter. Sparar månader av glömska.
Detta är obligatoriskt — inte valfritt.

---

# 💡 Ditt dokumentationsflöde

Varje gång du kodar:

```
Innan du börjar:
   ↓
Läs README.md och CLAUDE.md
   ↓
Koda med svenska kommentarer
   ↓
Något oväntat hände?
   ↓ ja
Skriv upp i TROUBLESHOOTING.md
   ↓
Stor ändring gjord?
   ↓ ja
Lägg till rad i CHANGELOG.md
   ↓
Innan du stänger datorn:
   ↓
Skriv dags-logg i DAGBOK.md (OBLIGATORISKT)
   ↓
Klart för idag ✅
```

---

**Kom ihåg, Sima:**
Dokumentation är INTE tråkigt — det är en kärleksbrev till ditt framtida jag.
Om 6 månader kommer du tacka dig själv. 💪

---

# 🚀 STEG 11-14 — Utökningar för framtiden

**Görs INTE nu.** Läggs till mallen så inget glöms bort.
Varje utökning har VAD, VARFÖR, NÄR och HUR.

---

## 🪝 STEG 11 — Hooks

### 🟠 VAD
Skript som körs **automatiskt** vid vissa händelser i Claude Code.

Tre vanliga händelser:
- `PreToolUse` — INNAN Claude gör något
- `PostToolUse` — EFTER Claude gjort något
- `SessionStart` — när en ny chatt börjar

### 🟢 VARFÖR
Automatisera saker som annars glöms bort.

**Exempel:**
- Kör `npm run lint` automatiskt efter varje fil-ändring
- Blockera farliga operationer innan de sker
- Skicka Slack-meddelande när en session startar

### 📌 NÄR behövs det
- När projektet har många automatiska tester
- När farliga operationer måste blockeras
- I team med flera utvecklare
- För DevSecOps-flöden (passar säkerhetsutbildningen!)

### 🔧 HUR (när dagen kommer)
Skapa fil `.claude/hooks/postToolUse.json`:

```json
{
  "matcher": "Write",
  "command": "npm run lint"
}
```

---

## 🔌 STEG 12 — MCP (Model Context Protocol)

### 🟠 VAD
Låter Claude prata **direkt** med externa tjänster (databas, GitHub, Slack, Deepgram).

### 🟢 VARFÖR
Slippa kopiera data manuellt mellan verktyg. Claude gör allt själv.

**Utan MCP:** Öppna Prisma Studio → kopiera data → klistra in i Claude
**Med MCP:** Fråga Claude direkt → svar med data

### 📌 NÄR behövs det
- Efter backend + databas är klara (v.5-6 av studieplanen)
- Bra för säkerhetsgranskning av produktionsdata
- När flera verktyg måste kopplas ihop

### 🔧 HUR (när dagen kommer)

Installera MCP-server:
```bash
npm install @modelcontextprotocol/server-postgres
```

Skapa fil `.claude/mcp.json`:
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": { "DATABASE_URL": "..." }
    }
  }
}
```

**Rekommenderade MCP-servrar för ParishHub:**
- `@modelcontextprotocol/server-postgres` — läsa/skriva medlemmar
- `@modelcontextprotocol/server-github` — hantera issues och PR
- Deepgram MCP — testa live-tolkning direkt

---

## 📦 STEG 13 — Plugins

### 🟠 VAD
Färdiga paket med skills, hooks, kommandon och MCP-kopplingar — allt i ett.

### 🟢 VARFÖR
Slippa uppfinna hjulet. Installera andras arbete med ett kommando.

### 📌 NÄR behövs det
- När samma arbetsflöde upprepas i flera projekt
- När teamet vill dela verktyg
- När Sima vill bygga eget plugin (`sima-kodcoach`) att använda i alla projekt

### 🔧 HUR (när dagen kommer)

1. Skapa mapp `.claude-plugin/`
2. Lägg till `plugin.json` med metadata
3. Lägg in skills, hooks, kommandon i undermappar
4. Dela via GitHub

### 💡 Framtidsvision för Sima
Bygg ett eget plugin med:
- Simas kommentarsregler
- Slash-kommandon (/granska, /kommentera, /förklara)
- Kodstandard
- Installera i ALLA framtida projekt med ett kommando

---

## 🤖 STEG 14 — Subagents

### 🟠 VAD
Flera Claude-agenter som arbetar **parallellt** med olika uppgifter.

### 🟢 VARFÖR
Sparar tid när flera saker ska göras samtidigt.

**Exempel:**
- Agent A skriver koden
- Agent B granskar säkerheten
- Agent C kör tester
- Alla arbetar parallellt → färre timmar totalt

### 📌 NÄR behövs det
- Vid större refaktorering
- När kod ska granskas parallellt med utveckling
- När tester ska köras samtidigt

### 🔧 HUR (när dagen kommer)

Skapa fil `.claude/agents/code-reviewer.md`:

```markdown
---
name: code-reviewer
description: Granskar kod för säkerhet, prestanda och läsbarhet
tools: Read, Grep, Glob
---

Uppgift: granska koden och rapportera problem.
Följ kommentarsreglerna i CLAUDE.md.
Svara på svenska.
Använd objektivt språk.
```

Sen anropar Claude denna agent med Task-verktyget.

---

## 📊 Översikt — alla 14 steg

| Steg | Vad | När |
|------|-----|-----|
| 1-10 | Grundsetup | ✅ Nu |
| 11 | Hooks | När tester finns |
| 12 | MCP | Efter backend är klar (v.5-6) |
| 13 | Plugins | När mönstret upprepas |
| 14 | Subagents | Vid större arbete |

---

**Kom ihåg, Sima:**
Det är OK att bara ha steg 1-10 just nu. Steg 11-14 är proffs-läge för senare.
Men nu står det i mallen så inget glöms bort. 💪💜