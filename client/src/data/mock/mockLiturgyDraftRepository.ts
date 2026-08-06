// mockLiturgyDraftRepository — håller manuellt inskrivna liturgi-block i minnet
// Sparat per gudstjänst (serviceId). Nollställs vid omladdning (riktig lagring = backend)
//
// Implementerar: LiturgyDraftRepository. Byts mot API-version när backend finns

import type {
  LiturgyDraftRepository,
  NewLiturgyBlock,
} from "../../domain/repositories/liturgyDraftRepository"
import type { LiturgyBlock } from "../../domain/liturgy"

// Block per gudstjänst (serviceId -> lista med block)
const drafts = new Map<string, LiturgyBlock[]>()

export const mockLiturgyDraftRepository: LiturgyDraftRepository = {
  getByService: async (serviceId) => drafts.get(serviceId) ?? [],

  add: async (serviceId, block: NewLiturgyBlock) => {
    const list = drafts.get(serviceId) ?? []
    list.push({ id: crypto.randomUUID(), ...block })
    drafts.set(serviceId, list)
  },

  remove: async (serviceId, blockId) => {
    const list = drafts.get(serviceId) ?? []
    drafts.set(
      serviceId,
      list.filter((block) => block.id !== blockId)
    )
  },
}
