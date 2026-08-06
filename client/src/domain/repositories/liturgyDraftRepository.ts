// LiturgyDraftRepository — GRÄNSSNITT för manuellt inskriven liturgi per gudstjänst
// Prästen skriver in egna block (rubrik/text/predikan) när bibliotek eller fil saknas
// Implementeras av: mockLiturgyDraftRepository (nu), apiLiturgyDraftRepository (senare)

import type { LiturgyBlock } from "../liturgy"

// Nytt block utan id — id sätts av repositoryt
export type NewLiturgyBlock = Omit<LiturgyBlock, "id">

export interface LiturgyDraftRepository {
  getByService(serviceId: string): Promise<LiturgyBlock[]>
  add(serviceId: string, block: NewLiturgyBlock): Promise<void>
  remove(serviceId: string, blockId: string): Promise<void>
}
