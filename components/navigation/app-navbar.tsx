"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, PanelLeft, PanelRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import UserAuthButton from "@/components/auth/user-auth-button"

interface AppNavbarProps {
  onToggleNav: () => void
  onToggleDetails: () => void
}

export default function AppNavbar({ onToggleNav, onToggleDetails }: AppNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [appHomeUrl, setAppHomeUrl] = useState("/dashboard")
  const pathname = usePathname()
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Store the initial URL as the app home
  useEffect(() => {
    if (pathname !== "/login" && pathname !== "/signup") {
      setAppHomeUrl(pathname)
    }
  }, [])

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (isDesktop) {
      setIsOpen(false)
    }
  }, [isDesktop])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          {isDesktop && (
            <Button variant="ghost" size="icon" onClick={onToggleNav} aria-label="Toggle navigation panel">
              <PanelLeft size={20} />
            </Button>
          )}

          <Link href={appHomeUrl} className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-md bg-primary"></div>
            <span className="hidden font-bold sm:inline-block">DevJoy Digital</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isDesktop && (
            <Button variant="ghost" size="icon" onClick={onToggleDetails} aria-label="Toggle details panel">
              <PanelRight size={20} />
            </Button>
          )}

          <UserAuthButton />

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            <span className="sr-only">Toggle menu</span>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="container lg:hidden">
          <nav className="flex flex-col space-y-4 py-4">
            <Button variant="ghost" className="justify-start" onClick={onToggleNav}>
              <PanelLeft className="mr-2" size={16} />
              Toggle Navigation Panel
            </Button>
            <Button variant="ghost" className="justify-start" onClick={onToggleDetails}>
              <PanelRight className="mr-2" size={16} />
              Toggle Details Panel
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
