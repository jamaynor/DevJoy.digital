import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

// Use environment variables if available, otherwise use the provided values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bwvybjqltqpyhtgfusgz.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dnlianFsdHFweWh0Z2Z1c2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MzI4NjUsImV4cCI6MjA2MjMwODg2NX0.hwVPsb1zbHDaM75IJkbOqMW0ciKGqmgu4UoqjxUy57w"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
