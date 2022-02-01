import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const base = command === "build" ? "./" : "./"
  return {
    base,
    plugins: [react()]
  }
})