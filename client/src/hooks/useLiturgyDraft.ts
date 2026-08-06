// useLiturgyDraft — presentation-hook för manuellt inskriven liturgi per gudstjänst
// Använder LiturgyDraftRepository, så komponenten slipper veta var datan lagras
//
// Används av: LiturgyManualTab

import { useState, useEffect } from "react"
import type { LiturgyBlock } from "../domain/liturgy"
import type { NewLiturgyBlock } from "../domain/repositories/liturgyDraftRepository"
import { mockLiturgyDraftRepository as repository } from "../data/mock/mockLiturgyDraftRepository"

// Ger de manuella blocken för en gudstjänst och funktioner för att ändra dem
// Tar serviceId (vilken gudstjänst blocken hör till)
// Returnerar blocks, loading, addBlock och removeBlock
export function useLiturgyDraft(serviceId: string) {
  const [blocks, setBlocks] = useState<LiturgyBlock[]>([])
  const [loading, setLoading] = useState(true)

  // Hämtar blocken när hooken används eller gudstjänsten byts
  useEffect(() => {
    repository.getByService(serviceId).then((list) => {
      setBlocks(list)
      setLoading(false)
    })
  }, [serviceId])

  // Lägger till ett block och läser om listan
  const addBlock = async (block: NewLiturgyBlock) => {
    await repository.add(serviceId, block)
    setBlocks(await repository.getByService(serviceId))
  }

  // Tar bort ett block och läser om listan
  const removeBlock = async (blockId: string) => {
    await repository.remove(serviceId, blockId)
    setBlocks(await repository.getByService(serviceId))
  }

  return { blocks, loading, addBlock, removeBlock }
}
