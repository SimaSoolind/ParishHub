// Contact — beskriver en person som prästen bör kontakta
// Används av PriorityList och senare av backend

export type ContactStatus = "not-contacted" | "attempted" | "answered"

export type Contact = {
  id: string
  name: string
  reason: string
  status: ContactStatus
  phone: string
}