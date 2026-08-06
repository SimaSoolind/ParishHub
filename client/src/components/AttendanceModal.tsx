// AttendanceModal — bocka av närvaro för en gudstjänst
// Visar alla medlemmar med knappar för Närvarande / Frånvarande
// Vid frånvaro går det att välja orsak (sjuk/resa/okänd/annat) och kontaktstatus
// Sparar närvaron tillbaka till föräldern (Services)
//
// Används av: Services.tsx

import { useState, useEffect } from "react"
import { Check, UserX } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ModalCloseButton } from "./ModalCloseButton"
import { FocusTrap } from "focus-trap-react"
import type { Member } from "../domain/member"
import type { Service, Attendance, AttendanceStatus, AbsenceReason } from "../domain/service"
import type { ContactStatus } from "../domain/contact"
import { buildAttendanceRecords } from "../use-cases/attendance"

interface Props {
  service: Service
  members: Member[]
  attendance: Attendance[] // befintlig närvaro för denna gudstjänst
  onSave: (records: Attendance[]) => void
  onSaveNote: (note: string) => void // sparar gudstjänstens anteckning
  onClose: () => void
}

// Orsaker prästen kan välja vid frånvaro (matchar AbsenceReason)
const reasonValues: AbsenceReason[] = ["sick", "travel", "unknown", "other"]

// Kontaktstatus-val vid frånvaro — texten återanvänds från priority.status (DRY)
const contactOptions: { value: ContactStatus; labelKey: string }[] = [
  { value: "not-contacted", labelKey: "notContacted" },
  { value: "attempted", labelKey: "attempted" },
  { value: "answered", labelKey: "answered" },
]

// Gemensamma chip-klasser för orsak och kontaktstatus
const chipBase = "px-2 py-0.5 rounded-full text-xs font-semibold border "
const chipActive = "bg-amber-800 text-white border-amber-800"
const chipInactive =
  "bg-white text-stone-600 border-stone-200 hover:border-amber-800 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600"

// Ritar närvaro-modalen med en rad per medlem
// Tar emot service, members, befintlig attendance samt onSave och onClose
// Returnerar modalen som JSX
export function AttendanceModal({
  service,
  members,
  attendance,
  onSave,
  onSaveNote,
  onClose,
}: Props) {
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

  // Bygger start-orsak per medlem från befintlig närvaro
  const buildReasons = (): Record<string, AbsenceReason> => {
    const map: Record<string, AbsenceReason> = {}
    for (const record of attendance) {
      if (record.absenceReason) map[record.memberId] = record.absenceReason
    }
    return map
  }

  // Bygger start-kontaktstatus per medlem från befintlig närvaro
  const buildContacts = (): Record<string, ContactStatus> => {
    const map: Record<string, ContactStatus> = {}
    for (const record of attendance) {
      if (record.contactStatus) map[record.memberId] = record.contactStatus
    }
    return map
  }

  // Håller vald status, orsak och kontaktstatus för varje medlem
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>(buildInitial)
  const [reasons, setReasons] = useState<Record<string, AbsenceReason>>(buildReasons)
  const [contacts, setContacts] = useState<Record<string, ContactStatus>>(buildContacts)

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

  // Sätter orsak — klick på samma chip tar bort valet
  const setReason = (memberId: string, reason: AbsenceReason) => {
    setReasons((prev) => {
      const next = { ...prev }
      if (next[memberId] === reason) delete next[memberId]
      else next[memberId] = reason
      return next
    })
  }

  // Sätter kontaktstatus — klick på samma chip tar bort valet
  const setContact = (memberId: string, contact: ContactStatus) => {
    setContacts((prev) => {
      const next = { ...prev }
      if (next[memberId] === contact) delete next[memberId]
      else next[memberId] = contact
      return next
    })
  }

  // Räknar hur många som är närvarande respektive frånvarande
  const presentCount = Object.values(marks).filter((s) => s === "present").length
  const absentCount = Object.values(marks).filter((s) => s === "absent").length

  // Sparar — bygger Attendance-posterna via use-case:et (ren affärslogik)
  const handleSave = () => {
    const records = buildAttendanceRecords({
      serviceId: service.id,
      members,
      marks,
      reasons,
      contacts,
    })
    // Sparar både anteckningen och närvaron
    onSaveNote(note)
    onSave(records)
  }

  return (
    // Backdrop — klick utanför stänger modalen
    <FocusTrap focusTrapOptions={{ returnFocusOnDeactivate: true, escapeDeactivates: false }}>
      <div onClick={onClose} className="modal-backdrop">
        {/* Själva modalen — stopPropagation förhindrar att klick stänger */}
        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="modal-panel max-w-md w-full p-6 max-h-[90vh] flex flex-col"
        >
          {/* Rubrik-rad med stäng-knapp */}
          <div className="flex items-start justify-between mb-1">
            <h2 id="modal-title" className="text-xl font-bold text-strong">
              {service.title}
            </h2>
            <ModalCloseButton onClose={onClose} />
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
                <li key={member.id} className="py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-strong">{member.name}</span>
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
                  </div>

                  {/* Orsak + kontaktstatus visas bara för frånvarande medlemmar */}
                  {status === "absent" && (
                    <div className="mt-2 flex flex-col gap-2">
                      {/* Orsak till frånvaron */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-faint w-16 flex-shrink-0">
                          {t("attendance.reasonLabel")}
                        </span>
                        {reasonValues.map((value) => (
                          <button
                            key={value}
                            onClick={() => setReason(member.id, value)}
                            className={
                              chipBase + (reasons[member.id] === value ? chipActive : chipInactive)
                            }
                          >
                            {t("attendance.reasons." + value)}
                          </button>
                        ))}
                      </div>
                      {/* Kontaktstatus för den frånvarande */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-faint w-16 flex-shrink-0">
                          {t("attendance.contactLabel")}
                        </span>
                        {contactOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setContact(member.id, option.value)}
                            className={
                              chipBase +
                              (contacts[member.id] === option.value ? chipActive : chipInactive)
                            }
                          >
                            {t("priority.status." + option.labelKey)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Knappar */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
            <button onClick={onClose} className="flex-1 px-4 py-2 btn-secondary text-soft">
              {t("form.cancel")}
            </button>
            <button onClick={handleSave} className="flex-1 px-4 py-2 btn-primary">
              {t("attendance.save")}
            </button>
          </div>
        </div>
      </div>
    </FocusTrap>
  )
}
