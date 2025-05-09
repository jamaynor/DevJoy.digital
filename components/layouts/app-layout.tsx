"use client"

import { type ReactNode, useState } from "react"
import AppNavbar from "@/components/navigation/app-navbar"
import NavigationTray from "@/components/navigation/navigation-tray"
import DetailsTray from "@/components/navigation/details-tray"
import StatusRibbon from "@/components/navigation/status-ribbon"
import ScrollToTopButton from "@/components/ui/scroll-to-top-button"
import { useMediaQuery } from "@/hooks/use-media-query"

interface AppLayoutProps {
  children: ReactNode
  userRole?: string
  statusMessage?: string
}

export default function AppLayout({ children, userRole = "", statusMessage = "" }: AppLayoutProps) {
  const [navExpanded, setNavExpanded] = useState(false)
  const [detailsExpanded, setDetailsExpanded] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar
        onToggleNav={() => setNavExpanded(!navExpanded)}
        onToggleDetails={() => setDetailsExpanded(!detailsExpanded)}
      />

      <div className="flex flex-1">
        <NavigationTray expanded={navExpanded} />

        <main className="flex-1 p-4">{children}</main>

        <DetailsTray expanded={detailsExpanded} />
      </div>

      {!isDesktop && <ScrollToTopButton />}

      <StatusRibbon userRole={userRole} statusMessage={statusMessage} />
    </div>
  )
}
