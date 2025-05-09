import { EnvClientTest } from "./client-test"
import { supabase } from "@/lib/supabase/client"

export default function EnvTestPage() {
  // Server-side environment variables
  const serverEnvVars = {
    // Regular environment variables (only available on server)
    regularEnv: process.env.TEST_SERVER_VAR || "Not set",

    // Public environment variables (available on client and server)
    publicEnv: process.env.NEXT_PUBLIC_TEST_VAR || "Not set",

    // Supabase environment variables
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "Using fallback value",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set (value hidden)" : "Using fallback value",
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Environment Variables Test</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Server-Side Environment Variables</h2>
          <p className="text-sm text-muted-foreground mb-4">
            These variables are only accessible in Server Components, API routes, and server actions.
          </p>

          <div className="space-y-3">
            <div>
              <p className="font-medium">Regular Env Var (TEST_SERVER_VAR):</p>
              <p className={`text-sm ${serverEnvVars.regularEnv !== "Not set" ? "text-green-600" : "text-red-600"}`}>
                {serverEnvVars.regularEnv}
              </p>
            </div>

            <div>
              <p className="font-medium">Public Env Var (NEXT_PUBLIC_TEST_VAR):</p>
              <p className={`text-sm ${serverEnvVars.publicEnv !== "Not set" ? "text-green-600" : "text-red-600"}`}>
                {serverEnvVars.publicEnv}
              </p>
            </div>

            <div>
              <p className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</p>
              <p className={`text-sm ${serverEnvVars.supabaseUrl !== "Not set" ? "text-green-600" : "text-red-600"}`}>
                {serverEnvVars.supabaseUrl}
              </p>
            </div>

            <div>
              <p className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</p>
              <p
                className={`text-sm ${serverEnvVars.supabaseAnonKey !== "Not set" ? "text-green-600" : "text-red-600"}`}
              >
                {serverEnvVars.supabaseAnonKey}
              </p>
            </div>
          </div>
        </div>

        <EnvClientTest />
      </div>

      <div className="mt-8 p-6 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Supabase Connection Test</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Testing if the Supabase client is properly initialized with the environment variables or fallback values.
        </p>

        <div className="p-4 bg-gray-50 rounded-md">
          <p className="text-sm font-medium">Supabase Client Status:</p>
          <p className="text-sm text-green-600">
            {supabase ? "Supabase client initialized successfully" : "Failed to initialize Supabase client"}
          </p>
        </div>
      </div>

      <div className="mt-8 p-6 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">How Environment Variables Work in Next.js</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Regular environment variables (without <code>NEXT_PUBLIC_</code> prefix) are only available on the server.
          </li>
          <li>
            Environment variables with <code>NEXT_PUBLIC_</code> prefix are available on both client and server.
          </li>
          <li>
            Environment variables are loaded from <code>.env.local</code> file in development.
          </li>
          <li>On Vercel, environment variables are configured in the project settings.</li>
          <li>
            You can use <code>vercel env pull</code> to download environment variables to your local machine.
          </li>
        </ul>
      </div>
    </div>
  )
}
