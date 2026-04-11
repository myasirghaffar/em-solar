import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Serves the same script the Cloudflare Worker uses so `getApiBaseUrl()` works in `vite dev`. */
function serveRuntimeConfig(mode: string) {
  return (req: { url?: string }, res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (s: string) => void }, next: () => void) => {
    const path = req.url?.split('?')[0] ?? ''
    if (path !== '/runtime-config.js') {
      next()
      return
    }
    const env = loadEnv(mode, process.cwd(), '')
    const fromEnv = (env.VITE_API_URL ?? '').trim().replace(/\/$/, '')
    const base = fromEnv || 'http://localhost:8787'
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
    res.end(`window.__EM_SOLAR_API_BASE__=${JSON.stringify(base)};`)
  }
}

function runtimeConfigPlugin(): Plugin {
  return {
    name: 'em-solar-runtime-config',
    configureServer(server) {
      server.middlewares.use(serveRuntimeConfig(server.config.mode))
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveRuntimeConfig(server.config.mode))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [runtimeConfigPlugin(), react(), tailwindcss()],
})
