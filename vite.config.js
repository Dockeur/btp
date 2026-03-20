import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from "path"

export default defineConfig(({ mode }) => {  
  const env = loadEnv(mode, process.cwd(), '')  

  return {
    plugins: [
      react(),
      tsconfigPaths()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/storage': {
          target: env.VITE_NGROK_URL,
          changeOrigin: true,
          secure: false,
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      }
    }
  }
})