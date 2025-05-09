import { NextResponse } from "next/server"

export async function GET() {
  // Server-side environment variables in API routes
  const envVars = {
    // Regular environment variables (only available on server)
    regularEnv: process.env.TEST_SERVER_VAR || "Not set",

    // Public environment variables (available on client and server)
    publicEnv: process.env.NEXT_PUBLIC_TEST_VAR || "Not set",

    // Database URL example (sensitive, server-only)
    dbUrl: process.env.DATABASE_URL ? "Set (value hidden)" : "Not set",

    // API key example (sensitive, server-only)
    apiKey: process.env.API_KEY ? "Set (value hidden)" : "Not set",
  }

  return NextResponse.json({
    message: "Environment variables test in API route",
    envVars,
  })
}
