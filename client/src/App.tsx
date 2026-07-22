// Test-komponent för att verifiera att Tailwind CSS fungerar
// Visar en kort välkomsttext med kyrko-appens accent-färg

function App() {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-200 max-w-md text-center">
        <h1 className="text-4xl font-bold text-amber-800 mb-4">
          ✝ ParishHub
        </h1>
        <p className="text-stone-600">
          Tailwind CSS fungerar! Redo att bygga.
        </p>
      </div>
    </div>
  )
}

export default App