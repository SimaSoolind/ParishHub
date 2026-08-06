// liveChannel — tunn wrapper runt BroadcastChannel för live-tolkning
// Kontrollpanelen skickar segment/status; projektor-vyn (annan flik) lyssnar
// Inkommande meddelanden valideras med Zod innan de används (säkerhet)
//
// Används av: useLiveSession (skicka) och useLiveDisplay (lyssna)

import { liveMessageSchema, type LiveMessage } from "../schemas/liveMessageSchema"

// Namnet på kanalen — samma i båda flikarna så de hittar varandra
const CHANNEL_NAME = "parishhub-live"

// Öppnar kanalen för att skicka meddelanden
// Returnerar ett objekt med post (skicka) och close (stäng)
// Kan återanvändas av valfri sändare som vill mata projektor-vyn
export function openLiveSender() {
  const channel = new BroadcastChannel(CHANNEL_NAME)
  return {
    post: (message: LiveMessage) => channel.postMessage(message),
    close: () => channel.close(),
  }
}

// Prenumererar på meddelanden från kanalen
// Tar en callback som körs för varje giltigt meddelande
// Returnerar en avsluta-funktion som stänger kanalen och tar bort lyssnaren
// Ogiltiga meddelanden ignoreras (Zod-validering skyddar mot skräpdata)
export function subscribeLive(onMessage: (message: LiveMessage) => void): () => void {
  const channel = new BroadcastChannel(CHANNEL_NAME)

  const handler = (event: MessageEvent) => {
    // Validerar okänd data i runtime innan den skickas vidare
    const result = liveMessageSchema.safeParse(event.data)
    if (result.success) onMessage(result.data)
  }

  channel.addEventListener("message", handler)
  return () => {
    channel.removeEventListener("message", handler)
    channel.close()
  }
}
