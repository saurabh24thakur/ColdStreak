"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { buttonVariants } from "@/components/ui/button"
import { Menu, LayoutDashboard, CheckCircle, Users } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/check-in", label: "Today's Check-in", icon: CheckCircle },
    { href: "/dashboard/rooms", label: "My Rooms", icon: Users },
  ]

  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b">
      <h2 className="font-bold text-lg">Winter Arc</h2>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <Menu className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <div className="py-6">
            <h2 className="font-bold text-xl mb-6 px-4">Menu</h2>
            <nav className="flex flex-col space-y-2">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all hover:bg-muted font-medium ${
                      isActive ? "bg-muted text-orange-600 dark:text-orange-400" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" /> {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
