# RBAC — Rollbaserad åtkomst

ParishHub använder rollbaserad åtkomstkontroll (RBAC) för att styra
vem som får se och ändra vad. Baseras på principen om **lägsta behörighet**.

Uppdaterad: 2026-08-04

---

## De tre rollerna

| Roll | Beskrivning | Typiska användare |
|---|---|---|
| **admin** | Full åtkomst till en församlings all data | Kyrkoförvaltare |
| **präst** | Läsa/ändra medlemmar, sakrament, gudstjänster, predikningar | Fader Korollos, diakon |
| **volontär** | Begränsad läs-åtkomst till relevanta delar | Söndagsskolelärare, kör-ledare |

**Ingen roll är superuser** — även admin måste tillhöra en församling
(`user_church_roles`).

## Behörigheter per roll (utkast)

| Åtgärd | admin | präst | volontär |
|---|---|---|---|
| Läs medlemmar | ✅ | ✅ | ✅ (begränsat) |
| Ändra/lägga till medlemmar | ✅ | ✅ | ❌ |
| Radera medlem | ✅ | ✅ | ❌ |
| Läs sakramentsregister | ✅ | ✅ | ❌ |
| Ändra sakrament | ✅ | ✅ | ❌ |
| Skapa gudstjänst | ✅ | ✅ | ❌ |
| Bocka av närvaro | ✅ | ✅ | ✅ |
| Starta AI-tolkning | ✅ | ✅ | ❌ |
| Läsa predikan-arkiv | ✅ | ✅ | ❌ |
| Skicka massmeddelande | ✅ | ✅ | ❌ |
| Visa audit-logg | ✅ | ❌ | ❌ |
| Ändra kyrko-inställningar | ✅ | ❌ | ❌ |
| GDPR-radering | ✅ | ❌ | ❌ |

## Multi-kyrka + roller

En användare kan ha OLIKA roller i olika församlingar via `user_church_roles`:

- Fader Korollos = **präst** i församling A OCH församling B
- Söndagsskolelärare = **volontär** i församling A men inget i B

## Implementeringsplan

Se `docs/BACKLOG.md` sektion **Auth + Säkerhet** för RBAC-middleware
och kod-tasks.

## Backend-middleware

Framtida `server/src/middleware/rbac.ts`:

- Läser JWT från Authorization-header
- Kollar `user_church_roles` för aktuell resurs
- Returnerar 403 Forbidden om rollen saknar behörighet
- Loggar alla nekade försök i `audit_log`

## Referenser

- Multi-kyrka: `docs/MULTI-KYRKA.md`
- Säkerhet: `docs/SECURITY.md`
- Backend-tasks: `docs/BACKLOG.md`
