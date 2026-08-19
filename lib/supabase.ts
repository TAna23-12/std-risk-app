import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// ป้องกัน Error กรณี URL ไม่ถูกต้องช่วง Next.js Build
const supabaseUrl = rawUrl.startsWith('http')
  ? rawUrl
  : 'https://ugfkkbyojvoezyzdjwzu.supabase.co';

const supabaseAnonKey = rawKey.length > 0
  ? rawKey
  : 'sb_publishable_UkmrxycjrEIlid8P52j5Xw_hyLUdSoy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);