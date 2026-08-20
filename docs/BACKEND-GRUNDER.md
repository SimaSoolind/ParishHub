# 🧠 Backend — grunder och lärdagbok (pedagogiskt)

> **Syfte:** Lära mig backend från grunden OCH dokumentera hela resan steg för steg,
> så jag förstår vad vi gör och varför — inte bara härmar.
> **Använd när:** jag glömt ett begrepp, eller vill gå tillbaka och se hur vi byggde något.
> **Se även:** `docs/DATABAS-ATT-GORA.md` (tabeller vi ska bygga), `docs/BACKEND-ATT-GORA.md`.

Den här filen har två delar:
- **Del 1 — Grunderna:** begreppen förklarade enkelt (slå upp när jag glömt).
- **Del 2 — Min backend-resa:** en lärdagbok där varje steg vi bygger dokumenteras
  pedagogiskt (vad / vad koden betyder / varför / nya ord).

---
---

# 📚 DEL 1 — GRUNDERNA (begrepp)

## Vad är en backend? 🏠

Tänk på en restaurang:

| Restaurang | Min app |
|---|---|
| 🍽️ Matsalen (det gästen ser) | **Frontend** — sidorna jag byggt |
| 👨‍🍳 Köket (gästen ser det inte) | **Backend** — det vi bygger nu |
| 🥫 Skafferiet (förvaring) | **Databasen** (PostgreSQL) |

**Varför behövs backend?** Frontend visar just nu låtsas-data (mockdata). Om jag lägger till
en medlem och laddar om sidan försvinner hon. Backend + databas gör att hon **sparas på riktigt**
och finns kvar imorgon.

## De fyra byggdelarna

1. **`server/`-mappen** — själva backend-projektet (köket).
2. **Express** — servitören som tar emot förfrågningar ("ge mig alla medlemmar") och skickar svar.
3. **PostgreSQL** — databasen (skafferiet) där allt sparas permanent. (Installerad 2026-08-12.)
4. **Prisma** — översättaren mellan min kod och databasen (se SQL nedan).

---

## Vad är en tabell? 📊

En tabell är som ett **Excel-ark**. Exempel — ett ark som heter `medlemmar`:

| id | namn | telefon | kategori |
|----|------|---------|----------|
| 1 | Anna | 070-111 | vuxen |
| 2 | Johan | 070-222 | ungdom |

- Varje **rad** = en post = **en medlem**.
- Varje **kolumn** = ett **fält** = en uppgift (namn, telefon…).
- **`id`-kolumnen** = ett unikt nummer per rad, så databasen aldrig blandar ihop två medlemmar
  (även om två heter samma sak).

En **databas** = flera sådana ark: `medlemmar`, `gudstjänster`, `närvaro`, `sakrament`,
`kyrkor`, `användare` … Samma "saker" som frontend visar, fast sparade på riktigt.

## Vad är SQL? 🗣️

**SQL** = språket som databaser förstår (uttalas "ess-kju-ell" eller "sequel").
Databasen förstår inte svenska — man pratar med den i SQL. Exempel:

```sql
SELECT * FROM medlemmar;                          -- ge mig alla medlemmar
SELECT * FROM medlemmar WHERE kategori = 'ungdom'; -- bara ungdomarna
INSERT INTO medlemmar (namn) VALUES ('Sara');      -- spara en ny medlem
```

Det är lite krångligt och tekniskt. Därför använder vi **Prisma**: jag skriver enkel kod
(t.ex. `getMembers()`) och Prisma skriver SQL:en åt mig i bakgrunden. Jag slipper lära mig
SQL flytande. (Skafferiet talar SQL. Prisma är tolken.)

## Vad är en migration? 🏗️

En migration är en **instruktion som bygger eller ändrar databasens struktur** (skapar en
tabell, lägger till en kolumn). Liknelse: en **ritning + byggjournal** för skafferiet.

Så går det till:
1. Jag **beskriver** hur en tabell ska se ut (vilka kolumner) i en fil som heter Prisma-schema.
2. Jag **kör en migration** → Prisma bygger den riktiga tabellen så den matchar beskrivningen.
3. Varje migration **sparas** (en dagbok över alla ändringar).

**Varför smart?**
- 📜 Historik över hur databasen vuxit (som git-commits, fast för databasen).
- 🔁 Vem som helst kan bygga upp exakt samma databas igen från noll.
- 🛡️ Säkert att ändra — lägg till en kolumn via en ny migration utan att förstöra det som finns.

---

## Hur allt hänger ihop 🌉

```
Jag skriver:   "beskriv tabellen medlemmar"   (Prisma-schema)
      ↓ (migration)
Prisma bygger:  den riktiga tabellen i PostgreSQL
      ↓
Min kod:   getMembers()  →  Prisma  →  SQL  →  databasen  →  svarar med raderna
```

Jag skriver alltså bara enkel kod och enkla beskrivningar — Prisma sköter det svåra
(SQL + migrationer).

---

## Vanliga snubbeltrådar 🪤

Småfel som är lätta att göra i början — och hur de känns igen.

**"Webbplatsen kan inte nås / ERR_CONNECTION_REFUSED"**
Servern är inte igång. Webbläsaren kan bara nå servern medan `npm run dev` snurrar i en
öppen terminal. Lösning: starta servern och låt terminalen vara öppen. (Köket måste vara
bemannat för att kunna svara.)

**`npm run dev` startade fel sak**
Kommandot gör olika saker beroende på vilken mapp terminalen står i:

| Mapp | Vad som startar | Adress |
|---|---|---|
| `client/` | Frontend (Vite) | http://localhost:5173 |
| `server/` | Backend (Express) | http://localhost:3000 |

Lösning: `cd` till rätt mapp först. `server` = backend, `client` = frontend.

**Ctrl + C** stänger servern (då blir det "connection refused" igen — helt normalt).

---
---

# 📔 DEL 2 — MIN BACKEND-RESA (lärdagbok)

Här dokumenteras varje steg vi bygger, pedagogiskt. Målet är att jag ska kunna gå tillbaka
och förstå både VAD vi gjorde och VARFÖR.

### 📝 Mall för varje steg (samma varje gång)

```
## Steg X — [namn]   (datum)

Vad jag gjorde:      en mening om vad steget uppnådde.
Kommandon/kod:       raderna vi körde, med förklaring rad för rad.
Vad det betyder:     vad varje del gör, med enkla ord.
Varför vi gör så:     motivet — varför just detta, varför i denna ordning.
Så vet jag att det funkade:  vad jag såg som bevis (t.ex. tabell dök upp i DBeaver).
Nya ord:             begrepp som läggs till i ordlistan längst ner.
```

---

## Steg 0 — Grunden på plats ✅   (2026-08-12)

**Vad jag gjorde:** installerade verktygen som backend behöver, innan vi skriver någon kod.

**Vad jag installerade och varför:**
- **Homebrew** — en "app-affär" för terminalen på Mac. Behövs för att enkelt installera
  PostgreSQL. (Som App Store, fast för utvecklarverktyg.)
- **PostgreSQL 16** — själva databasen (skafferiet). Här ska all data sparas permanent.
- **DBeaver** — ett fönster där jag kan *se* databasen med ögonen (tabeller, rader).
  Databasen har inget eget utseende — DBeaver är glasögonen.

**Så vet jag att det funkade:**
- `psql -l` visade att databasen `parishhub` finns.
- DBeaver kunde ansluta ("Connected 59 ms") och visar `parishhub` i listan.

**Nya ord:** Homebrew, PostgreSQL, DBeaver (se ordlistan).

---

## Steg A — Skapa server-projektet 🍳   (2026-08-12)

**Vad jag gjorde:** skapade själva backend-projektet i `server/`-mappen och fick det att
starta och skriva ut en rad. Grunden (köket) står — men lagar ingen "mat" än.

**Filer jag skapade:**
- `package.json` — projektets ID-kort (namn + vilka verktyg det behöver).
- `tsconfig.json` — TypeScripts regelbok (samma strikta regler som frontend).
- `src/index.ts` — backendens första kodfil (den som körs först).
- `.gitignore` — vad git ska ignorera (`node_modules`, `dist`, `.env`).

**Kommandon jag körde:**
```bash
npm install -D typescript tsx @types/node   # hämtar tre verktyg
npx tsx src/index.ts                          # kör backend en gång
npx tsc --noEmit                              # kontrollerar att koden är korrekt
```

**Vad det betyder:**
- `npm install` — hämtar verktyg från internet till mappen `node_modules`.
- `-D` — verktyg jag bygger MED (inte del av slutprodukten).
- `typescript` = språket, `tsx` = kör TS-filer direkt, `@types/node` = så TS förstår Node.
- `npx tsx src/index.ts` — startar backend; den skrev ut "ParishHub-backend lever!".

**Varför vi gör så:** varje backend behöver ett projekt (package.json) och regler (tsconfig)
innan man kan skriva riktig kod. Vi tar det i små steg så jag ser att varje del funkar innan
nästa. `.gitignore` skyddar hemligheter och håller git rent.

**Så vet jag att det funkade:**
- Terminalen skrev "ParishHub-backend lever!".
- `npx tsc --noEmit` sa "OK — inga typfel".

**Nya ord:** npm, package.json, node_modules, TypeScript, tsx, tsconfig, src, .gitignore
(se ordlistan).

---

## Steg B — Express: servern svarar 🧑‍🍳   (2026-08-12)

**Vad jag gjorde:** gjorde om backend till en riktig webbserver med Express. Nu kan den ta
emot en förfrågan och skicka tillbaka ett svar (servitören började jobba).

**Kommandon jag körde:**
```bash
npm install express        # servitören (del av slutprodukten)
npm install -D @types/express  # så TypeScript förstår Express
npx tsx src/index.ts       # startade servern
```

**Koden (src/index.ts) i korthet:**
```ts
import express from "express";      // hämtar in Express
const app = express();               // skapar servern
const PORT = 3000;                   // dörren servern lyssnar på
app.get("/", (_request, response) => {   // en route: startsidan "/"
  response.send("ParishHub API lever!"); // svaret som skickas tillbaka
});
app.listen(PORT, () => { ... });     // öppnar dörren och börjar lyssna
```

**Vad det betyder:**
- **route / endpoint** = en adress servern lyssnar på (`/` = startsidan).
- **request** = förfrågan (vad gästen vill). **response** = svaret servern skickar.
- **port** = en numrerad dörr; 3000 är vanligt vid utveckling.
- **app.listen** = starta servern så den börjar lyssna.
- Understreck i `_request` = parametern används inte än (TypeScript klagar annars).

**Varför vi gör så:** en backend måste kunna svara på förfrågningar för att frontend ska kunna
hämta data. Express gör det enkelt. Vi började med en enda route för att se att allt funkar,
innan vi lägger till fler (t.ex. `/members`) och kopplar databasen.

**Så vet jag att det funkade:**
- `npx tsc --noEmit` sa "OK — inga typfel".
- Servern skrev "Servern lyssnar på http://localhost:3000".
- Ett test mot adressen svarade "ParishHub API lever!".

**Nya ord:** Express, route, endpoint, request, response, port, app.listen (se ordlistan).

---

## Steg C — Prisma kopplas till databasen 🔌   (2026-08-12)

**Vad jag gjorde:** installerade Prisma (översättaren) och kopplade backend till den lokala
PostgreSQL-databasen. Nu kan köket nå skafferiet — men inga tabeller finns än (det är Steg D).

**Kommandon jag körde:**
```bash
npm install prisma -D          # verktyget (Prisma CLI)
npm install @prisma/client     # biblioteket backend använder för att hämta/spara data
npm install -D dotenv          # läser hemligheter från .env-filen
npx prisma init                # skapade prisma/schema.prisma + .env
echo "SELECT 1;" | npx prisma db execute --stdin   # testade kopplingen
```

**Filer som skapades:**
- `prisma/schema.prisma` — receptfilen där tabellerna beskrivs (fylls i Steg D).
- `prisma.config.ts` — säger var schemat finns och var databas-adressen hämtas.
- `.env` — hemlig fil med `DATABASE_URL` (ligger i `.gitignore`, aldrig i git).

**DATABASE_URL (adressen till databasen):**
```
postgresql://sima@localhost:5432/parishhub?schema=public
```
- `sima` = databas-användaren, `localhost:5432` = datorn + porten, `parishhub` = databasen.
- Inget lösenord behövs lokalt (vi satte upp trust-inloggning).

**Varför vi gör så:** backend måste veta VAR databasen finns och HUR den loggar in innan den
kan spara något. Prisma sköter översättningen kod↔SQL åt oss. Adressen ligger i `.env` så att
hemligheter aldrig hamnar på GitHub.

**Städning:** Prisma la in några AI-assistent-filer (`.windsurf/`, `.agents/`, `skills-lock.json`)
som projektet inte behöver — de togs bort direkt för att hålla repot rent.

**Så vet jag att det funkade:**
- `npx prisma db execute` svarade "Script executed successfully" → kopplingen till databasen fungerar.

**Nya ord:** Prisma, ORM, schema.prisma, prisma.config.ts, .env, DATABASE_URL, @prisma/client,
dotenv (se ordlistan).

---

## Steg D — Första tabellerna via Prisma (migration) 🏗️   (2026-08-19)

**Vad jag gjorde:** beskrev de två första tabellerna (Church + User) i Prisma-schemat och körde
en migration som byggde dem på riktigt i databasen `parishhub`. Designen från ER-diagrammet blev
verkliga tabeller.

**Koden (prisma/schema.prisma) i korthet:**
```prisma
model Church {
  id       String  @id @default(uuid())   // primärnyckel, auto-genererat id
  name     String
  slug     String  @unique                // får inte upprepas
  users    User[]                          // en kyrka har många users (1:N)
}

model User {
  id       String @id @default(uuid())
  email    String @unique
  churchId String
  church   Church @relation(fields: [churchId], references: [id])  // främmande nyckel
}
```

**Kommandot jag körde:**
```bash
npx prisma migrate dev --name init
```

**Vad det betyder:**
- **model** = beskrivning av en tabell.
- **@id / @default(uuid())** = primärnyckel som får ett unikt id automatiskt.
- **@unique** = värdet får inte upprepas (t.ex. e-post).
- **@relation + churchId** = främmande nyckel (kopplingen mellan User och Church).
- **migrate dev** = skapar en SQL-fil (byggjournalen) OCH bygger tabellerna i databasen.

**Bryggan (kurs ↔ projekt):** Prisma skapade filen `prisma/migrations/.../migration.sql` med
exakt den SQL jag lär mig för hand:
```sql
CREATE TABLE "Church" ( ..., CONSTRAINT "Church_pkey" PRIMARY KEY ("id") );
CREATE UNIQUE INDEX "Church_slug_key" ON "Church"("slug");
ALTER TABLE "User" ADD CONSTRAINT "User_churchId_fkey"
  FOREIGN KEY ("churchId") REFERENCES "Church"("id");
```
Jag skrev enkel Prisma-kod — Prisma skrev CREATE TABLE, PRIMARY KEY och FOREIGN KEY åt mig.

**Varför vi gör så:** Prisma äger den riktiga databasens struktur. Jag beskriver tabellerna en
gång i schemat, och migrationen bygger dem + sparar historiken. Att lägga till en tabell senare =
en ny migration, utan att förstöra det som finns.

**Så vet jag att det funkade:**
- Terminalen sa "Your database is now in sync with your schema".
- `psql -d parishhub -c "\dt"` visar tabellerna Church och User.
- Migration-filen innehåller CREATE TABLE + FOREIGN KEY.

**Nya ord:** model, migration (i praktiken), prisma migrate dev, relation/@relation (se ordlistan).

---

_(Nästa: Steg E — lägga till fler tabeller (members, families ...) via nya migrationer, och
så småningom koppla API + auth.)_

---
---

## 📖 Ordlista (fylls på allteftersom)

- **Tabell** — ett "ark" med rader (poster) och kolumner (fält).
- **Rad / post** — en sak, t.ex. en medlem.
- **Kolumn / fält** — en uppgift, t.ex. namn.
- **id** — unikt nummer per rad.
- **SQL** — språket databasen förstår.
- **Prisma** — översätter min kod till SQL.
- **Prisma-schema** — filen där jag beskriver tabellerna.
- **Migration** — instruktion som bygger/ändrar databasens struktur.
- **PostgreSQL** — själva databasen (skafferiet).
- **DBeaver** — program för att se databasen med ögonen (tabeller, rader).
- **Homebrew** — "app-affär" i terminalen för att installera utvecklarverktyg (Mac).
- **npm** — verktyget som hämtar och håller reda på Node-projektets verktyg (paket).
- **package.json** — projektets ID-kort: namn, versioner och vilka verktyg som behövs.
- **node_modules** — mappen där alla nedladdade verktyg hamnar (ska aldrig i git).
- **TypeScript** — JavaScript med typer, så fel fångas redan när jag skriver koden.
- **tsx** — verktyg som kör TypeScript-filer direkt utan att bygga först.
- **tsconfig.json** — TypeScripts regelbok för hur koden ska tolkas.
- **src** — mappen för källkod ("source").
- **.gitignore** — lista på filer git ska ignorera (hemligheter, verktygsfiler).
- **Express** — webbservern som tar emot och svarar på förfrågningar.
- **route / endpoint** — en adress servern lyssnar på (t.ex. `/` eller `/members`).
- **request** — förfrågan som kommer in (vad någon vill ha eller spara).
- **response** — svaret servern skickar tillbaka.
- **port** — en numrerad "dörr" där servern lyssnar (t.ex. 3000).
- **app.listen** — startar servern så den börjar lyssna efter förfrågningar.
- **Prisma** — översättaren mellan min kod och databasen (en ORM).
- **ORM** — verktyg som låter mig jobba med databasen via vanlig kod istället för SQL.
- **schema.prisma** — receptfilen där tabellerna beskrivs.
- **prisma.config.ts** — inställningsfil: var schemat finns + var databas-adressen hämtas.
- **.env** — hemlig fil för lösenord/adresser (ligger i .gitignore).
- **DATABASE_URL** — adressen + inloggningen till databasen.
- **@prisma/client** — kod-biblioteket backend använder för att hämta/spara data.
- **dotenv** — läser in värden från .env så koden kan använda dem.
- **model** — Prisma-beskrivning av en tabell (i schema.prisma).
- **@id / @default / @unique** — regler på ett fält (primärnyckel / standardvärde / unikt).
- **@relation** — kopplar två modeller med en främmande nyckel.
- **prisma migrate dev** — skapar en migration (SQL-fil) och bygger tabellerna i databasen.
- _(kommer snart: seed, API-endpoint, JWT, bcrypt, hashning, middleware …)_
