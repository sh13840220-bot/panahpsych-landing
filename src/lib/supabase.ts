import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://acacyggmexbcbuggzwba.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYWN5Z2dtZXhiY2J1Z2d6d2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMDIxOTcsImV4cCI6MjEwMTY3ODE5N30.OKsIKwfIN7c9KhAfnUKhrntONeOWFNRANJ65HZnSNBc';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabasePublishableKey && 
  supabaseUrl !== 'https://placeholder.supabase.co'
);

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);


