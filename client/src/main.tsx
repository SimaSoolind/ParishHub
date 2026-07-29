// main — appens startpunkt
// Kopplar App till HTML-elementet #root och startar React
// QueryClientProvider ger hela appen tillgång till react-query (API-cachning)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
// CSS för react-big-calendar (kalender-utseende)
import 'react-big-calendar/lib/css/react-big-calendar.css'
import App from './App.tsx'

// En QueryClient håller cachen för alla API-anrop i appen
// QueryClientProvider gör den tillgänglig för alla komponenter (via useQuery)
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
