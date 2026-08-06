// server.ts — enkel WebSocket-server for PoC-vecka-1
//
// Anvands av: docs/POC-VECKA-1.md
// Tar emot Int16 PCM-frames fran klient, skickar till Speechmatics,
// tar tillbaka arabisk text, skickar till DeepL, broadcastar svensk text
//
// Ingen produktions-kod. Bara bevis-of-concept for att verifiera
// att API-nycklarna fungerar innan resten av MVP:n byggs.

import Fastify from "fastify"
import fastifyStatic from "@fastify/static"
import { WebSocketServer } from "ws"
import { RealtimeClient } from "@speechmatics/real-time-client"
import { createSpeechmaticsJWT } from "@speechmatics/auth"
import * as deepl from "deepl-node"
import "dotenv/config"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Hamtar sokvag till public-mappen (statiska filer)
const dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env["PORT"] ?? 8080)

// Startar en HTTP-server som serverar frontend-filerna
const app = Fastify({ logger: false })
await app.register(fastifyStatic, { root: path.join(dirname, "public") })

// WebSocket-server for realtids-strommning
const wss = new WebSocketServer({ noServer: true })

// DeepL-klient — anvands sen for att oversatta arabiska till svenska
const translator = new deepl.Translator(process.env["DEEPL_API_KEY"] as string)

wss.on("connection", async (ws) => {
  console.log("Ny klient ansluten")

  // JWT for Speechmatics — kort livslangd, hamtas fran API-nyckel
  // API-nyckeln lamnar aldrig servern; klienten ser bara JWT om det behovs
  const jwt = await createSpeechmaticsJWT({
    type: "rt",
    apiKey: process.env["SPEECHMATICS_API_KEY"] as string,
    ttl: 60,
  })

  const asr = new RealtimeClient()

  // Nar Speechmatics returnerar arabisk text — oversatt till svenska
  // isFinal-flaggan indikerar om detta ar en slutlig eller preliminar transkription
  asr.addEventListener("receiveMessage", async ({ data }: { data: any }) => {
    if (data.message !== "AddTranscript") return
    const arabic = (data.results ?? [])
      .map((r: any) => r.alternatives?.[0]?.content ?? "")
      .join(" ")
      .trim()
    if (!arabic) return

    try {
      const swedish = await translator.translateText(arabic, "ar", "sv")
      const payload = JSON.stringify({ ar: arabic, sv: swedish.text })
      ws.send(payload)
      console.log(`AR: ${arabic}\nSV: ${swedish.text}\n`)
    } catch (err) {
      console.error("Fel vid oversattning:", err)
    }
  })

  await asr.start(jwt, {
    transcription_config: {
      language: "ar",
      operating_point: "enhanced",
      enable_partials: true,
      max_delay: 2,
    },
  })

  // Skicka mikrofon-frames vidare till Speechmatics
  ws.on("message", (data) => asr.sendAudio(data as Buffer))
  ws.on("close", () => {
    console.log("Klient fransluten")
    asr.stopRecognition().catch((e) => console.error(e))
  })
})

// Startar HTTP-servern och kopplar in WebSocket-uppgraderingen
await app.listen({ port: PORT, host: "0.0.0.0" })
console.log(`PoC-servern kor pa http://localhost:${PORT}`)

app.server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req))
})
