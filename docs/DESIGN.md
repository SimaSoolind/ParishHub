# 🎨 Design & designsystem — ParishHub

Designplan för Kyrko-appen: färger, typografi, komponenter och alla skärmar.
Temat heter **"Varm Olivsten"** med kopparaccent.

> **Körbar prototyp:** starta appen (`npm run dev`) och öppna **/design**
> (t.ex. http://localhost:5173/design). Där kan du klicka runt i hela
> designsystemet på svenska + arabiska och växla ljust/mörkt läge.
> Prototypen ligger i `client/src/design/DesignPreview.tsx`.
>
> Not: prototypen använder inline-styles som referens. Riktiga sidor byggs
> med Tailwind CSS enligt CLAUDE.md.

---

## 1. Färgpalett — "Varm Olivsten"

Tabellen nedan är **prototypens** referens-palett (CSS-variabler, ett värde för ljust
och ett för mörkt). Den **riktiga appen** implementerar färgerna med Tailwind — se **1b**.
Accenten är **koppar**.

| Token | Ljust | Mörkt | Används till |
|-------|-------|-------|--------------|
| `--bg` | `#F5F3EE` | `#181B16` | Bakgrund |
| `--surface` | `#FFFFFF` | `#222520` | Kort och ytor |
| `--surface-alt` | `#EEECEA` | `#2A2E27` | Sekundär yta (fält) |
| `--border` | `#DDD9D0` | `#363A2E` | Kanter |
| `--accent` ★ | `#8B5E3C` | `#C4956A` | **Koppar** — accent, rubriker, knappar |
| `--accent-hover` | `#A8743A` | `#D4A97E` | Hover på accent |
| `--text` | `#1A1C18` | `#EAE7DE` | Brödtext |
| `--text-muted` | `#6B6E60` | `#8E9180` | Sekundär text |
| `--green` | `#3D6B3B` | `#5E8A5C` | Närvarande / positivt |
| `--red` | `#8B3A3A` | `#A05858` | Frånvarande / fara |
| `--blue` | `#3A5E8B` | `#5A7EA0` | Info |
| `--purple` | `#5A4A7A` | `#7A6A9A` | AI / krypterat |
| `--pink` | `#7A4060` | `#9A6080` | Födelsedagar |

**Mönster för genomskinlighet:** färg + `22` (bakgrund), `33`/`44` (kant) som hex-alpha,
t.ex. `background: var(--green)22`.

---

### 1b. Riktig implementation i appen (Tailwind) — synkad 4 aug 2026

Prototypens tokens ovan är **referens för den avsedda paletten**. Den **riktiga appen**
använder Tailwind CSS med semantiska klasser samlade i `client/src/index.css` (DRY).
Färgerna uttrycks som Tailwind-klasser, inte som CSS-variabler.

- **Neutraler:** Tailwind `stone` (bakgrund `stone-100`/`stone-900`, ytor `white`/`stone-800`)
- **Accent (koppar):** `amber` — `amber-800` (ljus) / `amber-500` (mörk)
- **Status:** `red`, `green`, `blue`, `amber`
- **Extra:** `pink`/`purple` för avatarer och event-kategorier (dop/bröllop) — inte statusar

Semantiska klasser i `index.css`:

| Klass | Ljust | Mörkt | Används till |
|-------|-------|-------|--------------|
| `.text-strong` | stone-800 | stone-100 | Rubriker, stark text |
| `.text-soft` | stone-600 | stone-300 | Brödtext, sekundär text |
| `.text-faint` | `#726a60` | stone-400 | Dämpad text (datum, undertext) |
| `.text-accent` | amber-800 | amber-500 | Koppar-accent (ikoner, aktiva rubriker) |
| `.surface` | white + stone-200-kant | stone-800 + stone-700-kant | Kort, paneler, header |

**Mörkt läge:** Tailwinds `dark:`-varianter via `data-theme="dark"` på `<html>` (egen
`@custom-variant`), inte CSS-variabler.

**WCAG-kontrast (verifierad):** `.text-faint` mörkades till `#726a60` för att klara 4.5:1 på
både vita kort och beige sida. Status-badges använder mörk text på ljus botten i ljust läge
(`text-800` på `bg-100`) och ljus text på mörk botten i mörkt läge (`text-300` på `bg-950`) —
båda klarar WCAG AA. Prototypens mörkt-läges-röd (#A05858, underkänd) används INTE i appen.

---

## 2. Typografi

| Typsnitt | Vikt | Används till |
|----------|------|--------------|
| **Cormorant Garamond** | 600, 700 | Rubriker och hälsningar |
| **Inter** | 300–600 | Svensk brödtext |
| **Cairo** | 400, 600, 700 | Arabisk text (RTL) |
| **JetBrains Mono** | 400 | Siffror, telefonnummer, datum, tokens |

Typsnitt laddas från Google Fonts. Textfonten byts automatiskt till Cairo när
språket är arabiska.

---

## 3. Komponenter

Återanvändbara byggdelar (i prototypen; motsvarande byggs med Tailwind).

| Komponent | Props | Beskrivning |
|-----------|-------|-------------|
| **Badge** | `color`, `children` | Liten färgad statusetikett |
| **Btn** | `variant`, `size`, `onClick` | Knapp — variant: primary / secondary / ghost / danger / green; storlek: sm / md / lg |
| **Card** | `children`, `style` | Vitt kort med kant och skugga |
| **Avatar** | `name`, `size`, `status` | Cirkel med initial + status-prick (aktiv/borta) |
| **StatCard** | `label`, `value`, `color`, `icon` | Färgat statistikkort |
| **Section** | `title`, `children` | Rubrik + innehåll med understruken titel |
| **LangSwitcher** | `lang`, `setLang` | Växlar mellan svenska och arabiska (byter även textriktning) |

---

## 4. Skärmar (roadmap)

Prototypen visar **11 flikar** — designdelar samt appens sidor. Status visar
vad som är byggt i den riktiga appen.

| # | Skärm | Status | Innehåll |
|---|-------|--------|----------|
| 0 | Färger | 🎨 design | Färgpalett-referens |
| 1 | Typografi | 🎨 design | Typsnitt-referens |
| 2 | Komponenter | 🎨 design | Knappar, badges, language switcher |
| 3 | **Dashboard** | ✅ byggd | Hälsning, statistik, födelsedagar, kontaktlista |
| 4 | **Medlemmar** | ✅ byggd | Sök + filter, medlemslista |
| 5 | **Gudstjänst** | ✅ byggd | Skapa gudstjänst, närvaro-avprickning, frånvaro-orsak, kontaktstatus |
| 6 | Kommunikation | 🔜 planerad | SMS, gruppmeddelande, mallar, mottagare |
| 7 | Planering | 🔜 planerad | Gudstjänstplanering med sektioner och roller (präst/diakon) |
| 8 | Predikan | 🔜 planerad | Predikanarkiv, AI-transkription, redigering, YouTube-länk |
| 9 | Skärm-vy | 🔜 planerad | Projektor-vy för OBS Studio, live-text på sv + ar |
| 10 | **Kalender** | ✅ byggd | Koptiska högtider/fastor + kommande händelser |

AI-tolkningen (skärm 5 och 9) beskrivs tekniskt i
[AI-TOLKNING-RAPPORT.md](./AI-TOLKNING-RAPPORT.md).

---

## 5. Flerspråkighet och RTL

- Appen ska stödja **svenska + arabiska** (se i18n-plan).
- Arabiska kräver **RTL** (höger-till-vänster): `dir="rtl"` och Cairo-font.
- Prototypen visar hur språkbyte vänder hela layouten och byter typsnitt direkt.

---

## 6. Ljust och mörkt läge

- Styrs via `data-theme="dark"` på rot-elementet (`<html>`).
- Riktiga appen: Tailwinds `dark:`-varianter (egen `@custom-variant`) — inte CSS-variabler.
- Prototypen: byter tokens; standardläge mörkt.

---

## 7. Namn och roller

- Prästen heter **Fader Korollos** (koptisk-ortodox präst).
- Roller i planeringen: **präst** (kopparfärgad) och **diakon** (blå).

---

## 8. Bakgrundsbild-anpassning per kyrka (SaaS multi-tenant)

Projektor- och YouTube-vyer får en anpassningsbar bakgrundsbild som
konfigureras per församling. Detta är en SaaS multi-tenant-funktion —
varje kyrka har sin egen "kyrko-profil" med bakgrund + logo + färgtema.

### Bas-standarder (Simas team levererar)

Färdiga bakgrunder per kyrko-tradition — 10–15 st per stil:

- **Koptisk stil** — ikoner, koptiska mönster, öken-toner
- **Grekisk stil** — bysantinska ikoner, blå-vita mönster
- **Rysk stil** — löktorn-siluetter, guld-röda toner
- **Syriansk stil** — geometriska mönster, jord-toner

### Kyrko-upload

Varje församling kan ladda upp egen bakgrund via admin-UI:

- Foto på egen kyrka
- Egen ikon eller helgonbild
- Församlingens logo

### Overlay + läsbarhet

- **Semi-transparent mörk overlay:** `rgba(0, 0, 0, 0.4)` läggs på automatiskt
- **Textskugga:** `text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8)` på transkriptioner
- **Auto-validering vid upload:** varning om bilden är för ljus (medelluminans > 0.6)

### Storleks-krav

- Minst 1920×1080 (Full HD) för moderna projektorer
- Rekommenderat 3840×2160 (4K)
- Max filstorlek 2 MB efter komprimering

### Liturgiska säsonger

Automatiskt byte av bakgrund per kyrkoår:

- **Vardag** — mörk olivsten (nuvarande standardtema)
- **Fasta** — mörk violett (kopplas till fasta-högtider i koptisk kalender)
- **Jul** — varm gyllene (advent + jul)
- **Påsk** — ljus vit (påsk-veckan)

Församlingen kan välja mellan automatisk säsong eller manuellt fast tema.

### Konfiguration

Sparas i församlingens `parish_profile`-tabell (multi-tenant-design).
Varje kyrka har egen konfiguration utan att påverka andra församlingar.
