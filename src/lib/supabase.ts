import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://acacyggmexbcbuggzwba.supabase.co';
const defaultKey = 'sb_publishable_m8C5qYIgCJWYshZQJODUqQ_j5oz6TI-';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || defaultKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabasePublishableKey && 
  supabaseUrl !== 'https://placeholder.supabase.co'
);

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

