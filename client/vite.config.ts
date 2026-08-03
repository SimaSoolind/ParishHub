// Vite-konfiguration för ParishHub client
// Aktiverar React + Tailwind CSS v4
// test-blocket konfigurerar Vitest (enhetstester i jsdom-miljö)

/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    // Kortnamn för imports — matchar tsconfig.app.json paths
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@data': path.resolve(__dirname, './src/data'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@schemas': path.resolve(__dirname, './src/schemas'),
    },
  },
  test: {
    environment: 'jsdom',
  },
})