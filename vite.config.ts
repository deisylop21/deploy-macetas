import path from "path"
// @ts-ignore
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import svgr from "@svgr/rollup";
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      exportType: 'named',
      svgoConfig: {
        multipass: true,
        plugins: [
          {
            name: 'removeViewBox',
            active: false
          }
        ]
      }
    }),
    tailwindcss()
  ],
  server: {
    port: 5174,
    strictPort: true,
    open: '/login'
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})