import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: [
      "expense-management-analytics-gilliam-597f.onrender.com",
      "expense-management-analytics-gilliam-roanoke.onrender.com",
      ".onrender.com"
    ]
  }
})
