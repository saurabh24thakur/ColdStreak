import { CheckInForm } from "./check-in-form"
import { createClient } from "@/utils/supabase/server"

export default async function CheckInPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let hasEntryToday = false
  let coreGoals = ["Workout", "Study", "Sleep"] // fallback
  let initialMetrics: Record<string, boolean> = {}
  let initialCheckpoints: string[] = [""]

  if (user) {
    // Fetch core goals from users table
    const { data: userData } = await supabase
      .from("users")
      .select("core_goals")
      .eq("id", user.id)
      .single()
      
    if (userData?.core_goals && userData.core_goals.length > 0) {
      coreGoals = userData.core_goals
    }

    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from("daily_entries")
      .select("id, metrics, checkpoints")
      .eq("user_id", user.id)
      .eq("date", today)
      .single()
      
    if (data) {
      hasEntryToday = true
      initialMetrics = data.metrics || {}
      initialCheckpoints = data.checkpoints || [""]
    }
  }

  return (
    <div className="py-6">
      <CheckInForm 
        hasEntryToday={hasEntryToday} 
        customGoals={coreGoals} 
        initialMetrics={initialMetrics}
        initialCheckpoints={initialCheckpoints}
      />
    </div>
  )
}
