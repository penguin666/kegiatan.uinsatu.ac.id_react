import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1'
  },
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['@yudiel/react-qr-scanner'], // Tambahkan library yang bermasalah
  },
})
