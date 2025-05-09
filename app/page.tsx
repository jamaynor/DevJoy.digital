"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import SiteLayout from "@/components/layouts/site-layout"

// Example success stories
const successStories = [
  {
    id: 1,
    title: "Automated Invoice Processing",
    description:
      "Reduced invoice processing time by 85% for a manufacturing company using AI-powered document analysis.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Customer Support Automation",
    description:
      "Implemented an AI chatbot that handles 70% of customer inquiries automatically, improving response times.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Predictive Maintenance System",
    description:
      "Developed an AI system that predicts equipment failures before they happen, reducing downtime by 40%.",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function HomePage() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 z-0 bg-dark-brand/70">
          <div className="h-full w-full bg-gradient-to-r from-primary-brand/80 to-dark-brand/80"></div>
        </div>

        <div className="container relative z-10 py-24 text-white md:py-32">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Unlock Your Business Potential with AI-Driven Automation
            </h1>
            <p className="mb-8 text-lg md:text-xl">
              DevJoy Digital helps businesses transform their core processes with intelligent automation solutions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary-brand hover:bg-primary-brand/90">
                <Link href="/contact">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link href="/blogs">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="bg-accent-brand py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Success Stories</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {successStories.map((story) => (
              <div key={story.id} className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 overflow-hidden rounded-md">
                  <div className="h-48 w-full bg-muted"></div>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{story.title}</h3>
                <p className="text-muted-foreground">{story.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild className="bg-secondary-brand hover:bg-secondary-brand/90">
              <Link href="/contact">Schedule a Consultation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">How We Can Help</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-6">
              <h3 className="mb-4 text-xl font-semibold">Process Automation</h3>
              <p className="text-muted-foreground">
                Automate repetitive tasks and workflows to free up your team for higher-value work.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-4 text-xl font-semibold">Intelligent Document Processing</h3>
              <p className="text-muted-foreground">
                Extract data from documents automatically with high accuracy using AI.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-4 text-xl font-semibold">Predictive Analytics</h3>
              <p className="text-muted-foreground">
                Leverage your data to predict trends and make better business decisions.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-4 text-xl font-semibold">Custom AI Solutions</h3>
              <p className="text-muted-foreground">
                Tailored AI applications designed specifically for your business needs.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-4 text-xl font-semibold">Integration Services</h3>
              <p className="text-muted-foreground">
                Seamlessly connect your existing systems with new AI-powered tools.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-4 text-xl font-semibold">AI Strategy Consulting</h3>
              <p className="text-muted-foreground">
                Get expert guidance on implementing AI throughout your organization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-brand py-16 text-white">
        <div className="container text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to Transform Your Business?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg">
            Contact us today to learn how our AI-powered automation solutions can help your business thrive.
          </p>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  )
}
