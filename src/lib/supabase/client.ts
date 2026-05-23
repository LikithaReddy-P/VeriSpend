import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database.types";

let browserClient: SupabaseClient<Database> | null = null;

/** Browser Supabase client (singleton). */
export function createBrowserSupabase(): SupabaseClient<Database> {
  if (!browserClient) {
    browserClient = createClient<Database>(
      getSupabaseUrl(),
      getSupabaseAnonKey()
    );
  }
  return browserClient;
}
