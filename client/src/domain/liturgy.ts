// liturgy — entiteter för en liturgi som kan visas live (tvåspråkig)
// En liturgi är en lista med block: rubriker, textrader (ar+sv) eller predikan (live)
// Rena typer, ingen React eller API
//
// Källor: bibliotek (JSON), uppladdad fil eller manuellt inskriven text
// Används av: scheman, repository, hooks och liturgi-panelen

// Blocktyp: rubrik, vanlig textrad eller predikan (tolkas live med AI)
export type LiturgyBlockKind = "heading" | "text" | "sermon"

// Ett block i liturgin
export interface LiturgyBlock {
  id: string
  kind: LiturgyBlockKind
  ar?: string | undefined // Arabisk text
  sv?: string | undefined // Svensk text
  bibleRef?: string | undefined // Bibelhänvisning, t.ex. "Joh 3:16"
}

// En hel liturgi (t.ex. en tidebön eller en uppladdad gudstjänst)
export interface LiturgyScript {
  id: string
  title: string
  blocks: LiturgyBlock[]
}
