import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { DEFAULT_PRODUCTION_API_URL } from './src/config/api-default-url'

const LOCAL_API_BASE = 'http://localhost:8787'
const LOCAL_ALIASES = new Set([LOCAL_API_BASE, 'http://127.0.0.1:8787'])

let devApiBaseCache: string | undefined

/** Prefer local API in dev; if `npm run dev` backend is down, use live (same default as production). */
async function resolveDevApiBaseUrl(mode: string): Promise<string> {
  if (devApiBaseCache !== undefined) return devApiBaseCache

  const env = loadEnv(mode, process.cwd(), '')
  const explicit = (env.VITE_API_URL ?? '').trim().replace(/\/$/, '')
  if (explicit && !LOCAL_ALIASES.has(explicit)) {
    devApiBaseCache = explicit
    return explicit
  }

  try {
    const r = await fetch(`${LOCAL_API_BASE}/health`, {
      signal: AbortSignal.timeout(1200),
    })
    if (r.ok) {
      devApiBaseCache = LOCAL_API_BASE
      return LOCAL_API_BASE
    }
  } catch {
    /* connection refused / timeout */
  }

  const fallback = DEFAULT_PRODUCTION_API_URL.replace(/\/$/, '')
  devApiBaseCache = fallback
  return fallback
}

/** Serves the same script the Cloudflare Worker uses so `getApiBaseUrl()` works in `vite dev`. */
function serveRuntimeConfig(mode: string) {
  return (
    req: { url?: string },
    res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (s: string) => void },
    next: () => void,
  ) => {
    const path = req.url?.split('?')[0] ?? ''
    if (path !== '/runtime-config.js') {
      next()
      return
    }
    void resolveDevApiBaseUrl(mode)
      .then((base) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        res.end(`window.__EM_SOLAR_API_BASE__=${JSON.stringify(base)};`)
      })
      .catch(() => {
        const emergency = DEFAULT_PRODUCTION_API_URL.replace(/\/$/, '')
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        res.end(`window.__EM_SOLAR_API_BASE__=${JSON.stringify(emergency)};`)
      })
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
  plugins: [
    runtimeConfigPlugin(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        id: '/',
        name: 'energymart.pk - Solar Energy E-Commerce',
        short_name: 'EnergyMart',
        description:
          "Pakistan's leading solar energy e-commerce platform. Quality solar panels, inverters, batteries, and accessories.",
        theme_color: '#0B2A4A',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webmanifest}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
