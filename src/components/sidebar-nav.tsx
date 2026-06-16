"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Settings, CreditCard, Users, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

export function SidebarNav() {
  const pathname = usePathname()

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Team", href: "/dashboard/team", icon: Users },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <>
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group",
              isActive 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <div className={cn(
              "p-1 rounded-md transition-colors",
              isActive 
                ? "text-primary-foreground" 
                : "group-hover:bg-primary/10 group-hover:text-primary"
            )}>
              <Icon className="h-4 w-4" />
            </div>
            {link.name}
          </Link>
        )
      })}
    </>
  )
}
