// App — huvudkomponent med routing
// Layout omsluter alla sidor med gemensam header

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { Layout } from "./components/Layout"
import { Dashboard } from "./pages/Dashboard"
import { Members } from "./pages/Members"
import { Calendar } from "./pages/Calendar"
import { Services } from "./pages/Services"
import DesignPreview from "./design/DesignPreview"

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
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="medlemmar" element={<Members />} />
            <Route path="kalender" element={<Calendar />} />
            <Route path="gudstjanster" element={<Services />} />
          </Route>
          <Route path="/design" element={<DesignPreview />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
