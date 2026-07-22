# ParishHub

Digitalt system för kyrkoförvaltning. Byggs som examensprojekt av Sima Soolind.

## 📖 Om projektet
Full-stack applikation som hjälper en präst att hantera sin församling.
Innehåller medlemsregister, gudstjänstplanering, närvaro, predikanarkiv och
AI-tolkning live på svenska + arabiska.

## 🗂 Monorepo-struktur
- `client/` — Frontend (React + Vite + TypeScript)
- `server/` — Backend (Node.js + Express + TypeScript)
- `docs/` — Dokumentation för hela projektet
- `.claude/` — Claude-inställningar

## 🛠 Teknisk stack

### Frontend (client/)
- React + Vite + TypeScript
- React Router — navigation
- Tailwind CSS eller styled — styling
- react-i18next — svenska + arabiska
- @tanstack/react-query — API-caching

### Backend (server/)
- Node.js + Express + TypeScript
- PostgreSQL via Prisma ORM
- JWT + bcrypt — säker inloggning
- Deepgram — live speech-to-text
- OpenAI GPT-4o-mini — arabisk→svensk översättning

### Hosting
- Frontend: Vercel
- Backend + Databas: Railway

## 📐 Kodregler
- Skriv ALL kod i TypeScript — inga .js eller .jsx
- Använd `import`/`export` — inte `require`
- Funktionella komponenter i React — aldrig class components
- PascalCase för komponenter och typer (MemberList.tsx, Member)
- camelCase för filer, funktioner och variabler (memberService.ts, getMembers)
## 🧼 Ren kod — läsbarhet
- Kod ska vara **lätt att läsa** — även för en nybörjare
- **Ingen kod-upprepning (DRY)** — samma logik ska bara finnas på ETT ställe
- Om samma kod skrivs 2 gånger → bryt ut till en funktion
- Om samma UI upprepas → bryt ut till en komponent
- Korta funktioner (max ~30 rader) — om längre, dela upp
- Meningsfulla variabelnamn på svenska ELLER engelska — inte "data", "temp", "x"

## ⚛️ React — separera logik från JSX
- **Logik** (state, useEffect, API-anrop) hör hemma i **custom hooks**
- **JSX** (return-blocket) ska bara visa data — inte beräkna
- Om en komponent har mer än ~5 rader logik → flytta till en hook

### RÄTT
function MemberList() {
  const { members, loading, error } = useMembers();  // logik i hook

  if (loading) return <p>Laddar...</p>;
  return <ul>{members.map(m => <li key={m.id}>{m.name}</li>)}</ul>;
}

### FEL
function MemberList() {
  const [members, setMembers] = useState([]);
  useEffect(() => { fetch(...).then(...).catch(...) }, []);
  const filtered = members.filter(...).map(...).sort(...);
  return <ul>{filtered.map(m => <li>{m.name}</li>)}</ul>;
}

## ✍️ Kommentarsstil — inga konstiga tecken
- Skriv ren kommentar med `//` eller `/** */`
- **INGA** dekorativa tecken runt kommentarer
- **INGA** AI-tecken eller emoji-ramar i kommentarer

### RÄTT
// Hämtar alla medlemmar från databasen
/**
 * Beräknar närvaro-procent för en specifik gudstjänst.
 * @param serviceId - ID för gudstjänsten
 * @returns Närvaro i procent (0-100)
 */

### FEL
// ═══════════════════════════════════════
// 🌟✨ HÄMTA MEDLEMMAR ✨🌟
// ═══════════════════════════════════════

// ★★★★★ VIKTIG FUNKTION ★★★★★

// ──────────────────────────
// | Beräkna närvaro         |
// ──────────────────────────

## 🤖 Ingen AI-syntax
- Inga överdrivna kommentarer som förklarar det uppenbara
- Inga onödigt långa variabelnamn ("theMemberThatIsCurrentlyBeingViewed")
- Ingen dubbel-kommentering (samma sak sagd två gånger)
- Kod ska se ut som att en **människa** skrev den

### FEL (AI-syntax)
// Denna funktion tar emot ett id och returnerar en medlem
// baserat på id:t som skickas in som argument
// Om ingen medlem hittas returneras null istället
function getMemberByIdFromDatabase(idOfMemberToRetrieve: string) {
  // Vi använder findById för att söka på id
  // findById är en metod på MemberModel
  return MemberModel.findById(idOfMemberToRetrieve);
}

### RÄTT (mänsklig kod)
// Hämtar en medlem med hjälp av ID
function getMemberById(id: string) {
  return MemberModel.findById(id);
}

## 💬 Kommentarsregler (VIKTIGT för långsiktighet)
- Skriv ALLA kommentarer på **lätt svenska** och **studentspråk**
- Använd **objektivt språk** — undvik "du", "vi", "man", "jag"
- Skriv som en lärobok: neutralt, tydligt, kort
- Varje funktion ska ha en kommentar som beskriver:
  1. Vad funktionen gör (i en mening)
  2. Vilka argument den tar
  3. Vad den returnerar

### RÄTT och FEL

❌ FEL:
// Vi hämtar en medlem från databasen
// Du kan använda denna i frontend

✅ RÄTT:
// Hämtar en medlem från databasen med hjälp av ID
// Returnerar Member-objekt eller null om medlemmen saknas

## 🎨 Design (från kyrkoapp-presentation.jsx)
- Färgtema: "Varm Olivsten"
- Accent: koppar (#8B5E3C ljus / #C4956A mörk)
- Typsnitt rubriker: Cormorant Garamond
- Typsnitt text: Inter (svenska), Cairo (arabiska)
- Typsnitt siffror/kod: JetBrains Mono
- Stöd för ljust + mörkt läge
- RTL-stöd för arabiska

## 🔒 Säkerhet
- API-nycklar ALDRIG i koden — bara i .env på servern
- .env får ALDRIG committas
- Frontend får ALDRIG se Deepgram- eller OpenAI-nycklar
- Ingen `dangerouslyAllowBrowser: true`
- Validera all input från requests med Zod
- Använd helmet, cors och express-rate-limit i produktion

## 🤝 Så hjälps mig, Claude
- Svara alltid på svenska
- Förklara VAD, VARFÖR och HUR
- En sak i taget
- Fråga innan stora ändringar
- Lägg alltid till kommentarer på svenska i koden
- Följ kommentarsreglerna ovan (objektivt språk)
- Kom ihåg: Sima har ADHD och dyslexi — korta stycken, tydlig struktur