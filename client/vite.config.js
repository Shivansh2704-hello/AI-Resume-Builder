import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log('Forcing Vite restart to rebuild Tailwind cache...');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
