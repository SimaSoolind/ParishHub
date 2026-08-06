# live-interpretation-mock — Vecka 1-referens

Kod-referens för `docs/POC-VECKA-1.md`. **Ingen körbar backend** —
bara TypeScript-filer att kopiera in i `client/src/`.

## Filstruktur

```
live-interpretation-mock/
├── README.md
└── src/
    ├── domain/
    │   ├── entities/
    │   │   ├── InterpretationSession.ts
    │   │   └── TranscriptSegment.ts
    │   ├── repositories/
    │   │   └── InterpretationRepository.ts
    │   └── types/
    │       └── interpretation.types.ts
    ├── infrastructure/
    │   └── MockInterpretationRepository.ts
    └── pages/
        ├── LiveInterpretationPage.tsx
        ├── ProjectorPage.tsx
        └── StreamViewerPage.tsx
```

## Så använder du referensen

1. Läs `docs/POC-VECKA-1.md` för sammanhang
2. Kopiera filerna under `src/` till motsvarande plats i `client/src/`
   (samma mappstruktur enligt Deep Research-spec)
3. Kör verifieringen i POC-VECKA-1.md steg 4

## Vad ingår

- Rena domän-typer (ingen React, inga externa beroenden)
- Repository-interface (kontraktet)
- Mock-implementation som simulerar en session
- Tre sid-stubs för de nya rutter

## Vad ingår INTE

- Backend-kod (Speechmatics/DeepL) — kommer i vecka 5+
- WebSocket-implementation — kommer i vecka 6
- Mikrofon-kod — kommer i vecka 5
- Session state machine — kommer i vecka 2

## Vidare läsning

- `docs/AI-TOLKNING.md` — konsoliderad plan
- `docs/POC-VECKA-1.md` — steg-för-steg för vecka 1
- `docs/ARCHITECTURE.md` — systemarkitektur
