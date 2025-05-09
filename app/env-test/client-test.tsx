"use client"

export function EnvClientTest() {
  // Client-side environment variables
  // Only NEXT_PUBLIC_ prefixed variables are available
  const clientEnvVars = {
    // This will work because it has NEXT_PUBLIC_ prefix
    publicEnv: process.env.NEXT_PUBLIC_TEST_VAR || "Not set",

    // Supabase environment variables
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "Using fallback value",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set (value hidden)" : "Using fallback value",

    // These will NOT work on the client (will always be undefined)
    regularEnv: process.env.TEST_SERVER_VAR,
  }

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Client-Side Environment Variables</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Only variables prefixed with NEXT_PUBLIC_ are accessible in Client Components.
      </p>

      <div className="space-y-3">
        <div>
          <p className="font-medium">Public Env Var (NEXT_PUBLIC_TEST_VAR):</p>
          <p className={`text-sm ${clientEnvVars.publicEnv !== "Not set" ? "text-green-600" : "text-red-600"}`}>
            {clientEnvVars.publicEnv}
          </p>
        </div>

        <div>
          <p className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</p>
          <p className={`text-sm ${clientEnvVars.supabaseUrl !== "Not set" ? "text-green-600" : "text-red-600"}`}>
            {clientEnvVars.supabaseUrl}
          </p>
        </div>

        <div>
          <p className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</p>
          <p className={`text-sm ${clientEnvVars.supabaseAnonKey !== "Not set" ? "text-green-600" : "text-red-600"}`}>
            {clientEnvVars.supabaseAnonKey}
          </p>
        </div>

        <div>
          <p className="font-medium">Regular Env Var (TEST_SERVER_VAR):</p>
          <p className="text-sm text-red-600">
            {clientEnvVars.regularEnv === undefined ? "Not accessible on client" : clientEnvVars.regularEnv}
          </p>
        </div>
      </div>
    </div>
  )
}
