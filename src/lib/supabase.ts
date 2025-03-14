import { createClient } from '@supabase/supabase-js';

// Default values for Supabase configuration
const DEFAULT_SUPABASE_URL = 'https://fwgkgeexxpablhdynavt.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3Z2tnZWV4eHBhYmxoZHluYXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4Njk4MTcsImV4cCI6MjA1NzQ0NTgxN30.NSXJK3_ct7IGt3CuYVdG5wS5sZA7EW3l2-H4AepST4o';

// Get configuration values, using defaults if environment variables are not available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Debug environment variables
if (typeof window !== 'undefined') {
  console.log('Supabase URL:', supabaseUrl === DEFAULT_SUPABASE_URL ? 'Using default URL' : 'Using environment URL');
  console.log('Supabase Anon Key:', supabaseAnonKey === DEFAULT_SUPABASE_ANON_KEY ? 'Using default key' : 'Using environment key');
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export configuration status
export const isSupabaseConfigured = true;

// Debug configuration status (only in browser)
if (typeof window !== 'undefined') {
  console.log('Supabase Configuration:', {
    url: supabaseUrl === DEFAULT_SUPABASE_URL ? 'Using default URL' : 'Using environment URL',
    key: supabaseAnonKey === DEFAULT_SUPABASE_ANON_KEY ? 'Using default key' : 'Using environment key',
    isConfigured: isSupabaseConfigured
  });
} 