// PhotoPicker — väljer profilbild (ta foto eller välj fil) och visar förhandsvisning
// Läser filen som data-URL (base64) och begränsar storleken. Bryts ut ur AddMemberModal
// så formuläret blir kortare och foto-logiken samlas på ett ställe
//
// Används av: MemberMoreFields

import { useRef } from "react"
import { Upload, Camera } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Avatar } from "./Avatar"

interface Props {
  name: string // Används för initialer i förhandsvisningen när bild saknas
  photoUrl: string
  onChange: (dataUrl: string) => void // Körs med bilden som data-URL vid lyckad läsning
  onClear: () => void // Tar bort vald bild
  onError: (message: string) => void // Körs om filen är för stor
  error?: string | undefined
}

// Ritar avatar-förhandsvisning + knappar för foto/fil + dolda fil-fält
// Tar emot name, photoUrl och callbacks för ändring/rensning/fel
// Returnerar väljaren som JSX
export function PhotoPicker({ name, photoUrl, onChange, onClear, onError, error }: Props) {
  const { t } = useTranslation()

  // Dolda fil-fält som öppnas via knapparna (fil respektive kamera)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Läser en vald bildfil och sparar den som data-URL (base64)
  // Begränsar storleken eftersom bilden hålls i minnet tills backend finns
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const maxBytes = 1024 * 1024 // 1 MB
    if (file.size > maxBytes) {
      onError(t("form.photoTooLarge"))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="mb-4">
      <label className="field-label">{t("form.photoUrl")}</label>
      <div className="flex items-center gap-3 mb-2">
        {/* Förhandsvisning: bilden om den finns, annars initialer */}
        <Avatar name={name} photoUrl={photoUrl.trim() || undefined} size="lg" />
        <div className="flex flex-col items-start gap-1">
          {/* Ta foto — capture öppnar kameran på mobil/surfplatta */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 btn-secondary text-soft text-sm"
          >
            <Camera size={14} />
            {t("form.takePhoto")}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 btn-secondary text-soft text-sm"
          >
            <Upload size={14} />
            {t("form.choosePhoto")}
          </button>
          {photoUrl && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-red-600 hover:underline dark:text-red-400"
            >
              {t("form.removePhoto")}
            </button>
          )}
        </div>
      </div>

      {/* Dolda fil-fält — öppnas av knapparna ovan */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
