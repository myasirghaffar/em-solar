import { app } from '@/server/app';
import { getServerEnv } from '@/server/env';
import type { Env } from '@/server/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function resolveEnv(): Env | null {
  try {
    return getServerEnv();
  } catch (err) {
    console.error('[em-solar api] env bootstrap failed:', err);
    return null;
  }
}

async function handle(req: Request): Promise<Response> {
  const env = resolveEnv();
  if (!env) {
    return Response.json(
      {
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        message:
          'Server environment is not configured. Set DATABASE_URL, JWT_ACCESS_SECRET, and JWT_REFRESH_SECRET in Vercel project settings.',
        statusCode: 500,
      },
      { status: 500 },
    );
  }
  return app.fetch(req, env);
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const PUT = handle;
export const DELETE = handle;
export const OPTIONS = handle;
