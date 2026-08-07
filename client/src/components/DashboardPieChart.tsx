// DashboardPieChart — återanvändbart cirkeldiagram med klickbar legend
// Klick på ett segment (eller legend-rad) anropar onSliceClick med segmentets nyckel
// Legenden fungerar som tangentbords- och skärmläsar-vänligt alternativ till cirkeln
//
// Används av: MemberDistributionCard (samma komponent kan visa fler fördelningar)
// Bygger på: Recharts och chartColors

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { chartColor } from "../utils/chartColors"
import { Card } from "./Card"

// Ett segment: nyckel (för klick/filter), etikett (visas) och värde (antal)
export interface PieSlice {
  key: string
  label: string
  value: number
}

// Formen på datan Recharts skickar till den egna tooltip-komponenten
interface TooltipData {
  active?: boolean
  payload?: Array<{ payload: PieSlice }>
}

// Egen tooltip (tema-anpassad via surface-klasser)
function ChartTooltip({ active, payload }: TooltipData) {
  const slice = payload?.[0]?.payload
  if (!active || !slice) return null
  return (
    <div className="surface border rounded-xl px-3 py-1.5 shadow-sm text-sm">
      <span className="font-semibold text-strong">{slice.label}:</span>{" "}
      <span className="text-soft">{slice.value}</span>
    </div>
  )
}

interface Props {
  title: string
  data: PieSlice[]
  onSliceClick?: (key: string) => void
}

// Ritar cirkeldiagrammet med legend
// Tar emot title (rubrik), data (segmenten) och onSliceClick (klick på segment)
// Returnerar kortet som JSX
export function DashboardPieChart({ title, data, onSliceClick }: Props) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0)

  return (
    <Card title={title}>
      {total === 0 ? (
        <p className="text-sm text-faint italic">—</p>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Själva cirkeln */}
          <div className="w-40 h-40 shrink-0" role="img" aria-label={title}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={35}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {data.map((slice, index) => (
                    <Cell
                      key={slice.key}
                      fill={chartColor(index)}
                      className={onSliceClick ? "cursor-pointer focus:outline-none" : ""}
                      onClick={() => onSliceClick?.(slice.key)}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend — klickbar, tangentbords-nåbar (även skärmläsar-alternativ) */}
          <ul className="flex-1 w-full space-y-1">
            {data.map((slice, index) => (
              <li key={slice.key}>
                <button
                  onClick={() => onSliceClick?.(slice.key)}
                  className="w-full flex items-center justify-between gap-2 text-sm rounded-lg px-2 py-1 row-hover focus:outline-none focus:ring-2 focus:ring-amber-700"
                >
                  <span className="flex items-center gap-2 text-soft">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: chartColor(index) }}
                      aria-hidden="true"
                    />
                    {slice.label}
                  </span>
                  <span className="font-semibold text-strong">{slice.value}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
