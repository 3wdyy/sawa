import { createBrowserClient } from "@supabase/ssr";

// Using loose typing until we generate proper types from Supabase CLI
// Run: npx supabase gen types typescript --project-id <id> > src/types/database.ts
export function createClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
