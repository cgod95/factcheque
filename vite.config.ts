import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative base → the built site is portable: it works served from a root
  // domain (Vercel/Netlify) or a subpath (GitHub Pages) with no reconfiguration.
  // Safe because routing is hash-based, so there are no path-based deep links.
  base: './',
  server: {
    port: 5174,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
