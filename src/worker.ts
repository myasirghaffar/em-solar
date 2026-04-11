/// <reference types="@cloudflare/workers-types" />
import { DEFAULT_PRODUCTION_API_URL } from './config/api-default-url';

export interface Env {
  ASSETS: Fetcher;
  /** Set in wrangler.jsonc [vars] or Cloudflare dashboard → Variables (plaintext). No trailing slash. */
  API_BASE_URL: string;
}

function resolveApiBase(env: Env): string {
  const fromEnv = (env.API_BASE_URL ?? '').trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  return DEFAULT_PRODUCTION_API_URL;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/runtime-config.js') {
      const base = resolveApiBase(env);
      const body = `window.__EM_SOLAR_API_BASE__=${JSON.stringify(base)};`;
      return new Response(body, {
        headers: {
          'content-type': 'application/javascript; charset=utf-8',
          'cache-control': 'no-store, max-age=0',
        },
      });
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
