import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client singleton.
 *
 * Uses the public anon key — safe for client-side usage.
 * Row-Level Security (RLS) should be configured in Supabase
 * if fine-grained access control is needed.
 *
 * Falls back to placeholder values at build time so the project
 * can compile without credentials (e.g. CI, first clone).
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
