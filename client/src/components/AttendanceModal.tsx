// AttendanceModal — bocka av närvaro för en gudstjänst
// Visar alla medlemmar med knappar för Närvarande / Frånvarande
// Sparar närvaron tillbaka till föräldern (Services)
//
// Används av: Services.tsx

import { useState, useEffect } from "react"
import { X, Check, UserX } from "lucide-react"
import type { Member } from "../types/member"
import type { Service, Attendance, AttendanceStatus } from "../types/service"

interface Props {
  service: Service
  members: Member[]
  attendance: Attendance[] // befintlig närvaro för denna gudstjänst
  onSave: (records: Attendance[]) => void
  onClose: () => void
}

// Ritar närvaro-modalen med en rad per medlem
// Tar emot service, members, befintlig attendance samt onSave och onClose
// Returnerar modalen som JSX
export function AttendanceModal({ service, members, attendance, onSave, onClose }: Props) {
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
    onSave(records)
  }

  return (
    // Backdrop — klick utanför stänger modalen
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      {/* Själva modalen — stopPropagation förhindrar att klick stänger */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] flex flex-col"
      >
        {/* Rubrik-rad med stäng-knapp */}
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-xl font-bold text-stone-800">{service.title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-100"
            aria-label="Stäng"
          >
            <X size={20} className="text-stone-500" />
          </button>
        </div>
        <p className="text-sm text-stone-500 mb-4">
          {presentCount} närvarande · {absentCount} frånvarande
        </p>

        {/* Medlemslista med närvaro-knappar (scrollar om många) */}
        <ul className="overflow-y-auto divide-y divide-stone-200">
          {members.map((member) => {
            const status = marks[member.id]
            return (
              <li
                key={member.id}
                className="flex items-center justify-between py-2"
              >
                <span className="text-sm font-medium text-stone-800">
                  {member.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus(member.id, "present")}
                    className={
                      "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border " +
                      (status === "present"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-stone-500 border-stone-200 hover:border-green-600")
                    }
                  >
                    <Check size={14} />
                    Närv.
                  </button>
                  <button
                    onClick={() => setStatus(member.id, "absent")}
                    className={
                      "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border " +
                      (status === "absent"
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-stone-500 border-stone-200 hover:border-red-600")
                    }
                  >
                    <UserX size={14} />
                    Från.
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Knappar */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-stone-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-stone-200 rounded-xl font-semibold text-stone-600 hover:bg-stone-50"
          >
            Avbryt
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-amber-800 text-white rounded-xl font-semibold hover:bg-amber-900"
          >
            Spara närvaro
          </button>
        </div>
      </div>
    </div>
  )
}
