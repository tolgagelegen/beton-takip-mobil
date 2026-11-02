import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://mhevvpzgzdfmomxdyqaq.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZXZ2cHpnemRmbW9teGR5cWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MTE5OTgsImV4cCI6MjEwNzM4Nzk5OH0.yE9KTzXtkLZ6frOdiH5gnoxo_DXSAVmvdr6yx2RCrQM';

function safeGetStorage(key) {
  try {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

// Supabase Bağlantı Bilgileri (Environment variable, localStorage veya varsayılan bulut adresi)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || safeGetStorage('supabase_url') || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || safeGetStorage('supabase_anon_key') || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

