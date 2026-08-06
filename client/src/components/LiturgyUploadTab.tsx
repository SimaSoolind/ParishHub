// LiturgyUploadTab — låter prästen ladda upp sitt EGET dokument (PDF eller bild)
// för gudstjänsten och visa det direkt. Realistiskt: präster har PDF/PowerPoint,
// inte JSON. PowerPoint/Word sparas enkelt som PDF innan uppladdning
// Dokumentet läses i webbläsaren (object-URL) och visas — ingen backend behövs
//
// Används av: LiturgyScriptPanel

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Upload, FileText } from "lucide-react"

// Avgör dokumentets sort utifrån filens MIME-typ
// Tar en fil
// Returnerar "pdf", "image" eller "other"
function kindOf(file: File): "pdf" | "image" | "other" {
  if (file.type === "application/pdf") return "pdf"
  if (file.type.startsWith("image/")) return "image"
  return "other"
}

// Ritar dokument-fliken: filväljare + förhandsvisning av dokumentet
// Tar inga props
// Returnerar fliken som JSX
export function LiturgyUploadTab() {
  const { t } = useTranslation()
  const [url, setUrl] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [kind, setKind] = useState<"pdf" | "image" | "other">("other")

  // Frigör object-URL:en när en ny fil väljs eller komponenten försvinner (minnesläcka)
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  // Läser den valda filen och skapar en URL som kan visas
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUrl(URL.createObjectURL(file))
    setName(file.name)
    setKind(kindOf(file))
  }

  return (
    <>
      <label className="btn-secondary text-soft px-4 py-2 inline-flex items-center gap-2 cursor-pointer w-fit mb-2">
        <Upload size={16} aria-hidden="true" />
        {t("liturgy.docButton")}
        <input type="file" accept=".pdf,image/*" onChange={handleFile} className="hidden" />
      </label>
      <p className="text-xs text-faint mb-4">{t("liturgy.docHint")}</p>

      {url && (
        <div>
          {/* Filnamn */}
          <p className="flex items-center gap-2 text-sm text-strong mb-2">
            <FileText size={16} aria-hidden="true" />
            {name}
          </p>

          {kind === "pdf" ? (
            <object
              data={url}
              type="application/pdf"
              className="w-full h-[500px] rounded-xl border border-stone-200 dark:border-stone-700"
              aria-label={name}
            >
              {/* Reserv om webbläsaren inte kan visa PDF direkt */}
              <a href={url} target="_blank" rel="noopener" className="text-accent hover:underline">
                {t("liturgy.docOpen")}
              </a>
            </object>
          ) : kind === "image" ? (
            <img
              src={url}
              alt={name}
              className="max-w-full rounded-xl border border-stone-200 dark:border-stone-700"
            />
          ) : (
            // PowerPoint/Word kan inte visas direkt — be prästen spara som PDF
            <p className="text-sm text-faint">{t("liturgy.docUnsupported")}</p>
          )}
        </div>
      )}
    </>
  )
}
