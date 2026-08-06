// LiturgyRepository — GRÄNSSNITT för liturgi-biblioteket
// UI:t vet INTE om datan kommer från JSON-filer eller databas — bara att metoden finns
// Implementeras av: mockLiturgyRepository (nu, JSON-filer), apiLiturgyRepository (senare)

import type { LiturgyScript } from "../liturgy"

export interface LiturgyRepository {
  // Alla liturgier i biblioteket (normaliserade från olika källor)
  getAll(): Promise<LiturgyScript[]>
}
