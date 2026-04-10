import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          reactVendor: ['react', 'react-dom', 'react-router-dom'],
          chartVendor: ['chart.js', 'react-chartjs-2'],
          uiVendor: ['react-icons', 'react-hot-toast'],
        },
      },
    },
  },
})
