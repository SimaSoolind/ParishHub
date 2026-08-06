# Felsökningsguide — ParishHub

> **Syfte:** Fel du löst tidigare + lösningar.
> **Använd när:** du har samma fel som förut, letar snabb lösning.
> **Uppdatera:** varje gång du löser ett fel som tog mer än 15 minuter.

Vanliga fel och lösningar. Uppdateras varje gång ett fel tar mer än 15 min att lösa.

## 🔴 Fel: "Port 3000 upptagen"

**När:** Vid start av servern

**Orsak:** En annan process använder redan port 3000

**Lösning:**
```bash
# Alternativ 1: Starta på annan port
PORT=3001 npm run dev

# Alternativ 2: Hitta och stoppa processen på 3000
lsof -ti:3000 | xargs kill
```

---

## 🔴 Fel: "Cannot find module"

**När:** Efter att ha klonat repot eller efter npm install

**Orsak:** Beroenden saknas eller cache är trasig

**Lösning:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🔴 Fel: "CORS blocked"

**När:** Klienten anropar servern

**Orsak:** Servern tillåter inte anrop från klientens URL

**Lösning:**
Kontrollera att `FRONTEND_URL` i `server/.env` matchar klientens URL (t.ex. `http://localhost:5173`).

---

## 🔴 Fel: "Cannot connect to database"

**När:** Vid start av servern

**Orsak:** Fel i DATABASE_URL eller Railway är nere

**Lösning:**
1. Kontrollera DATABASE_URL i `server/.env`
2. Testa Railway-anslutning i dashboarden
3. Kontrollera att IP är godkänd (om restriktioner finns)

---

## 🔴 Fel: "TypeScript-fel: Type X is not assignable to Y"

**När:** Vid kodning

**Orsak:** TypeScript-typen matchar inte

**Lösning:**
1. Läs felmeddelandet — det säger EXAKT vad som är fel
2. Kolla att typen i `src/types/` matchar det som skickas
3. Undvik `any` — bättre att fixa typen ordentligt

---

## 🔴 Fel: JSX-tagg utan stängning (`<a>` fungerar inte)

**När:** Vid rendering av länkar eller ikoner i JSX

**Orsak:** En JSX-tagg måste ha BÅDE öppningstagg (`<a>`) och stängningstagg (`</a>`). Vite/OXC ger otydliga fel om ena saknas.

**Lösning:**
1. Öppna filen med felet
2. Sök efter alla `<a `-taggar och räkna att det finns lika många `</a>`
3. Regel att komma ihåg: självstängande taggar (`<img />`, `<br />`) fungerar bara för element utan barn

---

## 🔴 Fel: `tsc --noEmit` säger OK men koden har typfel

**När:** Vid typkontroll från roten av projektet

**Orsak:** Fel `tsconfig`-fil används. `tsc --noEmit` utan flagga plockar upp rotens config, inte klientens.

**Lösning:**
```bash
cd client
npx tsc -p tsconfig.app.json --noEmit
```

Alltid kör typkontroll med explicit config-fil.

---

## 🔴 Fel: "This is not allowed as an import"

**När:** Vid import av TypeScript-typer

**Orsak:** `verbatimModuleSyntax` är på i `tsconfig.app.json`. Typer måste importeras med `import type`.

**Lösning:**

Före:
```ts
import { Member } from "../domain/member"
```

Efter:
```ts
import type { Member } from "../domain/member"
```

Regel: värden = `import`, typer = `import type`.

---

## 🔴 Fel: TS4111 — "Property comes from an index signature"

**När:** Efter aktivering av `noPropertyAccessFromIndexSignature`

**Orsak:** Egenskaper från index-signaturer (t.ex. Zod-formdata, `Record<string, T>`) kan inte nås med punkt-notation.

**Lösning:**

Före:
```ts
const name = formData.name  // TS4111
```

Efter:
```ts
const name = formData['name']  // OK
```

Regel: när flaggan är på — använd `['key']` för alla index-baserade objekt.

---

## 🔴 Fel: react-big-calendar typfel med `exactOptionalPropertyTypes`

**När:** I `Calendar.tsx` när `onSelectEvent` typas mot en modal-typ med valfria fält

**Orsak:** `CalendarEvent.notes` är `string | undefined` men modal-typen kräver `string`. Med `exactOptionalPropertyTypes` accepterar TypeScript inte att `undefined` skickas till en `T`-typ.

**Lösning:**
1. Uppdatera modal-typen så valfria fält deklareras som `notes?: string | undefined`
2. Eller: säkerställ att `notes` alltid har ett värde innan modalen öppnas (`event.notes ?? ""`)

---

## 🔴 Fel: Template literals med svenska tecken kraschar Vite

**När:** Vid användning av å, ä, ö i template literals inuti komplex JSX

**Orsak:** OXC-parsern i Vite hanterar inte alla svenska tecken i alla lägen.

**Lösning:**
Använd strängkonkatenering istället:

Före:
```tsx
aria-label={`Ring ${person.name}`}
```

Efter:
```tsx
aria-label={"Ring " + person.name}
```