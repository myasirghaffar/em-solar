import { DEFAULT_PRODUCTION_API_URL } from './api-default-url';

export { DEFAULT_PRODUCTION_API_URL };

/** Base URL for em-solar-api (no trailing slash). */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const fromRuntime = (window.__EM_SOLAR_API_BASE__ ?? '').trim().replace(/\/$/, '');
    if (fromRuntime) return fromRuntime;
  }
  const raw = import.meta.env.VITE_API_URL as string | undefined;
  const trimmed = (raw ?? '').replace(/\/$/, '');
  if (trimmed) return trimmed;
  if (import.meta.env.DEV) return 'http://localhost:8787';
  return DEFAULT_PRODUCTION_API_URL;
}
