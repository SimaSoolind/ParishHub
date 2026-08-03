// App — huvudkomponent med routing
// Layout omsluter alla sidor med gemensam header

import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { Layout } from "./components/Layout"
import { Skeleton } from "./components/Skeleton"
import { Dashboard } from "./pages/Dashboard"

// Sidor som lazy-laddas — bundlas i separata chunks och hämtas vid navigering
// Minskar startbundlen och förbättrar Time-to-Interactive
// Members/Calendar/Services har named exports — därför .then(m => ({ default: ... }))
const Members = lazy(() => import("./pages/Members").then((m) => ({ default: m.Members })))
const Calendar = lazy(() => import("./pages/Calendar").then((m) => ({ default: m.Calendar })))
const Services = lazy(() => import("./pages/Services").then((m) => ({ default: m.Services })))
const DesignPreview = lazy(() => import("./design/DesignPreview"))

// Enkel laddningsindikator medan en lazy-laddad sida hämtas
// Återanvänder Skeleton-komponenten som redan finns i projektet
function PageLoader() {
  return (
    <div className="p-6 space-y-3" role="status" aria-label="Laddar sidan">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

// Sätter upp routing: Layout som ram med tre sidor under sig
// /design ligger utanför Layout — prototypen visas i helskärm
// Tar inga props och returnerar hela app-trädet som JSX
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* Toast-container — used by toast() everywhere (feedback vid spara/radera) */}
        <Toaster position="top-right" richColors closeButton />
        {/* Suspense visar fallback medan lazy-sidor laddas från nätverket */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="medlemmar" element={<Members />} />
              <Route path="kalender" element={<Calendar />} />
              <Route path="gudstjanster" element={<Services />} />
            </Route>
            <Route path="/design" element={<DesignPreview />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
