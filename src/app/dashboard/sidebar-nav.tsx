"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Users, Activity, User, Moon, Settings, LogOut, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function SidebarNav() {
  const pathname = usePathname()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch for theme toggle
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  const topLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/check-in", label: "Check-in", icon: FileText },
    { href: "/dashboard/rooms", label: "Rooms", icon: Users },
    { href: "/dashboard/activity", label: "Activity", icon: Activity },
  ]

  return (
    <div className="flex flex-col h-full justify-between pb-6">
      <nav className="space-y-2">
        {topLinks.map((link, index) => {
          const Icon = link.icon
          const isActive = pathname === link.href 

          return (
            <Link
              key={`${link.label}-${index}`}
              href={link.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-gray-100 dark:bg-white/5 text-purple-600 dark:text-purple-400" 
                  : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <Icon className="h-5 w-5" /> {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-2 pt-6 border-t border-gray-200 dark:border-white/5">
        <button 
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="w-full flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-left"
        >
          {isDark ? (
            <><Sun className="h-5 w-5" /> Lightmode</>
          ) : (
            <><Moon className="h-5 w-5" /> Darkmode</>
          )}
        </button>
        

        
        <Link 
          href="/login" 
          className="w-full flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500"
        >
          <LogOut className="h-5 w-5" /> Logout
        </Link>
      </div>
    </div>
  )
}
