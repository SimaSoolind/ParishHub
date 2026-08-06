// useLiveSession — presentation-hook för kontrollpanelen (AI-tolkning live)
// Styr sessionens läge och riktning, driver mock-strömmen och sänder segment/status
// till projektor- och YouTube-vyn via BroadcastChannel
//
// Används av: LiveControl

import { useState, useRef, useEffect, useCallback } from "react"
import type { LiveStatus, LanguageDirection, TranscriptSegment } from "../domain/liveSession"
import type { LiturgyBlock } from "../domain/liturgy"
import { streamTranscript, type LiveEvent } from "../data/mock/mockLiveTranscript"
import { upsertSegment, latestSegment } from "../use-cases/liveSession"
import { openLiveSender } from "../lib/liveChannel"

// Standardriktning: arabiska till svenska (vanligaste flödet)
const DEFAULT_DIRECTION: LanguageDirection = { source: "ar", target: "sv" }

// Gör om en ström-händelse till ett färdigt segment (lägger till id och tid)
// Tar en LiveEvent
// Returnerar ett TranscriptSegment (översättning bara om händelsen har en)
function toSegment(event: LiveEvent): TranscriptSegment {
  return {
    id: crypto.randomUUID(),
    speaker: event.speaker,
    sourceLanguage: event.sourceLanguage,
    targetLanguage: event.targetLanguage,
    sourceText: event.sourceText,
    status: event.status,
    sequence: event.sequence,
    timestamp: Date.now(),
    // translatedText läggs bara till för final (exactOptionalPropertyTypes)
    ...(event.translatedText !== undefined ? { translatedText: event.translatedText } : {}),
  }
}

// Ger status, riktning, segment och funktioner för att styra live-tolkningen
// Tar inga argument
// Returnerar { status, direction, segments, latest, start, pause, resume, stop, changeDirection }
export function useLiveSession() {
  const [status, setStatus] = useState<LiveStatus>("idle")
  const [direction, setDirection] = useState<LanguageDirection>(DEFAULT_DIRECTION)
  const [segments, setSegments] = useState<TranscriptSegment[]>([])

  // Referens till att stoppa mock-strömmen respektive sändaren till vyerna
  const stopStreamRef = useRef<(() => void) | null>(null)
  const senderRef = useRef<ReturnType<typeof openLiveSender> | null>(null)

  // Löpnummer för manuellt visade liturgi-rader — högt startvärde så det inte
  // krockar med strömmens sekvensnummer (som börjar på 0)
  const manualSeqRef = useRef(1_000_000)

  // Öppnar sändaren en gång och städar upp när komponenten försvinner
  useEffect(() => {
    const sender = openLiveSender()
    senderRef.current = sender
    return () => {
      stopStreamRef.current?.()
      sender.close()
    }
  }, [])

  // Byter läge lokalt och talar om det för de lyssnande vyerna
  const changeStatus = useCallback((next: LiveStatus) => {
    setStatus(next)
    senderRef.current?.post({ type: "status", status: next })
  }, [])

  // Startar mock-strömmen i vald riktning: bygger segment, upsertar och sänder
  const startStream = useCallback((dir: LanguageDirection) => {
    stopStreamRef.current?.()
    stopStreamRef.current = streamTranscript((event) => {
      const segment = toSegment(event)
      setSegments((prev) => upsertSegment(prev, segment))
      senderRef.current?.post({ type: "segment", segment })
    }, dir)
  }, [])

  // Startar en ny session (nollställer historiken)
  const start = useCallback(() => {
    setSegments([])
    changeStatus("live")
    startStream(direction)
  }, [changeStatus, startStream, direction])

  // Pausar: stoppar strömmen men behåller det som redan sagts
  const pause = useCallback(() => {
    stopStreamRef.current?.()
    stopStreamRef.current = null
    changeStatus("paused")
  }, [changeStatus])

  // Återupptar efter paus
  const resume = useCallback(() => {
    changeStatus("live")
    startStream(direction)
  }, [changeStatus, startStream, direction])

  // Avslutar sessionen helt
  const stop = useCallback(() => {
    stopStreamRef.current?.()
    stopStreamRef.current = null
    changeStatus("ended")
  }, [changeStatus])

  // Visar en förberedd liturgi-rad på projektorn (utan AI — texten finns redan)
  // Skickas som ett färdigt segment via samma kanal som live-tolkningen
  const showBlock = useCallback((block: LiturgyBlock) => {
    manualSeqRef.current += 1
    const segment: TranscriptSegment = {
      id: crypto.randomUUID(),
      speaker: "priest",
      sourceLanguage: "ar",
      targetLanguage: "sv",
      sourceText: block.ar ?? "",
      status: "final",
      sequence: manualSeqRef.current,
      timestamp: Date.now(),
      // Svensk text läggs bara till om den finns (exactOptionalPropertyTypes)
      ...(block.sv ? { translatedText: block.sv } : {}),
    }
    setSegments((prev) => upsertSegment(prev, segment))
    senderRef.current?.post({ type: "segment", segment })
  }, [])

  // Byter riktning (AR->SV / SV->AR). Under pågående session startas strömmen om
  const changeDirection = useCallback(
    (dir: LanguageDirection) => {
      setDirection(dir)
      if (status === "live") startStream(dir)
    },
    [status, startStream]
  )

  return {
    status,
    direction,
    segments,
    latest: latestSegment(segments),
    start,
    pause,
    resume,
    stop,
    changeDirection,
    showBlock,
  }
}
