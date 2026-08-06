# Liturgi-data

Här ligger liturgin som visas i appen. Två sorters källor stöds:

## 1. Egna filer i enkelt format (title + blocks)

Lägg en `.json`-fil direkt i den här mappen (t.ex. `nativity.json`). Appen plockar
upp den automatiskt och lägger den i biblioteket. Samma format används för
**uppladdning** i appen.

```json
{
  "title": "Julen (Kristi födelse)",
  "blocks": [
    { "kind": "heading", "ar": "قداس عيد الميلاد", "sv": "Julens liturgi" },
    { "kind": "text", "ar": "النص العربي", "sv": "Svensk text", "bibleRef": "Joh 3:16" },
    { "kind": "sermon" }
  ]
}
```

### Block-fält

| Fält | Krav | Beskrivning |
|------|------|-------------|
| `title` | ja | Liturgins namn (visas i biblioteket) |
| `blocks` | ja | Lista med block i ordning |
| `blocks[].kind` | ja | `heading` (rubrik) \| `text` (rad) \| `sermon` (predikan, live-AI) |
| `blocks[].ar` | nej | Arabisk text |
| `blocks[].sv` | nej | Svensk text |
| `blocks[].bibleRef` | nej | Bibelhänvisning, t.ex. `Joh 3:16` |

## 2. Normaliserade samlingar (råtabeller som joinas)

Större samlingar från andra projekt ligger i undermappar och normaliseras i koden
(`data/mock/mockLiturgyRepository.ts`):

- `koptisk-agbeya/` — tidebönerna. Joinar `sentences.json` (ar+sv, `is_title`) +
  `pray_hours.json` + `prays_relations.json` till en liturgi per tidebön.
- Fler samlingar (katameros, kholagy, stilla-veckan …) kan läggas till på samma
  sätt: skriv en adapter i repositoryt som joinar tabellerna till block-formatet ovan.

## Varför förberedd text?

Den fasta liturgin (böner, växelsång, läsningar) är samma varje gång. Genom att
visa den förberedda texten direkt slipper appen anropa AI:n live — det gör
tolkningen billigare och mer korrekt. AI behövs bara för predikan (`sermon`).
