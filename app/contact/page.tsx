"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import { mapErrorMessage } from "@/lib/error-messages"
import SiteLayout from "@/components/layouts/site-layout"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name,
        email,
        phone: phone || null,
        message,
        status: "new",
        owning_org: "default", // Default organization
      })

      if (error) throw error

      toast({
        title: "Message sent",
        description: "Thank you for contacting us. We'll get back to you soon.",
      })

      // Reset form
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: mapErrorMessage(error),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SiteLayout>
      <div className="container py-12">
        <h1 className="mb-8 text-center text-3xl font-bold">Contact Us</h1>

        <div
          className={`mx-auto max-w-5xl overflow-hidden rounded-lg border shadow-sm ${isDesktop ? "flex" : "block"}`}
        >
          {/* Contact Form */}
          <div className={`p-8 ${isDesktop ? "flex-1" : ""}`}>
            <h2 className="mb-6 text-2xl font-semibold">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Calendly Widget */}
          <div className={`${isDesktop ? "flex-1" : ""}`}>
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/jamaynor/15min"
              style={{ minWidth: "320px", height: "700px" }}
            ></div>
            <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
