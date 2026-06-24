import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

if (!isValidUrl(supabaseUrl) || supabaseAnonKey === "" || supabaseAnonKey.includes("key")) {
  console.warn(
    "Warning: Supabase environment variables are missing or invalid. Using safe placeholder variables for static build checks."
  );
  supabaseUrl = "https://placeholder.supabase.co";
  supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyRoleSI6ImFub24ifQ.placeholder";
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

