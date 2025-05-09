import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Check if user profile exists, if not create one
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Check if user profile exists
      const { data: profile } = await supabase.from("user_profiles").select().eq("id", user.id).single()

      // If profile doesn't exist, create one
      if (!profile) {
        const userData = user.user_metadata

        await supabase.from("user_profiles").insert({
          id: user.id,
          email: user.email,
          first_name: userData.full_name ? userData.full_name.split(" ")[0] : "",
          last_name: userData.full_name ? userData.full_name.split(" ").slice(1).join(" ") : "",
          avatar_url: userData.avatar_url,
          home_org: "default", // Default organization
        })
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + "/dashboard")
}
