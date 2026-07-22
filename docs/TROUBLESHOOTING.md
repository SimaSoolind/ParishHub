# Felsökningsguide — ParishHub

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