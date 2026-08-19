import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ugfkkbyojvoezyzdjwzu.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_UkmrxycjrEIlid8P52j5Xw_hyLUdSoy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);