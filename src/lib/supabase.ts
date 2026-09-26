import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://scciunfguwrerkohzrpu.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

export function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}
