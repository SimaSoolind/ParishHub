// main — appens startpunkt
// Kopplar App till HTML-elementet #root och startar React
// QueryClientProvider ger hela appen tillgång till react-query (API-cachning)
import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import ReactDOM from "react-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
// CSS för react-big-calendar (kalender-utseende)
import "react-big-calendar/lib/css/react-big-calendar.css"
// Startar flerspråkigheten (svenska + arabiska)
import "./i18n"
// Kopplar in översatta Zod-valideringsfel (måste ske efter att i18n startat)
import { installZodErrorMap } from "./schemas/zodErrorMap"
import App from "./App.tsx"

installZodErrorMap()

// Aktiverar axe-core BARA i utvecklingsläge (aldrig i produktion)
// Skannar sidan och loggar a11y-brister i konsolen — fångar problem tidigt
if (import.meta.env.DEV) {
  import("@axe-core/react").then(({ default: axe }) => {
    axe(React, ReactDOM, 1000)
  })
}

// En QueryClient håller cachen för alla API-anrop i appen
// QueryClientProvider gör den tillgänglig för alla komponenter (via useQuery)
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
