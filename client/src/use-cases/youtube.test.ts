// Enhetstester för toYouTubeEmbed (YouTube-länk -> embed-URL)
// Ren funktion — inget React, ingen mock behövs

import { describe, it, expect } from "vitest"
import { toYouTubeEmbed } from "./youtube"

const EMBED = "https://www.youtube.com/embed/dQw4w9WgXcQ"

describe("toYouTubeEmbed", () => {
  it("läser watch?v=-länkar", () => {
    expect(toYouTubeEmbed("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(EMBED)
  })

  it("läser korta youtu.be-länkar", () => {
    expect(toYouTubeEmbed("https://youtu.be/dQw4w9WgXcQ")).toBe(EMBED)
  })

  it("läser live-länkar", () => {
    expect(toYouTubeEmbed("https://www.youtube.com/live/dQw4w9WgXcQ")).toBe(EMBED)
  })

  it("ger null för tom eller ogiltig länk", () => {
    expect(toYouTubeEmbed("")).toBeNull()
    expect(toYouTubeEmbed("https://example.com/video")).toBeNull()
  })
})
