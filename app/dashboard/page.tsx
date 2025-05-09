import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import AppLayout from "@/components/layouts/app-layout"

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", session.user.id).single()

  const userRole = profile?.home_org || "User"

  return (
    <AppLayout userRole={userRole} statusMessage="Welcome to your dashboard">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Welcome, {profile?.first_name || "User"}</h2>
            <p className="text-muted-foreground">
              This is your personal dashboard where you can manage your account and access DevJoy Digital services.
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard/content" className="text-primary hover:underline">
                  Manage Content
                </a>
              </li>
              <li>
                <a href="/dashboard/settings" className="text-primary hover:underline">
                  Account Settings
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
            <p className="text-muted-foreground">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
