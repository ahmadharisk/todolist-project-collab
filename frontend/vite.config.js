import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Request ke /api diteruskan ke backend, jadi tidak perlu atur CORS
  server: {
    proxy: { '/api': 'http://localhost:3001' },
  },
})
