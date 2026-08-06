# Multi-kyrka — SaaS multi-tenant-arkitektur

ParishHub är designat som en **kommersiell SaaS-produkt** för flera
ortodoxa kyrkor. Varje församling är en isolerad "tenant" med egen data,
egen inställning, egen bakgrundsbild.

Uppdaterad: 2026-08-04

---

## Princip: en medlem = EN församling

En medlem tillhör **en huvudförsamling** (hemkyrka). Undantag:

- En medlem kan vara "besökare" i andra församlingar (mång-till-mång via `member_churches`)
- En präst kan ha åtkomst till flera församlingar (mång-till-mång via `user_church_roles`)

**Skäl:** enkel data-modell + tydlig ägarskap + GDPR-hantering per församling.

## Tenant-isolation

Varje församling är en tenant. Data isoleras via `churchId` på alla resurser:

- `members.church_id`
- `services.church_id`
- `sermons.church_id` (via `services`)
- `messages.church_id`
- `sacraments.member_id` → `members.church_id`

**Alla queries filtrerar via `churchId`** — hämtas från inloggad användares
`user_church_roles`. Ingen församling ser data från en annan.

## Parish profile

Varje församling har en `parish_profile` med:

- Namn + adress
- Logo
- Tradition (koptisk / grekisk / rysk / syriansk)
- Färgtema (bas: Varm Olivsten, kan anpassas)
- Bakgrundsbild för projektorvyn
- Liturgisk kalender-typ (juliansk / reviderad juliansk)
- Data-retention-policy (predikningar, 1-10 år)

## Kommersiell modell

Se `docs/AI-TOLKNING.md` sektion 13 — Simas teams affärsmodell.
Kort: prenumerations-service med hymn-bibliotek som huvudprodukt.

## Implementeringsplan

Se `docs/BACKLOG.md` sektion **Multi-kyrka** för fullständig checklista.

## Databas-modell

Se `docs/BACKLOG.md` sektion **Databasmodeller** — `churches`,
`member_churches`, `user_church_roles`.

## Referenser

- Rollhantering: `docs/RBAC.md`
- Systemarkitektur: `docs/ARCHITECTURE.md`
- Sakraments-hantering per församling: `docs/SAKRAMENT.md`
