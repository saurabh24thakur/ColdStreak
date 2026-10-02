"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect("/login")
  }

  const startDate = formData.get("start_date") as string
  const duration = parseInt(formData.get("duration") as string, 10)
  
  const goals = [
    formData.get("goal_1") as string,
    formData.get("goal_2") as string,
    formData.get("goal_3") as string,
  ].filter(g => g && g.trim().length > 0)

  const { data, error } = await supabase
    .from("users")
    .update({
      arc_start_date: startDate,
      arc_duration_days: duration,
      core_goals: goals.length > 0 ? goals : ["Workout", "Study", "Sleep"]
    })
    .eq("id", user.id)
    .select()

  if (error) {
    return redirect(`/onboarding?message=DB_Error: ${error.message}`)
  }
  
  if (!data || data.length === 0) {
    return redirect(`/onboarding?message=Account out of sync! Please log out, delete your account in Supabase, and sign up again.`)
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}
