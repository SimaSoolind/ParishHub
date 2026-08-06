# Sakramentsregister

Ortodoxa kyrkan har fyra centrala sakrament som ska följa en medlem
genom hela livet. ParishHub lagrar dessa som förstklassiga entiteter
i databasen — inte som anteckningar.

Uppdaterad: 2026-08-04

---

## De fyra sakramenten

| Sakrament | När sker det | Vem officierar |
|---|---|---|
| **Dop** | Barndop (oftast) eller vuxendop | Präst |
| **Krismation** | Direkt efter dopet (koptisk tradition) | Präst |
| **Vigsel** | Bröllop | Präst eller biskop |
| **Prästvigning** | När diakon/präst vigs | Biskop |

## Fält per sakrament

Varje sakrament sparar:

- **Datum** (både civil OCH juliansk kalender — 13 dagars förskjutning stöds)
- **Officiant** (präst eller biskop — kopplas till `users`-tabellen)
- **Vittnen** (fritext eller kopplas till medlemmar)
- **Plats** (kyrka/adress)
- **Officiellt intyg** (PDF-mall genereras vid registrering)

## Speciellt per sakrament

**Vigsel:** kopplas till TVÅ medlemmar (make + maka).
**Prästvigning:** kräver biskop + grad (diakon/präst/biskop).

## Implementeringsplan

Se `docs/BACKLOG.md` sektion **Sakrament** för fullständig checklista
med prioritet och kod-tasks.

## Databas-modell

Se `docs/BACKLOG.md` sektion **Databasmodeller** — `sacraments`-tabell
listad där.

## GDPR + integritet

Sakrament är personuppgifter enligt GDPR art. 9 (särskilda kategorier —
religiös övertygelse). Extra skydd:

- Kryptering i vila (AES-256 via pgcrypto)
- Samtycke från medlem för lagring (art. 9.2(a))
- Audit-logg för all åtkomst
- Retention: sakrament sparas permanent (kyrkorättslig grund)

Se `docs/SECURITY.md` sektion 12 för kryptering-implementation.
