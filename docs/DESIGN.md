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

Färger definieras som CSS-variabler (tokens) med ett värde för ljust och ett
för mörkt läge. Accenten är **koppar**.

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
| 5 | Gudstjänst | 🔜 planerad | Närvaro (närv/från), start av AI-tolkning live |
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

- Styrs via `data-theme="light"` / `data-theme="dark"` på rot-elementet.
- Alla färger kommer från tokens, så hela appen byter läge på ett ställe.
- Standardläge i prototypen är mörkt.

---

## 7. Namn och roller

- Prästen heter **Fader Korollos** (koptisk-ortodox präst).
- Roller i planeringen: **präst** (kopparfärgad) och **diakon** (blå).
