// Layout — gemensam ram runt alla sidor
// Innehåller header som visas på varje sida
// Outlet-elementet är där aktuell sida sätts in

import { Outlet, Link } from "react-router-dom"

export function Layout() {
  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header — samma på alla sidor */}
      <header className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-amber-800">
            ✝ ParishHub
          </Link>

          <nav className="flex gap-4 text-sm text-stone-600">
            <Link to="/" className="hover:text-amber-800">
              Dashboard
            </Link>
            <Link to="/medlemmar" className="hover:text-amber-800">
              Medlemmar
            </Link>
            <Link to="/kalender" className="hover:text-amber-800">
              Kalender
            </Link>
          </nav>
        </div>
      </header>

      {/* Här sätts den aktuella sidan in */}
      <main className="max-w-4xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}