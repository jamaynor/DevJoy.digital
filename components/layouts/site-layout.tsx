"use client"

import type { ReactNode } from "react"
import SiteNavbar from "@/components/navigation/site-navbar"
import SiteFooter from "@/components/navigation/site-footer"
import ScrollToTopButton from "@/components/ui/scroll-to-top-button"
import { useMediaQuery } from "@/hooks/use-media-query"

interface SiteLayoutProps {
  children: ReactNode
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="flex-1">{children}</main>
      {!isDesktop && <ScrollToTopButton />}
      <SiteFooter />
    </div>
  )
}
