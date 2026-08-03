// Contact — domän-entitet för en person som prästen bör kontakta
// Ligger i domain/ — en ren datastruktur, oberoende av React och externa API:er
// Används av: PriorityList och Attendance (ContactStatus)

// De lägen en kontakt kan ha
export type ContactStatus = "not-contacted" | "attempted" | "answered"

// En person i prioritetslistan
export type Contact = {
  id: string
  name: string
  reason: string
  status: ContactStatus
  phone: string
}
