# 🗄️ Databas — att göra (tabeller ParishHub behöver)

> **Syfte:** Lista över databastabeller backend behöver, härledd från allt frontend redan använder.
> **Använd när:** du bygger Prisma-schemat och backend (vecka 5–8).
> **Se även:** `docs/BACKEND-ATT-GORA.md` (krav per modul), `docs/BESLUT.md`, `docs/SECURITY.md`.

Stack: **PostgreSQL via Prisma**. Nästan ALLT scopas med `churchId` (multi-kyrka, beslut 2026-08-06).
Genomgående på varje tabell: `id`, `churchId` (FK), `createdAt`, `updatedAt`. GDPR: soft-delete
(`deletedAt`) där personuppgifter finns, så "rätt att bli glömd" kan uppfyllas.

---

## 1. Grund: multi-kyrka, auth & GDPR (bygg FÖRST)

- [x] **churches** — församlingar (multi-tenant-roten). Fält: name, slug, timezone, logo.
      (Byggd 2026-08-19 via Prisma, Steg D.)
- [x] **users** — konton (präst/diakon/admin). Fält: email, passwordHash (bcrypt ≥10 rounds),
      name, role, churchId. Lösenord ALDRIG i klartext. (Byggd 2026-08-19; passwordHash-fältet
      finns, bcrypt-hashning kopplas när auth byggs.)
- [ ] **roles / permissions** — RBAC. Roller: präst, diakon, admin. Styr vem som FÅR göra vad.
- [ ] **refresh_tokens** — httpOnly/Secure-cookie, kort access-token. Rotering, revoke.
- [ ] **consents** — GDPR-samtycken (art. 6/9): sakrament, predikan-lagring, AI-tolkning.
      Fält: memberId/userId, type, givenAt, givenBy.
- [ ] **audit_log** — vem gjorde vad, när, från vilken IP (GDPR + spårbarhet). Logga ALDRIG
      lösenord/tokens/personuppgifter i klartext.

## 2. Medlemmar

- [ ] **members** — hela medlemsregistret (personuppgifter → GDPR). Fält: name, phone, email,
      address, familySize, birthday, category (adult/youth/leader/other), status (active/inactive),
      preferredName, language (sv/ar/en/el/ru/syr), familyRole (spouse/child/parent/sibling),
      notes, photoUrl, familyId (FK).
- [ ] **families** — hushåll (idag kopplas medlemmar via `familyId`). Fält: churchId.
      (Ev. framtida **family_relations** för parvisa relationer make/maka etc.)

## 3. Gudstjänst & närvaro

- [ ] **services** — gudstjänster. Fält: title, date, startTime, endTime, notes, feast, bibleText,
      streamUrl.
- [ ] **attendance** — närvaro per medlem och gudstjänst. Fält: serviceId, memberId,
      status (present/absent), markedAt, markedBy, absenceReason (sick/travel/unknown/other),
      contactStatus (not-contacted/attempted/answered). Unik: (serviceId, memberId).
- [ ] **service_notes** — noteringar per gudstjänst. Fält: serviceId, type (prayer/sermon/
      sacrament/reflection), visibility (private/public), text, createdAt.

## 4. Kontakt & uppföljning

- [ ] **reminders** — manuella påminnelser. Fält: name, reason, kind (manual/grief/commitment),
      dueDate, phone, email, done, createdAt.
- [ ] **contact_log** — kontakthistorik (vem kontaktades, när, resultat). Grund för "senast
      kontaktad" och för att inte tjata. Fält: memberId, contactedAt, contactedBy, channel, note.
- [ ] **absence_rules** — regel per kyrka ("ej närvarat på X veckor", standard 4). Fält: weeks.
      (Frontend har regeln hårdkodad idag — flyttas hit.)

## 5. Sakrament

- [ ] **sacraments** — 9 typer (dop, myrrasmörjelse, första nattvard, bikt, äktenskap, prästvigning,
      sjuksmörjelse, begravning, övrigt). Fält: memberId, type, date, officiant, place, witnesses,
      grade, partnerId (äktenskap), certificateUrl, notes.
      ⚠️ **Bikt:** lagra ALDRIG innehåll (sekretess). **Krypterat i vila** (AES-256/pgcrypto) +
      samtycke för känsliga religiösa uppgifter (GDPR art. 9).

## 6. Predikningar

- [ ] **sermons** — predikobibliotek. Fält: title, date, bibleText, feast, church, mediaUrl, content.
      ⚠️ Innehåll **krypterat** + samtycke + retention (5 år standard, konfigurerbart). Fil-uppladdning
      kräver fillagring (se documents).

## 7. Kalender

- [ ] **events** — prästens egna kalender-händelser. Fält: title, start, end, category, notes,
      isReadOnly. (Gudstjänster + sakrament visas också i kalendern — härleds, egen tabell behövs ej.)
- [ ] (Koptiska högtider hämtas via **coptic.io API** — ev. en **coptic_cache**-tabell för prestanda,
      inte nödvändig i v1.)

## 8. Liturgi-manus

- [ ] **liturgy_scripts** — bibliotekets liturgier (en per högtid). Fält: feast/title.
- [ ] **liturgy_blocks** — rader i en liturgi. Fält: scriptId, order, kind (heading/text/sermon),
      ar, sv, bibleRef. (Idag normaliseras Agbeya från JSON — flyttas till DB.)
- [ ] **service_liturgy** — vald/kopplad liturgi per gudstjänst (bibliotek, uppladdat dokument eller
      manuellt inskrivet). Fält: serviceId, source (library/upload/manual), scriptId/documentId.
- [ ] **documents** — uppladdade dokument (PDF) per gudstjänst. Fält: serviceId, filename, url, mimeType.

## 9. AI-tolkning live

- [ ] **interpretation_sessions** — en tolkningssession. Fält: serviceId, startedAt, endedAt,
      direction, speaker-taggar, status.
- [ ] **transcript_segments** — transkript (om de sparas). Fält: sessionId, speaker (priest/deacon),
      sourceLanguage, targetLanguage, sourceText, translatedText, status (partial/final), sequence.
      ⚠️ Sparas bara med samtycke, **krypterat**, med retention (se `docs/AI-TOLKNING.md`).
- [ ] **hymn_library** — föröversatta hymner (Simas teams prenumerations-tjänst, flera språk).
      Fält: language, tradition, title, lyrics, translation.

## 10. Meddelanden (WhatsApp/utskick)

- [ ] **message_templates** — mallar per språk (idag i frontend-i18n). Fält: key, language, text.
- [ ] **message_log** — utskickshistorik (respektera samtycke + språkpreferens). Fält: memberId,
      channel (whatsapp/sms/email), templateKey, sentAt, sentBy.

## 11. Inställningar per kyrka

- [ ] **church_settings** — kalendersystem (gregoriansk/juliansk), bakgrundsbild (projektor),
      retention-tid, absence-regel, standardspråk. (Tema/textstorlek är klient-lokalt — behöver ej DB.)

---

## Ordning att bygga i

1. **churches + users + auth + RBAC** (allt annat hänger på churchId + inloggning)
2. **members + families** (kärnregistret)
3. **services + attendance + service_notes**
4. **reminders + contact_log**, **sacraments**, **sermons**, **events**
5. **liturgy_* + documents**, **message_***, **church_settings**
6. **interpretation_* + hymn_library** (sist — kräver AI-backend)

## Genomgående krav (för ALLA tabeller)

- `churchId` FK + index (multi-tenant-isolering — medlemmar får ALDRIG blandas mellan kyrkor).
- Validera all input med Zod på varje endpoint (återanvänd `client/src/schemas/`).
- Prisma parametriserar queries (undvik `$queryRawUnsafe`).
- Minsta privilegium för databas-användaren.
- Soft-delete (`deletedAt`) + kryptering av känsliga fält (bikt, predikan, transkript).
