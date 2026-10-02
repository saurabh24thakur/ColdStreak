import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ClientDashboard } from "./client-dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch User profile
  const { data: profile } = await supabase
    .from("users")
    .select("arc_start_date, arc_duration_days, name")
    .eq("id", user.id)
    .single()

  if (!profile?.arc_start_date) {
    redirect("/onboarding")
  }

  // Fetch all daily entries
  const { data: entries } = await supabase
    .from("daily_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  const typedEntries = entries || []

  // Calculate Stats
  const arcStartDate = new Date(profile.arc_start_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const daysCompleted = typedEntries.length
  const totalDays = profile.arc_duration_days || 90
  const completionPercentage = Math.round((daysCompleted / totalDays) * 100)

  // Calculate Streak
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  const sortedEntries = [...typedEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  let previousDate: Date | null = null

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date)
    entryDate.setHours(0, 0, 0, 0)

    if (!previousDate) {
      tempStreak = 1
    } else {
      const diffTime = Math.abs(entryDate.getTime() - previousDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        tempStreak += 1
      } else {
        tempStreak = 1
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak
    }
    
    currentStreak = tempStreak
    previousDate = entryDate
  }

  if (previousDate) {
    const diffTime = Math.abs(today.getTime() - previousDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays > 1) {
      currentStreak = 0
    }
  }

  return (
    <div className="w-full h-full">
      <ClientDashboard 
        user={{ name: profile.name, email: user.email }}
        entries={typedEntries} 
        stats={{
          currentStreak,
          longestStreak,
          daysCompleted,
          totalDays,
          completionPercentage
        }}
      />
    </div>
  )
}
