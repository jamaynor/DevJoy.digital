"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import { mapErrorMessage } from "@/lib/error-messages"
import SiteLayout from "@/components/layouts/site-layout"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: mapErrorMessage(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: mapErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setResetSent(true)
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      })
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: mapErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  return (
    <SiteLayout>
      <div className="container py-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-center text-3xl font-bold">Login or Sign Up</h1>

          <div className={`overflow-hidden rounded-lg border shadow-sm ${isDesktop ? "flex" : "block"}`}>
            {/* Login Section */}
            <div className={`p-8 ${isDesktop ? "flex-1" : ""}`}>
              <h2 className="mb-6 text-2xl font-semibold">Login</h2>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="px-0 text-xs"
                      onClick={handleResetPassword}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {resetSent && (
                  <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                    Password reset email sent. Please check your inbox.
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button type="button" variant="outline" className="mt-4 w-full" onClick={handleGoogleLogin}>
                  Google
                </Button>
              </div>
            </div>

            {/* Separator */}
            {isDesktop ? (
              <div className="flex items-center justify-center">
                <Separator orientation="vertical" className="h-auto" />
              </div>
            ) : (
              <Separator className="my-8" />
            )}

            {/* Sign Up Section */}
            <div className={`p-8 ${isDesktop ? "flex-1" : ""}`}>
              <h2 className="mb-6 text-2xl font-semibold">Sign Up</h2>
              <p className="mb-6 text-muted-foreground">
                Don't have an account yet? Create one to get started with DevJoy Digital.
              </p>

              <Button asChild className="w-full">
                <Link href="/signup">Create an Account</Link>
              </Button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
                  </div>
                </div>

                <Button type="button" variant="outline" className="mt-4 w-full" onClick={handleGoogleLogin}>
                  Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
