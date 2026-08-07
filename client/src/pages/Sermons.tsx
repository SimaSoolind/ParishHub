// Sermons — predikobiblioteket (URL "/predikningar")
// Sökbar och filtrerbar lista över alla predikningar med metadata
// Klick på en predikan öppnar redigering; media-länk öppnas i ny flik
//
// Används av: App.tsx (route "predikningar")
// Bygger på: useSermons (data), filterSermons/getSermonFeasts (logik), SermonModal

import { useState } from "react"
import { BookOpen, Search, ExternalLink, Trash2, Pencil } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { logError, getErrorMessageKey } from "../lib/errorHandler"
import { AddButton } from "../components/AddButton"
import { Chip } from "../components/Chip"
import { Badge } from "../components/Badge"
import { Skeleton } from "../components/Skeleton"
import { EmptyState } from "../components/EmptyState"
import { SermonModal } from "../components/SermonModal"
import { useSermons } from "../hooks/useSermons"
import { filterSermons, getSermonFeasts } from "../use-cases/sermons"
import type { Sermon, NewSermonData } from "../domain/sermon"
import { formatShortDate } from "../utils/dateUtils"

// Ritar predikobiblioteket: sök, högtid-filter, lista och formulär-modal
// Tar inga props och returnerar sidan som JSX
export function Sermons() {
  const { t } = useTranslation()

  // Predikningar och funktioner från hooken
  const { sermons, loading, addSermon, updateSermon, removeSermon } = useSermons()

  // Sök- och filter-state samt vilken predikan som redigeras
  const [query, setQuery] = useState("")
  const [feast, setFeast] = useState("") // "" = alla högtider
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Sermon | null>(null)

  // Unika högtider för filtret + den filtrerade listan (logik i use-case)
  const feasts = getSermonFeasts(sermons)
  const visible = filterSermons(sermons, query, feast)

  // Öppnar formuläret för ny eller befintlig predikan
  const openNew = () => {
    setEditing(null)
    setModalOpen(true)
  }
  const openEdit = (sermon: Sermon) => {
    setEditing(sermon)
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
  }

  // Sparar en ny eller ändrad predikan med felhantering och toast
  const handleSave = async (data: NewSermonData) => {
    try {
      if (editing) await updateSermon(editing.id, data)
      else await addSermon(data)
      closeModal()
      toast.success(editing ? t("common.updated") : t("common.added"))
    } catch (error) {
      logError("Sermons.handleSave", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  // Tar bort en predikan
  const handleDelete = async (id: string) => {
    try {
      await removeSermon(id)
      toast.success(t("common.removed"))
    } catch (error) {
      logError("Sermons.handleDelete", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  return (
    <>
      <header className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-serif font-bold text-strong">{t("sermons.title")}</h1>
        <AddButton label={t("sermons.add")} onClick={openNew} />
      </header>
      <p className="text-soft mb-6">{t("sermons.total", { total: sermons.length })}</p>

      {/* Sök + högtid-filter */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("sermons.search")}
            aria-label={t("sermons.search")}
            className="field pl-9"
          />
        </div>
        {feasts.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Chip active={feast === ""} onClick={() => setFeast("")}>
              {t("sermons.allFeasts")}
            </Chip>
            {feasts.map((feastOption) => (
              <Chip
                key={feastOption}
                active={feast === feastOption}
                onClick={() => setFeast(feastOption)}
              >
                {feastOption}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div
          className="surface border p-6 rounded-2xl shadow-sm space-y-3"
          aria-label={t("common.loading")}
        >
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : sermons.length === 0 ? (
        <div className="surface border p-6 rounded-2xl shadow-sm">
          <EmptyState
            icon={BookOpen}
            title={t("sermons.empty")}
            action={<AddButton label={t("sermons.add")} onClick={openNew} />}
          />
        </div>
      ) : visible.length === 0 ? (
        <div className="surface border p-6 rounded-2xl shadow-sm">
          <p className="text-sm text-faint italic">{t("sermons.noResults")}</p>
        </div>
      ) : (
        <div className="surface border p-4 rounded-2xl shadow-sm">
          <ul className="divide-y divide-rows">
            {visible.map((sermon) => (
              <li key={sermon.id} className="flex items-start justify-between gap-3 py-3">
                {/* Klickbar yta öppnar redigering */}
                <button
                  onClick={() => openEdit(sermon)}
                  className="text-left min-w-0 flex-1 rounded-lg row-hover px-2 -mx-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-strong">{sermon.title}</span>
                    {sermon.feast && <Badge color="blue">{sermon.feast}</Badge>}
                  </div>
                  <div className="text-sm text-faint mt-1">
                    {formatShortDate(sermon.date)}
                    {sermon.bibleText ? " · " + sermon.bibleText : ""}
                    {sermon.church ? " · " + sermon.church : ""}
                  </div>
                  {sermon.content && (
                    <p className="text-sm text-soft mt-1 line-clamp-2">{sermon.content}</p>
                  )}
                </button>

                {/* Höger sida: media-länk, redigera och radera */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {sermon.mediaUrl && (
                    <a
                      href={sermon.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("sermons.openMedia")}
                      className="p-2 rounded-full row-hover text-accent"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  <button
                    onClick={() => openEdit(sermon)}
                    aria-label={t("sermons.edit", { title: sermon.title })}
                    className="p-2 rounded-full row-hover text-soft"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(sermon.id)}
                    aria-label={t("sermons.delete", { title: sermon.title })}
                    className="p-2 rounded-full row-hover text-soft hover:text-red-700 dark:hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {modalOpen && <SermonModal sermon={editing} onSave={handleSave} onClose={closeModal} />}
    </>
  )
}
