"use client"

import type React from "react"

import { useState } from "react"
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

export default function SignupPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Sign up with email and password
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            home_org: "default", // Default organization
          },
        },
      })

      if (error) throw error

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase.from("user_profiles").insert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phone,
          home_org: "default", // Default organization
        })

        if (profileError) throw profileError
      }

      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please check your email to verify your account.",
      })

      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: mapErrorMessage(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
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
        title: "Signup failed",
        description: mapErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  return (
    <SiteLayout>
      <div className="container py-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-center text-3xl font-bold">Create an Account</h1>

          <div className={`overflow-hidden rounded-lg border shadow-sm ${isDesktop ? "flex" : "block"}`}>
            {/* Sign Up Form */}
            <div className={`p-8 ${isDesktop ? "flex-1" : ""}`}>
              <h2 className="mb-6 text-2xl font-semibold">Sign Up</h2>

              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Phone Number</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </div>

            {/* Separator */}
            {isDesktop ? (
              <div className="flex items-center justify-center">
                <Separator orientation="vertical" className="h-auto" />
              </div>
            ) : (
              <Separator className="my-8" />
            )}

            {/* Social Sign Up */}
            <div className={`p-8 ${isDesktop ? "flex-1" : ""}`}>
              <h2 className="mb-6 text-2xl font-semibold">Quick Sign Up</h2>
              <p className="mb-6 text-muted-foreground">Create an account quickly using your Google account.</p>

              <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignup}>
                Sign up with Google
              </Button>

              <div className="mt-8">
                <p className="text-center text-sm text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <a href="/terms" className="underline hover:text-primary">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="underline hover:text-primary">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
