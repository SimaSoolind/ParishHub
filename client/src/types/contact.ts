// Contact — beskriver en person som prasten bor kontakta
// Anvands av PriorityList och senare av backend

export type ContactStatus = "not-contacted" | "attempted" | "answered"

export type Contact = {
  id: string
  name: string
  reason: string
  status: ContactStatus
  phone: string
}