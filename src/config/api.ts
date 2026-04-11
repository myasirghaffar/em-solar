/** Deployed Worker (no trailing slash). Used when `VITE_API_URL` is unset in production builds. */
export const DEFAULT_PRODUCTION_API_URL =
  "https://em-solar-backend.ghaffaryasir28.workers.dev";

/** Base URL for em-solar-api (no trailing slash). */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined;
  const trimmed = (raw ?? "").replace(/\/$/, "");
  if (trimmed) return trimmed;
  // Local `npm run dev` without `.env`: assume Node API default port
  if (import.meta.env.DEV) return "http://localhost:8787";
  return DEFAULT_PRODUCTION_API_URL;
}
