// MemberHistoryChart visar en medlems närvaro per gudstjänst som färgade staplar
// Grön = närvarande, röd = frånvarande. Visar även närvaro-procent som badge
// Axeltext följer temat via currentColor (ljust/mörkt)
//
// Används av: MemberDetail
// Bygger på: useMemberAttendance (data) och Recharts

import { CalendarCheck } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Badge } from "./Badge"
import { useMemberAttendance } from "../hooks/useMemberAttendance"
import type { MemberAttendancePoint } from "../use-cases/memberAttendance"

// Färger för närvarande/frånvarande — läsbara mot både ljus och mörk bakgrund
const PRESENT_COLOR = "#3D6B3B"
const ABSENT_COLOR = "#8B3A3A"

// Formen på datan Recharts skickar till den egna tooltip-komponenten
interface TooltipData {
  active?: boolean
  payload?: Array<{ payload: MemberAttendancePoint }>
}

// Egen tooltip som visar datum + närvarande/frånvarande, tema-anpassad
function ChartTooltip({ active, payload }: TooltipData) {
  const { t } = useTranslation()
  const point = payload?.[0]?.payload
  if (!active || !point) return null

  return (
    <div className="surface border rounded-xl px-3 py-2 shadow-sm text-sm">
      <div className="font-semibold text-strong">{point.label}</div>
      <div
        className={
          point.present ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
        }
      >
        {point.present ? t("memberHistory.present") : t("memberHistory.absent")}
      </div>
    </div>
  )
}

interface Props {
  memberId: string
}

// Ritar närvaro-historik-kortet för en medlem
// Tar emot memberId (vilken medlem historiken gäller)
// Returnerar kortet som JSX (eller tomt läge om ingen närvaro finns)
export function MemberHistoryChart({ memberId }: Props) {
  const { t } = useTranslation()

  const { points, rate } = useMemberAttendance(memberId)
  const isEmpty = points.length === 0

  // Staplar med jämn höjd — färgen visar närvarande/frånvarande
  const data = points.map((point) => ({ ...point, value: 1 }))

  // Sammanfattning för skärmläsare
  const summary = t("memberHistory.title") + ": " + t("memberHistory.rate", { rate })

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarCheck size={18} className="text-accent" />
          <h2 className="text-sm font-bold text-accent">{t("memberHistory.title")}</h2>
        </div>
        {!isEmpty && (
          <Badge color={rate >= 50 ? "green" : "red"}>{t("memberHistory.rate", { rate })}</Badge>
        )}
      </div>

      {isEmpty ? (
        <p className="text-sm text-faint italic">{t("memberHistory.empty")}</p>
      ) : (
        <div className="text-faint" role="img" aria-label={summary}>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart
              accessibilityLayer={false}
              data={data}
              margin={{ top: 4, right: 8, bottom: 0, left: -24 }}
            >
              <XAxis
                dataKey="label"
                tick={{ fill: "currentColor", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide domain={[0, 1]} />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={36}>
                {data.map((point) => (
                  <Cell key={point.serviceId} fill={point.present ? PRESENT_COLOR : ABSENT_COLOR} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
