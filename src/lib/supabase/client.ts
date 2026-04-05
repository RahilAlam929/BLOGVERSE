import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (typeof window === "undefined") {
      throw new Error("Missing Supabase ENV variables in client.");
    }

    throw new Error("Supabase is not configured.");
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}