import { createClient } from '@supabase/supabase-js';

// Try to get from environment variables first
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback to hardcoded values if environment variables are not available
if (!supabaseUrl) {
  supabaseUrl = 'https://fwgkgeexxpablhdynavt.supabase.co';
  console.log('Using fallback Supabase URL');
}

if (!supabaseAnonKey) {
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3Z2tnZWV4eHBhYmxoZHluYXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4Njk4MTcsImV4cCI6MjA1NzQ0NTgxN30.NSXJK3_ct7IGt3CuYVdG5wS5sZA7EW3l2-H4AepST4o';
  console.log('Using fallback Supabase Anon Key');
}

// Debug environment variables
if (typeof window !== 'undefined') {
  console.log('Supabase URL:', supabaseUrl ? 'Present' : 'Missing');
  console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export a flag to check if we're using a real Supabase client
export const isSupabaseConfigured = true; // Always true now since we have fallbacks

// Debug configuration status
if (typeof window !== 'undefined') {
  console.log('Supabase Configured:', isSupabaseConfigured);
} 