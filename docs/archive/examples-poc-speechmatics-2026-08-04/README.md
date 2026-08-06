# PoC-vecka-1 — kort snabbstart

Bevis-of-concept för AI-tolkning. Full förklaring i
`docs/POC-VECKA-1.md`.

## Snabbstart

```bash
# 1. Installera paket
npm install

# 2. Skapa .env med dina nycklar
cp .env.example .env
# → oppna .env och fyll i SPEECHMATICS_API_KEY + DEEPL_API_KEY

# 3. Starta servern
npm run dev

# 4. Oppna webblasaren
open http://localhost:8080
```

Klicka "Starta tolkning", godkänn mikrofontillstånd, prata arabiska.
Efter 1-2 sekunder ska både arabisk och svensk text visas.

## Filstruktur

```
poc-vecka-1/
├── server.ts             Backend — WebSocket + Speechmatics + DeepL
├── public/
│   └── index.html        Frontend — mikrofon + rendering
├── package.json
├── .env.example
└── README.md
```

## När det fungerar

Bocka av kontrollpunkterna i `docs/POC-VECKA-1.md` och gå vidare till
Fas A i `docs/AI-TOLKNING.md`.
