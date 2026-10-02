import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Flame, CheckCircle, LayoutDashboard, Users, Settings, Search, Bell, Moon, LogOut, FileText, Calendar, Activity, User } from "lucide-react"
import { MobileNav } from "./mobile-nav"
import { SidebarNav } from "./sidebar-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Use arbitrary colors to isolate dashboard theme
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#16161f] text-gray-900 dark:text-gray-100 font-sans">
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#1f1f2b] p-6">
        {/* Logo placeholder */}
        <div className="font-heading font-extrabold text-2xl tracking-tighter italic mb-8">
          ColdStreak
        </div>
        
        <SidebarNav />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-200 dark:border-white/5 bg-white/50 dark:bg-[#16161f]/50 backdrop-blur-md">
          <div className="flex-1 max-w-xl">
            <div className="relative flex items-center w-full h-12 rounded-full bg-gray-100 dark:bg-[#1f1f2b] px-4">
              <Search className="h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tap here to search" 
                className="w-full bg-transparent border-none outline-none px-4 text-sm text-gray-700 dark:text-gray-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-6">
            <Link href="/dashboard/check-in" className="relative p-3 rounded-full bg-gray-100 dark:bg-[#1f1f2b] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors" title="Check In">
              <FileText className="h-5 w-5" />
            </Link>

          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
