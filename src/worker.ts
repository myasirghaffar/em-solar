/// <reference types="@cloudflare/workers-types" />
import { DEFAULT_PRODUCTION_API_URL } from './config/api-default-url';

/**
 * Browser → same-origin `/api/*` (no CORS). This Worker forwards to `API_BASE_URL` (em-solar-api).
 * Helps when cross-origin requests hit redirects (e.g. Access) and the browser reports a CORS error.
 */
export interface Env {
  ASSETS: Fetcher;
  /** Upstream em-solar-api base URL (no trailing slash). wrangler [vars] or dashboard plaintext. */
  API_BASE_URL: string;
}

function resolveApiBase(env: Env): string {
  const fromEnv = (env.API_BASE_URL ?? '').trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  return DEFAULT_PRODUCTION_API_URL;
}

async function proxyApiRequest(request: Request, env: Env): Promise<Response> {
  const apiBase = resolveApiBase(env);
  const url = new URL(request.url);
  const upstreamPath = url.pathname.replace(/^\/api/, '') || '/';
  const targetUrl = new URL(`${upstreamPath}${url.search}`, `${apiBase}/`);

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('cf-connecting-ip');

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'follow',
  };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
  }

  return fetch(targetUrl.toString(), init);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/runtime-config.js') {
      const body = 'window.__EM_SOLAR_API_BASE__=location.origin+"/api";';
      return new Response(body, {
        headers: {
          'content-type': 'application/javascript; charset=utf-8',
          'cache-control': 'no-store, max-age=0',
        },
      });
    }
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      try {
        return await proxyApiRequest(request, env);
      } catch {
        return new Response(
          JSON.stringify({
            ok: false,
            error: 'BAD_GATEWAY',
            message: 'Could not reach the API. Check API_BASE_URL and upstream availability.',
          }),
          { status: 502, headers: { 'content-type': 'application/json; charset=utf-8' } },
        );
      }
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
