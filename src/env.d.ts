/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare global {
  interface Window {
    /** Injected by `/runtime-config.js` on Cloudflare (Worker env `API_BASE_URL`). */
    __EM_SOLAR_API_BASE__?: string;
  }
}

export {};
