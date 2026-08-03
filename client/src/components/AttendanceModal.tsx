// AttendanceModal — bocka av närvaro för en gudstjänst
// Visar alla medlemmar med knappar för Närvarande / Frånvarande
// Sparar närvaron tillbaka till föräldern (Services)
//
// Används av: Services.tsx

import { useState, useEffect } from "react"
import { X, Check, UserX } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { Member } from "../types/member"
import type { Service, Attendance, AttendanceStatus } from "../types/service"

interface Props {
  service: Service
  members: Member[]
  attendance: Attendance[] // befintlig närvaro för denna gudstjänst
  onSave: (records: Attendance[]) => void
  onSaveNote: (note: string) => void // sparar gudstjänstens anteckning
  onClose: () => void
}

// Ritar närvaro-modalen med en rad per medlem
// Tar emot service, members, befintlig attendance samt onSave och onClose
// Returnerar modalen som JSX
export function AttendanceModal({ service, members, attendance, onSave, onSaveNote, onClose }: Props) {
  const { t } = useTranslation()

  // Anteckning för gudstjänsten — förifylls med befintlig text
  const [note, setNote] = useState(service.notes ?? "")

  // Bygger start-status per medlem från befintlig närvaro (annars "not-marked")
  const buildInitial = (): Record<string, AttendanceStatus> => {
    const map: Record<string, AttendanceStatus> = {}
    for (const member of members) {
      const existing = attendance.find((a) => a.memberId === member.id)
      map[member.id] = existing ? existing.status : "not-marked"
    }
    return map
  }

  // Håller vald status för varje medlem
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>(buildInitial)

  // Stänger modalen när Escape trycks (tillgänglighet)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  // Sätter status för en medlem — klick på samma knapp avmarkerar
  const setStatus = (memberId: string, status: AttendanceStatus) => {
    setMarks((prev) => ({
      ...prev,
      [memberId]: prev[memberId] === status ? "not-marked" : status,
    }))
  }

  // Räknar hur många som är närvarande respektive frånvarande
  const presentCount = Object.values(marks).filter((s) => s === "present").length
  const absentCount = Object.values(marks).filter((s) => s === "absent").length

  // Sparar — skapar Attendance-poster för alla som är markerade
  // markedAt sätts för spårbarhet (vem-fältet läggs till när inloggning finns)
  const handleSave = () => {
    const now = new Date().toISOString()
    const records: Attendance[] = members
      .filter((m) => marks[m.id] !== "not-marked")
      .map((m) => ({
        serviceId: service.id,
        memberId: m.id,
        status: marks[m.id],
        markedAt: now,
      }))
    // Sparar både anteckningen och närvaron
    onSaveNote(note)
    onSave(records)
  }

  return (
    // Backdrop — klick utanför stänger modalen
    <div onClick={onClose} className="modal-backdrop">
      {/* Själva modalen — stopPropagation förhindrar att klick stänger */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-panel max-w-md w-full p-6 max-h-[90vh] flex flex-col"
      >
        {/* Rubrik-rad med stäng-knapp */}
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-xl font-bold text-strong">{service.title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full row-hover"
            aria-label={t("form.close")}
          >
            <X size={20} className="text-faint" />
          </button>
        </div>
        <p className="text-sm text-faint mb-3">
          {t("attendance.summary", { present: presentCount, absent: absentCount })}
        </p>

        {/* Anteckning för gudstjänsten — ligger kvar medan listan scrollar */}
        <div className="mb-3">
          <label className="field-label">{t("attendance.note")}</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder={t("attendance.notePlaceholder")}
            className="field resize-none"
          />
        </div>

        {/* Medlemslista med närvaro-knappar (scrollar om många) */}
        <ul className="overflow-y-auto divide-y divide-rows">
          {members.map((member) => {
            const status = marks[member.id]
            return (
              <li
                key={member.id}
                className="flex items-center justify-between py-2"
              >
                <span className="text-sm font-medium text-strong">
                  {member.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus(member.id, "present")}
                    className={
                      "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border " +
                      (status === "present"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-stone-500 border-stone-200 hover:border-green-600 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-600")
                    }
                  >
                    <Check size={14} />
                    {t("attendance.present")}
                  </button>
                  <button
                    onClick={() => setStatus(member.id, "absent")}
                    className={
                      "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border " +
                      (status === "absent"
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-stone-500 border-stone-200 hover:border-red-600 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-600")
                    }
                  >
                    <UserX size={14} />
                    {t("attendance.absent")}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Knappar */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 btn-secondary text-soft"
          >
            {t("form.cancel")}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 btn-primary"
          >
            {t("attendance.save")}
          </button>
        </div>
      </div>
    </div>
  )
}
