"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Bus } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  
  const routes = [
    {
      href: "/",
      label: "Route Finder",
      active: pathname === "/",
      description: "Find optimal routes with OSRM integration"
    },
    {
      href: "/algorithm",
      label: "Algorithm Analysis",
      active: pathname === "/algorithm",
      description: "Deep dive into pathfinding algorithms"
    },
    {
      href: "/documentation",
      label: "Documentation",
      active: pathname === "/documentation",
      description: "Complete guide and API reference"
    },
  ]

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Bus className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">TransJakarta Pathfinder</span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "default" : "ghost"}
              asChild
            >
              <Link href={route.href}>
                {route.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}