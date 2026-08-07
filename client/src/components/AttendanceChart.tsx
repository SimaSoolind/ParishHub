// AttendanceChart visar närvaron för de senaste gudstjänsterna som ett stapeldiagram
// Använder Recharts. Axeltext och rutnät följer temat via currentColor (ljust/mörkt)
// Staplarna använder appens gröna accent (närvarande = positivt)
//
// Används av: Dashboard.tsx
// Bygger på: AttendancePoint (från use-caset getAttendanceTrend)

import { BarChart2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { AttendancePoint } from "../use-cases/dashboardStats"

interface Props {
  points: AttendancePoint[]
}

// Grön färg för staplarna — läsbar mot både ljus och mörk bakgrund
const BAR_COLOR = "#4d7c4a"

// Formen på datan Recharts skickar till den egna tooltip-komponenten
interface TooltipData {
  active?: boolean
  payload?: Array<{ payload: AttendancePoint }>
}

// Egen tooltip som följer temat via surface-klasserna (istället för Recharts vita standard)
// Visar datum och "X av Y närvarande" för den stapel muspekaren är över
function ChartTooltip({ active, payload }: TooltipData) {
  const { t } = useTranslation()
  const point = payload?.[0]?.payload
  if (!active || !point) return null

  return (
    <div className="surface border rounded-xl px-3 py-2 shadow-sm text-sm">
      <div className="font-semibold text-strong">{point.label}</div>
      <div className="text-faint">
        {t("attendanceChart.tooltip", { present: point.present, total: point.total })}
      </div>
    </div>
  )
}

// Ritar närvaro-grafen, eller ett tomt tillstånd om ingen närvaro finns
// Tar emot en lista med AttendancePoint som prop
// Returnerar kortet med grafen som JSX
export function AttendanceChart({ points }: Props) {
  const { t } = useTranslation()

  // Sant när ingen gudstjänst har avprickad närvaro
  const isEmpty = points.length === 0

  // Sammanfattning för skärmläsare (SVG-grafen är annars svår att läsa upp)
  const summary =
    t("attendanceChart.title") +
    ": " +
    points.map((point) => `${point.label} ${point.present}/${point.total}`).join(", ")

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={18} className="text-accent" />
        <h2 className="text-sm font-bold text-accent">{t("attendanceChart.title")}</h2>
      </div>

      {isEmpty ? (
        <p className="text-sm text-faint italic">{t("attendanceChart.empty")}</p>
      ) : (
        <div className="text-faint" role="img" aria-label={summary}>
          <ResponsiveContainer width="100%" height={220}>
            {/* accessibilityLayer av: wrappern ger redan role=img + sammanfattning för skärmläsare */}
            <BarChart
              accessibilityLayer={false}
              data={points}
              margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            >
              <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.15} />
              <XAxis
                dataKey="label"
                tick={{ fill: "currentColor", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "currentColor", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
              />
              <Bar dataKey="present" fill={BAR_COLOR} radius={[6, 6, 0, 0]} maxBarSize={56} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
