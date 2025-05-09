"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronRight, Home, FileText, Settings, Users, BarChart } from "lucide-react"

interface NavigationTrayProps {
  expanded: boolean
}

export default function NavigationTray({ expanded }: NavigationTrayProps) {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Content", href: "/dashboard/content", icon: FileText },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-background transition-all duration-300 ease-in-out lg:relative",
        expanded ? "w-64" : "w-0 lg:w-16",
      )}
      style={{ top: "64px" }}
    >
      <nav className="flex flex-col space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="mr-2 h-5 w-5" />
              <span className={cn("flex-1", !expanded && "lg:hidden")}>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto p-2">
        <Link
          href="/"
          className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ChevronRight className="mr-2 h-5 w-5" />
          <span className={cn("flex-1", !expanded && "lg:hidden")}>Back to Site</span>
        </Link>
      </div>
    </div>
  )
}
