import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getSupabaseUrl() {
  if (!rawSupabaseUrl) {
    return "https://placeholder.supabase.co";
  }

  try {
    const parsed = new URL(rawSupabaseUrl);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return rawSupabaseUrl;
    }
  } catch {
    // fall through to placeholder
  }

  console.warn("Invalid NEXT_PUBLIC_SUPABASE_URL. Falling back to placeholder URL.");
  return "https://placeholder.supabase.co";
}

if (!rawSupabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables. Database features will fail.");
}

export const supabase = createClient(
  getSupabaseUrl(),
  supabaseAnonKey || "placeholder-key"
);
