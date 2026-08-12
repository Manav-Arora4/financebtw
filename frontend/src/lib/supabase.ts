import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const sanitizeSupabaseUrl = (url: string): string => {
  if (!url) return '';
  return url
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/auth\/v1\/?$/i, '')
    .replace(/\/+$/, '');
};

// Read env variables (supporting modern and legacy names with/without VITE_ prefix)
const rawUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  '';

const envKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  ''
).trim();

const envUrl = sanitizeSupabaseUrl(rawUrl);
const effectiveUrl = envUrl || 'https://placeholder.supabase.co';
const effectiveKey = envKey || 'placeholder-publishable-key';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    effectiveUrl &&
    effectiveKey &&
    effectiveUrl !== 'https://placeholder.supabase.co' &&
    effectiveKey !== 'placeholder-publishable-key'
  );
};

/**
 * Singleton Supabase Client for FinanceBtw Frontend.
 * Manages OAuth, session tokens, and realtime user state.
 */
export let supabase: SupabaseClient = createClient(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const reconfigureSupabase = (url: string, key: string): SupabaseClient => {
  const cleanUrl = sanitizeSupabaseUrl(url);
  const cleanKey = (key || '').trim();

  if (cleanUrl && cleanKey && cleanUrl !== 'https://placeholder.supabase.co') {
    supabase = createClient(cleanUrl, cleanKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabase;
};
