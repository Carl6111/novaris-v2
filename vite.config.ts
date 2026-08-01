import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // three-vendor haengt nur an lazy Canvas-Komponenten; ohne diesen Filter
    // laedt der Browser die 260 kB gzip trotzdem sofort per modulepreload.
    modulePreload: {
      resolveDependencies: (_url, deps) =>
        deps.filter((dep) => !dep.includes('three-vendor')),
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/three') ||
            id.includes('node_modules/@react-three') ||
            id.includes('node_modules/postprocessing') ||
            id.includes('node_modules/maath')
          ) {
            return 'three-vendor'
          }
        },
      },
    },
  },
})
