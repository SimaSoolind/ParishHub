# ParishHub — Parallell-plan med Databaskursen

Sima | 2026-08-11

**Mål:** för varje föreläsning i databaskursen bygger du motsvarande del av ParishHub-backend. Efter kurs = backend redo för LIA-demo.

**Regel:** en föreläsning i taget. Läs föreläsningen FÖRST, bygg efteråt.

---

## SÅ HÄR JOBBAR DU — "lär för hand, bygg med Prisma"

Kursen och projektet hänger ihop men hålls isär, så inget blir rörigt:

| | Lektions-övningar | ParishHub (projektet) |
|---|---|---|
| Var | mappen `databaskurs/` (granne till ParishHub) | detta repo |
| Hur | handskriven SQL (kladdpapper) | Prisma |
| Databas | `parishhub_ovning` | `parishhub` |
| Syfte | LÄRA (för tentan) | TILLÄMPA (bygga på riktigt) |

**Bryggan mellan dem:** när Prisma kört en migration skapas en `.sql`-fil i
`prisma/migrations/`. Öppna och läs den — det är exakt samma SQL som lärs ut för hand.
Så möts teori (kurs) och praktik (projekt).

**Varför så här:** om både handskriven SQL och Prisma styr SAMMA databas krockar de. Därför
övas schema-SQL (CREATE TABLE, triggers, GRANT) i `parishhub_ovning`, medan riktiga ParishHub
byggs med Prisma. Ren SELECT/JOIN kan köras mot båda utan risk.

---

## FÖRUTSÄTTNINGAR — KLART (2026-08-12)

Allt detta är på plats:

- [x] Node.js installerat (v24)
- [x] PostgreSQL 16 installerat (via Homebrew)
- [x] DBeaver installerat
- [x] Databas `parishhub` skapad (+ `parishhub_ovning` för kurs-labbar)
- [ ] VS Code-tillägg "PostgreSQL"/"SQLTools" — VALFRITT (DBeaver räcker; installera bara
      om läraren kör övningar i VS Code)

Detaljerad, pedagogisk genomgång finns i `docs/BACKEND-GRUNDER.md`.

---

## VECKA 1 — Föreläsning 1 (grunder)

### Vad du LÄR dig
Databas vs DBMS, PK/FK, ACID, autentisering vs auktorisering.

### Vad du BYGGER i ParishHub — KLART (Steg A–C, 2026-08-12)

Arbetsmiljön är uppsatt (gjordes med nyare verktyg än planen först sa):

- [x] Mapp `server/` skapad
- [x] `package.json` + `tsconfig.json` (strikt läge)
- [x] Verktyg: TypeScript + `tsx` (istället för nodemon/ts-node) + Express
- [x] Prisma installerat och kopplat till databasen `parishhub`
- [x] `.env` med `DATABASE_URL` (ligger i `.gitignore`)
- [ ] `.env.example` med tomma värden — kvar att skapa (liten sak)

Varje steg är dokumenterat pedagogiskt i `docs/BACKEND-GRUNDER.md` (Del 2, Steg A–C).

**Reflektionsuppgift (skriv i DAGBOK):**
- Vad är skillnaden databas och DBMS med DINA ord?
- Vilken DBMS använder du (PostgreSQL) och varför?

**Klar när:** `.env` finns, `server/`-mapp har `package.json` + tsconfig.

---

## VECKA 2 — Föreläsning 2 (design + SQL)

### Vad du LÄR dig
ER-modell, kardinalitet, normalisering, CREATE TABLE, INSERT, constraints.

### Vad du BYGGER (3 h)

**Uppgift:** skapa dina första ParishHub-tabeller.

> 🔀 **Två spår denna vecka (viktigt):**
> - **Kurs-spåret** (öva CREATE TABLE för hand): görs i `parishhub_ovning`
>   (mappen `databaskurs/F2-design-sql/`). Här får det vara stökigt.
> - **Projekt-spåret** (riktiga ParishHub): samma tabeller byggs med Prisma i Steg D — öppna
>   sedan migration-`.sql`-filen och se att Prisma skrev exakt samma SQL.
>
> Två fällor i handskriven SQL som Prisma sköter åt dig: oquoterade namn som `churchId` blir
> gemener (`churchid`) i Postgres, och `updatedAt` måste finnas i tabellen om triggern (V4) ska
> uppdatera den.

**Steg 1: Rita ER-diagram på papper (30 min)**
- Churches, Families, Members, Users
- Kardinalitet mellan dem

**Steg 2: Skapa tabellerna i DBeaver (1 h)**

Kopiera SQL:n från `forelasning-2.docx` DEL 4.2:

```sql
CREATE TABLE Churches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    timezone VARCHAR(50) DEFAULT 'Europe/Stockholm',
    createdAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    churchId UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    FOREIGN KEY (churchId) REFERENCES Churches(id)
);

CREATE TABLE Members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    churchId UUID NOT NULL,
    familyId UUID,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    birthDate DATE,
    language VARCHAR(10) DEFAULT 'sv' CHECK (language IN ('sv', 'ar', 'en')),
    status VARCHAR(20) DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT NOW(),
    deletedAt TIMESTAMP,
    FOREIGN KEY (churchId) REFERENCES Churches(id),
    FOREIGN KEY (familyId) REFERENCES Families(id)
);
```

**Steg 3: Lägg in testdata (30 min)**

Lägg in 1 kyrka + 2 familjer + 5 medlemmar.

**Steg 4: Testa SELECT (30 min)**
```sql
SELECT * FROM Members;
SELECT firstName, lastName, email FROM Members WHERE churchId = '...';
```

**Steg 5: Uppdatera DAGBOK (30 min)**
- Vilka tabeller finns nu?
- Vilka fält gick jag miste om?

**Klar när:** 3 tabeller finns, testdata inne, SELECT funkar.

---

## VECKA 3 — Föreläsning 3 (JOIN + subquery)

### Vad du LÄR dig
INNER/LEFT/RIGHT JOIN, subqueries, GROUP BY, HAVING, aggregeringsfunktioner.

### Vad du BYGGER (2 h)

**Uppgift:** skriv riktiga queries mot ParishHub-datan.

**Query 1: Alla medlemmar med deras familjenamn (INNER JOIN)**
```sql
SELECT
    m.firstName,
    m.lastName,
    f.name AS familyName
FROM Members m
INNER JOIN Families f ON m.familyId = f.id;
```

**Query 2: Alla medlemmar (även utan familj) (LEFT JOIN)**
```sql
SELECT
    m.firstName,
    m.lastName,
    COALESCE(f.name, 'Ingen familj') AS familyName
FROM Members m
LEFT JOIN Families f ON m.familyId = f.id;
```

**Query 3: Antal medlemmar per familj (GROUP BY)**
```sql
SELECT
    f.name AS familyName,
    COUNT(m.id) AS antalMedlemmar
FROM Families f
LEFT JOIN Members m ON f.id = m.familyId
GROUP BY f.name;
```

**Query 4: Familjer med fler än 3 medlemmar (HAVING)**
```sql
SELECT
    f.name AS familyName,
    COUNT(m.id) AS antalMedlemmar
FROM Families f
LEFT JOIN Members m ON f.id = m.familyId
GROUP BY f.name
HAVING COUNT(m.id) > 3;
```

**Klar när:** alla 4 queries returnerar rätt resultat.

---

## VECKA 4 — Föreläsning 4 (index + procedures + triggers)

### Vad du LÄR dig
Index, EXPLAIN, stored procedures, functions, triggers.

### Vad du BYGGER (2 h)

**Uppgift 1: Lägg till index på churchId** (viktig för multi-tenant!)

```sql
CREATE INDEX idx_members_church ON Members(churchId);
CREATE INDEX idx_families_church ON Families(churchId);
CREATE INDEX idx_members_email ON Members(email);
```

**Uppgift 2: Kontrollera att indexet används**
```sql
EXPLAIN ANALYZE
SELECT * FROM Members WHERE churchId = '<en-uuid-här>';
```
Titta i resultatet: står "Index Scan"? Bra. Om "Seq Scan" — index används inte.

**Uppgift 3: Skapa trigger som auto-uppdaterar `updatedAt`**
```sql
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER members_update_timestamp
BEFORE UPDATE ON Members
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

Testa: uppdatera en medlem → `updatedAt` ska ändras automatiskt.

**Klar när:** 3 index finns, trigger fungerar.

---

## VECKA 5 — Föreläsning 5 (transaktioner + ACID)

### Vad du LÄR dig
BEGIN/COMMIT/ROLLBACK, isolation levels, deadlocks, savepoints.

### Vad du BYGGER (3 h)

**Uppgift:** skapa transaktion "skapa medlem + koppla till familj samtidigt"

```sql
BEGIN;

-- Steg 1: skapa familj (om ej finns)
INSERT INTO Families (churchId, name)
VALUES ('<church-uuid>', 'Familjen Karlsson')
RETURNING id;
-- Kopiera det returnerade id:t

-- Steg 2: skapa medlem
INSERT INTO Members (churchId, familyId, firstName, lastName, email)
VALUES (
    '<church-uuid>',
    '<family-uuid-från-steg-1>',
    'Sofia',
    'Karlsson',
    'sofia@example.com'
);

-- Om något gick fel: ROLLBACK
-- Om allt gick bra:
COMMIT;
```

**Testa ROLLBACK också:**
```sql
BEGIN;
INSERT INTO Members (churchId, firstName, lastName)
VALUES ('<church-uuid>', 'Test', 'Person');

-- Kolla att den finns
SELECT * FROM Members WHERE firstName = 'Test';

-- Ångra
ROLLBACK;

-- Kolla igen — ska INTE finnas
SELECT * FROM Members WHERE firstName = 'Test';
```

**Uppgift 2: GDPR-radering-transaktion**

När en medlem vill bli borttagen (right to be forgotten):

```sql
BEGIN;

-- 1. Anonymisera medlemmen (soft-delete)
UPDATE Members
SET
    firstName = 'Raderad',
    lastName = 'Medlem',
    email = NULL,
    phone = NULL,
    deletedAt = NOW()
WHERE id = '<member-uuid>';

-- 2. Radera personliga anteckningar (om det finns)
-- DELETE FROM ContactLogs WHERE memberId = '<member-uuid>';

COMMIT;
```

**Klar när:** du förstår varför transaktioner behövs för multi-step-operationer.

---

## VECKA 6 — Föreläsning 6 (säkerhet)

### Vad du LÄR dig
Autentisering, GRANT/REVOKE, SQL-injektion, bcrypt, kryptering, backup.

### Vad du BYGGER (4 h — större vecka)

**Uppgift 1: Skapa Users-tabell med bcrypt-lösenord**

```sql
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'PRIEST', 'DEACON', 'VOLUNTEER')),
    churchId UUID NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (churchId) REFERENCES Churches(id)
);
```

**Uppgift 2: Installera bcrypt i backend**
```bash
cd server
npm install bcrypt
npm install -D @types/bcrypt
```

**Uppgift 3: Skapa en registrera-funktion (TypeScript)**
```typescript
import bcrypt from 'bcrypt';

async function registerUser(email: string, password: string, name: string, churchId: string) {
    // Hasha lösenord
    const passwordHash = await bcrypt.hash(password, 12);

    // INSERT (parametriserad — INGEN string concatenation!)
    await db.query(
        `INSERT INTO Users (email, passwordHash, name, role, churchId)
         VALUES ($1, $2, $3, $4, $5)`,
        [email, passwordHash, name, 'PRIEST', churchId]
    );
}
```

**Uppgift 4: Skapa användare med olika roller + GRANT**

```sql
-- I PostgreSQL (superuser-läge):
CREATE USER parishhub_admin WITH PASSWORD 'säker_lösen';
CREATE USER parishhub_app WITH PASSWORD 'annan_säker';

-- Admin får allt
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO parishhub_admin;

-- App får bara SELECT/INSERT/UPDATE (INTE DROP!)
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO parishhub_app;
```

**Uppgift 5: Aktivera pgcrypto för att kunna kryptera predikan senare**
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

**Klar när:** Users-tabell finns, bcrypt fungerar, GRANT-rättigheter satta.

---

## VECKA 7 — Föreläsning 7 (NoSQL + MongoDB)

### Vad du LÄR dig
NoSQL, CAP-teoremet, MongoDB, dokumentdatabaser.

### Vad du BYGGER (2 h)

**Uppgift:** börja Fas 3 i din masterplan — MongoDB Atlas för Bibel-appen.

- [ ] Skapa gratis MongoDB Atlas-konto (mongodb.com/atlas)
- [ ] Skapa M0 cluster i eu-north-1 (Stockholm)
- [ ] Whitelista IP-adress
- [ ] Skapa databas-användare
- [ ] Kopiera connection string till `.env`

**För Bibel-appen (senare):**
```javascript
import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    verse: {
        book: String,
        chapter: Number,
        verse: Number,
        text: String
    },
    note: String,
    createdAt: { type: Date, default: Date.now }
});

export const Favorite = mongoose.model('Favorite', FavoriteSchema);
```

**Klar när:** MongoDB Atlas-konto skapat + connection string i .env.

**Notera:** ParishHub-backend fortsätter med PostgreSQL. MongoDB är för Bibel-appen (och ev. predikan-transkript i ParishHub v2).

---

## VECKA 8 — Föreläsning 8 (cloud + skalning)

### Vad du LÄR dig
Cloud databases, DBaaS, replikering, sharding, microservices.

### Vad du BYGGER (3 h)

**Uppgift:** migrera lokal ParishHub-DB till Railway.

- [ ] Skapa Railway-konto (railway.app)
- [ ] Skapa nytt projekt: "parishhub-server"
- [ ] Lägg till PostgreSQL-tjänst (klick → "Add Database" → PostgreSQL)
- [ ] Kopiera `DATABASE_URL` från Railway → uppdatera din `.env`
- [ ] Kör dina CREATE TABLE-skript mot Railway-databasen
- [ ] Lägg in samma testdata

**Deploy backend (senare):**
- [ ] Koppla GitHub-repo till Railway
- [ ] Push till main → auto-deploy

**Klar när:** Railway-databasen har samma struktur och testdata som din lokala.

---

## EFTER KURSEN — vad du har byggt

Efter 8 veckor har du:

- ✅ PostgreSQL-databas med 5+ tabeller (Churches, Families, Members, Users, indexes, triggers)
- ✅ Bcrypt för lösenordshashning
- ✅ GRANT-rättigheter satta
- ✅ MongoDB Atlas-konto (för Bibel-appen)
- ✅ Railway-hostad databas
- ✅ Grunden för hela ParishHub-backend

**Nästa steg:** bygg själva Express-serverkoden ovanpå (endpoints, auth, WebSocket för AI-tolkning).

---

## VIKTIGA REGLER

**1. Läs föreläsningen FÖRST**
Bygg inte innan du läst — du gissar och fastnar.

**2. Skriv i DAGBOK varje vecka**
Vad byggde du? Vad var svårt? Vilken tenta-fråga känner du dig osäker på?

**3. Committa varje vecka**
Push till GitHub så du har historik.

**4. Om du fastnar > 30 min — fråga mig**
Säg "Sima här, jag fastnar på V4-uppgift 3" så hjälper jag.

**5. Ta pauser**
1-2 timmar per vecka räcker. Bygg inte 4 timmar i sträck — hjärnan orkar inte.

**6. Läs Prismas migration-.sql varje gång**
Efter en Prisma-migration: öppna `.sql`-filen i `prisma/migrations/` och läs. Det är bryggan
mellan kursen (SQL för hand) och projektet (Prisma).

**7. Håll dig synkad — planen är chefen**
Denna plan är enda sanningen. Ändras något → ändra HÄR, inte bara i huvudet. Ställ plan- och
backend-frågor i ParishHub-projektet (där finns minnet + alla docs), så svaren aldrig spretar.

---

## TIDTABELL — TOTAL TID

- Vecka 1: 2h
- Vecka 2: 3h
- Vecka 3: 2h
- Vecka 4: 2h
- Vecka 5: 3h
- Vecka 6: 4h
- Vecka 7: 2h
- Vecka 8: 3h

**Total: ~21 timmar över 8 veckor.**

Detta räcker för att ha en riktig backend-grund efter kursen.

---

## OM DU MISSAR EN VECKA

- **Missar en vecka:** ingen panik. Ta igen nästa söndag.
- **Missar två veckor:** hoppa över den svåraste (vecka 6 t.ex.), ta igen sen.
- **Missar mer:** säg till mig, så anpassar vi planen.

**Regel:** progression > perfektion. Att bygga LITE varje vecka är bättre än att bygga MYCKET en gång.

Lycka till, Sima.
