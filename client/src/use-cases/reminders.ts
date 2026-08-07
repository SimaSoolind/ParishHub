// reminders — ren logik för manuella påminnelser (ingen React)
// Plockar ut aktiva påminnelser och sorterar dem så de mest brådskande syns först
//
// Används av: ReminderCard

import type { Reminder } from "../domain/reminder"

// Plockar ut aktiva (ej klara) påminnelser, mest brådskande först
// Daterade påminnelser sorteras i datumordning (tidigast först) och läggs före odaterade
// Odaterade sorteras sist, äldst skapade först
// Tar en lista med påminnelser
// Returnerar en ny sorterad lista med bara de aktiva
export function getActiveReminders(reminders: Reminder[]): Reminder[] {
  return reminders
    .filter((reminder) => !reminder.done)
    .sort((first, second) => {
      // Har båda ett datum: tidigast datum först
      if (first.dueDate && second.dueDate) return first.dueDate.localeCompare(second.dueDate)
      // Bara en har datum: den daterade läggs först
      if (first.dueDate) return -1
      if (second.dueDate) return 1
      // Ingen har datum: äldst skapad först
      return first.createdAt.localeCompare(second.createdAt)
    })
}
