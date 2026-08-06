// NotesPanel visar och skapar noteringar för en gudstjänst
// Prästen väljer typ + synlighet, skriver text och sparar; listan går att söka i
//
// Används av: ServiceDetail
// Bygger på: useServiceNotes (data), filterServiceNotes (sök), Chip och Badge

import { useState } from "react"
import { Plus, Trash2, Search, Lock, Globe, NotebookPen } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { logError, getErrorMessageKey } from "../lib/errorHandler"
import { Chip } from "./Chip"
import { Badge } from "./Badge"
import { useServiceNotes } from "../hooks/useServiceNotes"
import { filterServiceNotes } from "../use-cases/serviceNotes"
import type { ServiceNoteType, ServiceNoteVisibility } from "../domain/serviceNote"
import { formatShortDate } from "../utils/dateUtils"

// De fyra typerna prästen kan välja
const noteTypes: ServiceNoteType[] = ["prayer", "sermon", "sacrament", "reflection"]

interface Props {
  serviceId: string
}

// Ritar noterings-panelen: formulär, sökfält och lista
// Tar emot serviceId (vilken gudstjänst noteringarna hör till)
// Returnerar panelen som JSX
export function NotesPanel({ serviceId }: Props) {
  const { t } = useTranslation()

  // Noteringar + funktioner från hooken
  const { notes, addNote, removeNote } = useServiceNotes(serviceId)

  // Formulär- och sök-state (ren UI-state, hör hemma i komponenten)
  const [query, setQuery] = useState("")
  const [type, setType] = useState<ServiceNoteType>("prayer")
  const [visibility, setVisibility] = useState<ServiceNoteVisibility>("private")
  const [text, setText] = useState("")

  // Listan som visas — filtrerad på söktexten
  const visible = filterServiceNotes(notes, query)

  // Sparar en ny notering och rensar textfältet
  const handleAdd = async () => {
    if (!text.trim()) return
    try {
      await addNote({ serviceId, type, visibility, text: text.trim() })
      setText("")
      toast.success(t("common.added"))
    } catch (error) {
      logError("NotesPanel.handleAdd", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  // Tar bort en notering
  const handleRemove = async (id: string) => {
    try {
      await removeNote(id)
      toast.success(t("common.removed"))
    } catch (error) {
      logError("NotesPanel.handleRemove", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <NotebookPen size={18} className="text-accent" />
        <h2 className="text-sm font-bold text-accent">{t("notes.title")}</h2>
      </div>

      {/* Formulär: välj typ, synlighet och skriv text */}
      <div className="space-y-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {noteTypes.map((nt) => (
            <Chip key={nt} active={type === nt} onClick={() => setType(nt)}>
              {t("notes.type." + nt)}
            </Chip>
          ))}
        </div>
        <div className="flex gap-2">
          <Chip active={visibility === "private"} onClick={() => setVisibility("private")}>
            {t("notes.private")}
          </Chip>
          <Chip active={visibility === "public"} onClick={() => setVisibility("public")}>
            {t("notes.public")}
          </Chip>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("notes.placeholder")}
          rows={2}
          className="field"
          aria-label={t("notes.placeholder")}
        />
        <button
          onClick={handleAdd}
          disabled={!text.trim()}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Plus size={16} aria-hidden="true" />
          {t("notes.add")}
        </button>
      </div>

      {/* Sökfält */}
      <div className="relative mb-3">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"
          aria-hidden="true"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("notes.search")}
          aria-label={t("notes.search")}
          className="field pl-9"
        />
      </div>

      {/* Lista med noteringar */}
      {visible.length === 0 ? (
        <p className="text-sm text-faint italic">{t("notes.empty")}</p>
      ) : (
        <ul className="divide-y divide-rows">
          {visible.map((note) => (
            <li key={note.id} className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge color="blue">{t("notes.type." + note.type)}</Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-faint">
                    {note.visibility === "private" ? <Lock size={12} /> : <Globe size={12} />}
                    {t("notes." + note.visibility)}
                  </span>
                  <span className="text-xs text-faint">
                    {formatShortDate(note.createdAt.slice(0, 10))}
                  </span>
                </div>
                <p className="text-sm text-strong whitespace-pre-wrap break-words">{note.text}</p>
              </div>
              <button
                onClick={() => handleRemove(note.id)}
                aria-label={t("notes.delete")}
                className="p-2 rounded-full row-hover text-soft hover:text-red-700 dark:hover:text-red-400 flex-shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
