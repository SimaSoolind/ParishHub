// Vite-konfiguration för ParishHub client
// Aktiverar React + Tailwind CSS v4
// test-blocket konfigurerar Vitest (enhetstester i jsdom-miljö)

/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    environment: 'jsdom',
  },
})