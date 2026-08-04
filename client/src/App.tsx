// App — huvudkomponent med routing
// Layout omsluter alla sidor med gemensam header

import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { Layout } from "./components/Layout"
import { PageLoader } from "./components/PageLoader"
import { Dashboard } from "./pages/Dashboard"

// Sidor som lazy-laddas — bundlas i separata chunks och hämtas vid navigering
// Minskar startbundlen och förbättrar Time-to-Interactive
// Members/Calendar/Services har named exports — därför .then(m => ({ default: ... }))
const Members = lazy(() => import("./pages/Members").then((m) => ({ default: m.Members })))
const Calendar = lazy(() => import("./pages/Calendar").then((m) => ({ default: m.Calendar })))
const Services = lazy(() => import("./pages/Services").then((m) => ({ default: m.Services })))
const DesignPreview = lazy(() => import("./design/DesignPreview"))

// Sätter upp routing: Layout som ram med tre sidor under sig
// /design ligger utanför Layout — prototypen visas i helskärm
// Tar inga props och returnerar hela app-trädet som JSX
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* Toast-container — used by toast() everywhere (feedback vid spara/radera) */}
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          {/* Suspense för sidorna under Layout ligger i Layout (runt Outlet) */}
          {/* så header och main-landmärket står kvar medan en lazy-sida laddas */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="medlemmar" element={<Members />} />
            <Route path="kalender" element={<Calendar />} />
            <Route path="gudstjanster" element={<Services />} />
          </Route>
          {/* /design ligger utanför Layout — behöver därför en egen Suspense */}
          <Route
            path="/design"
            element={
              <Suspense fallback={<PageLoader />}>
                <DesignPreview />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
