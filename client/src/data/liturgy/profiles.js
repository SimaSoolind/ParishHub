// profiles.js
// Statisk data för profilväljaren
// Importeras av ProfileSelectorPage och ProfileCard

import { Sparkles, Compass, Flame, GraduationCap } from 'lucide-react'

export const PROFILES = [
  {
    id: 'junior',
    title: 'Junior',
    description: 'Lekfullt och tryggt — för de yngsta utforskarna.',
    icon: Sparkles,
    accent: '#C5A059',
  },
  {
    id: 'ungdom',
    title: 'Ungdom',
    description: 'Modernt, aktuellt och engagerande för unga vuxna.',
    icon: Compass,
    accent: '#916D45',
  },
  {
    id: 'ny-i-tron',
    title: 'Ny i tron',
    description: 'Hoppfullt och pedagogiskt — perfekt för nybörjare.',
    icon: Flame,
    accent: '#C5A059',
  },
  {
    id: 'fordjupning',
    title: 'Fördjupning',
    description: 'Traditionellt och fokuserat studium för den erfarne.',
    icon: GraduationCap,
    accent: '#916D45',
  },
]