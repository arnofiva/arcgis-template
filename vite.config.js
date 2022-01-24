import { defineConfig } from 'vite'

export default defineConfig(({ command }) => {
  const base = command === "build" ? "http://localhost/arcgis-boilerplate/dist/" : "./"
  return {
    base
  }
})