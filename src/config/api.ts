/**
 * Storefront API base (no trailing slash).
 * Always same-origin `/api` — the Hono backend lives in this Next.js app.
 * Never use Railway / external hosts (ignore env + runtime overrides).
 */
export function getApiBaseUrl(): string {
  return "/api";
}
