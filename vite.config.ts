import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
  proxy: {
    "/nhl": {
      target: "https://statsapi.web.nhl.com",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/nhl/, ""),
    },
  },
}
})