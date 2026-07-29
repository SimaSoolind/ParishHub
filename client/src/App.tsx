// App — huvudkomponent med routing
// Layout omsluter alla sidor med gemensam header

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"
import { Dashboard } from "./pages/Dashboard"
import { Members } from "./pages/Members"
import { Calendar } from "./pages/Calendar"

// Sätter upp routing: Layout som ram med tre sidor under sig
// Tar inga props och returnerar hela app-trädet som JSX
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="medlemmar" element={<Members />} />
          <Route path="kalender" element={<Calendar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App