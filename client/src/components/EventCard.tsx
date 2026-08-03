// EventCard — visar en händelse i kalender-listan
// Används för både kyrko-händelser och livs-händelser
// Ikonen och färgen väljs baserat på kategori
//
// Används av: (ingen än — komponenten är förberedd men inte inkopplad)

import { Cake, Church, Heart, HandHeart, Users, Flame, Calendar } from "lucide-react"
import type { LifeEventCategory, ChurchEventCategory } from "../domain/event"

// Union type — antingen en LifeEvent-kategori eller ChurchEvent-kategori
type AnyCategory = LifeEventCategory | ChurchEventCategory

// Props som komponenten kräver
interface Props {
  title: string
  date: string
  category: AnyCategory
  notes?: string
}

// Konfiguration för varje kategori
// Kopplar kategori → ikon-komponent + färg-klass
// Ligger utanför komponenten för att inte återskapas vid rendering
const categoryConfig: Record<AnyCategory, { Icon: typeof Cake; color: string }> = {
  // Kyrko-händelser
  feast: { Icon: Church, color: "text-amber-700" },
  fast: { Icon: Flame, color: "text-stone-500" },

  // Livs-händelser
  baptism: { Icon: HandHeart, color: "text-blue-700" },
  wedding: { Icon: Heart, color: "text-pink-700" },
  funeral: { Icon: Users, color: "text-stone-600" },
  "sick-visit": { Icon: Users, color: "text-red-700" },
  other: { Icon: Calendar, color: "text-stone-500" },
}

// EventCard — visar en enda händelse som en rad
// Rad-struktur: [ikon] [titel + eventuell not] [datum]
export function EventCard({ title, date, category, notes }: Props) {
  // Hämtar rätt ikon och färg för kategorin
  const { Icon, color } = categoryConfig[category]

  return (
    <div className="flex items-center gap-3 py-3 border-b border-stone-100 last:border-b-0">
      {/* Ikon — visar direkt vilken typ av händelse det är */}
      <Icon size={20} className={color} />

      {/* Titel + eventuella anteckningar */}
      <div className="flex-1">
        <div className="font-semibold text-stone-800">{title}</div>
        {notes && <div className="text-xs text-stone-500 italic mt-0.5">{notes}</div>}
      </div>

      {/* Datum till höger */}
      <div className="text-sm text-stone-500 font-medium">{date}</div>
    </div>
  )
}
