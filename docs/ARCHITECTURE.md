# Arkitektur — ParishHub

## Översikt

ParishHub är en monorepo med två delar som pratar med varandra:

## Dataflöde — Vanligt anrop (t.ex. hämta medlemmar)

1. Användaren öppnar Medlemmar-sidan i klienten
2. Klienten skickar `GET /api/members` till servern
3. Servern hämtar från PostgreSQL via Prisma
4. Servern returnerar JSON med alla medlemmar
5. Klienten visar listan

## Dataflöde — AI-tolkning live under gudstjänst

1. Prästen trycker "Starta tolkning" i klienten
2. Klienten öppnar WebSocket-anslutning till servern
3. Klienten skickar mikrofon-ljud i realtid
4. Servern vidarebefordrar ljudet till Speechmatics
5. Speechmatics skickar arabisk text tillbaka (~150 ms latens)
6. Servern skickar arabisk text till DeepL för översättning
7. Servern skickar BÅDA texterna (arabisk + svensk) till alla skärm-klienter
8. Kyrkans projektor visar båda texterna
9. All text sparas i databasen för framtida arkiv

## Viktiga tekniska beslut

### Varför PostgreSQL istället för MongoDB?
- Kyrko-appen har många relationer (medlem → familj → närvaro → anteckningar)
- PostgreSQL har starkare stöd för GDPR (radera + spåra samtycke)
- Prisma ORM ger säkra TypeScript-typer automatiskt

### Varför Speechmatics istället för Deepgram/Whisper?
- **96 % noggrannhet** för arabiska — högst av jämförda leverantörer
- **<150 ms latens** i realtid via WebSocket
- Stöd för MSA (Modern Standard Arabic) + dialekter (Egyptian, Gulf, Levantine, Maghrebi) + koptiska inslag
- Utmärkt kodväxlings-stöd (viktigt när prästen växlar mellan arabiska och koptiska under gudstjänsten)
- Se detaljerad jämförelse i `docs/AI-TOLKNING-RAPPORT.md` avsnitt 7

### Varför DeepL istället för OpenAI för översättning?
- DeepL är specialiserad på europeiska språk
- Bättre svenska än OpenAI
- Har gratisnivå (500 000 tecken/månad)

### Varför monorepo istället för två separata repos?
- Enklare att hålla frontend och backend synkade
- En plats för dokumentation
- Delade TypeScript-typer

## Beroenden (externa tjänster)

- **PostgreSQL** — Databas (Railway)
- **Speechmatics** — Live speech-to-text för arabiska (MSA + dialekter + koptiska inslag)
- **DeepL API** — Arabisk → svensk översättning
- **Vercel** — Hosting för frontend
- **Railway** — Hosting för backend + databas

## Säkerhet

- Alla API-nycklar bor i `server/.env` — aldrig i klienten
- JWT-tokens skyddar alla skyddade routes
- bcrypt hashar alla lösenord (saltRounds: 12)
- Privata anteckningar krypteras i databasen
- HTTPS/WSS överallt i produktion