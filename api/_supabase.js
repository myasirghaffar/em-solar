import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('[API] Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL/VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/VITE_SUPABASE_ANON_KEY must be set in Vercel project settings');
}

const supabase = url && key ? createClient(url, key) : null;

export default supabase;