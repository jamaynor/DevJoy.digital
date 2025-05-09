import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  // Use environment variables if available, otherwise use the provided values
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bwvybjqltqpyhtgfusgz.supabase.co"
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dnlianFsdHFweWh0Z2Z1c2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MzI4NjUsImV4cCI6MjA2MjMwODg2NX0.hwVPsb1zbHDaM75IJkbOqMW0ciKGqmgu4UoqjxUy57w"

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}
