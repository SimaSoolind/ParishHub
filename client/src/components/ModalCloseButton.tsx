// ModalCloseButton — stäng-knapp (kryss) för modaler
// Samlar aria-label och stil på ETT ställe, så alla modaler stänger likadant
//
// Används av: alla modaler (AddMemberModal, EventModal, AttendanceModal m.fl.)

import { X } from "lucide-react"
import { useTranslation } from "react-i18next"

interface Props {
  onClose: () => void
}

// Ritar en rund stäng-knapp med kryss-ikon och tillgänglig etikett
// Tar emot onClose (stänger modalen)
// Returnerar knappen som JSX
export function ModalCloseButton({ onClose }: Props) {
  const { t } = useTranslation()

  return (
    <button onClick={onClose} className="p-1 rounded-full row-hover" aria-label={t("form.close")}>
      <X size={20} className="text-soft" />
    </button>
  )
}
