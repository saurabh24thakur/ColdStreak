"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function submitDailyCheckin(
  metrics: Record<string, boolean | number>,
  checkpoints: string[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const date = new Date().toISOString().split('T')[0] // local 'today' simplified
  
  // Clean empty checkpoints
  const validCheckpoints = checkpoints.filter(c => c.trim().length > 0)

  // Avoid upsert RLS bugs by checking if row exists first
  const { data: existing } = await supabase
    .from("daily_entries")
    .select("id")
    .eq("user_id", user.id)
    .eq("date", date)
    .single()

  let error;
  if (existing) {
    const { error: updateErr } = await supabase
      .from("daily_entries")
      .update({
        metrics,
        checkpoints: validCheckpoints,
        status: "completed"
      })
      .eq("id", existing.id)
    error = updateErr
  } else {
    const { error: insertErr } = await supabase
      .from("daily_entries")
      .insert({
        user_id: user.id,
        date,
        metrics,
        checkpoints: validCheckpoints,
        status: "completed"
      })
    error = insertErr
  }

  if (error) {
    console.error("Supabase Error:", error)
    return { error: error.message || JSON.stringify(error) }
  }

  revalidatePath("/dashboard")
  return { success: true }
}
