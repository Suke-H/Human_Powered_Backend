/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// SupabaseのURLとキーを環境変数から取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URLまたはAnon Keyが環境変数に設定されていません");
}

// Supabaseクライアントを作成
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

