"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function createRoom(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const showStreak = formData.get("show_streak") === "on"
  const showCompletion = formData.get("show_completion") === "on"
  const showCheckpoints = formData.get("show_checkpoints") === "on"

  const code = generateRoomCode()

  const { error } = await supabase.from("rooms").insert({
    owner_id: user.id,
    code,
    is_active: true,
    visibility_settings: {
      show_streak: showStreak,
      show_completion: showCompletion,
      show_checkpoints: showCheckpoints
    }
  })

  if (error) {
    console.error("Failed to create room", error)
    throw new Error("Failed to create room")
  }

  revalidatePath("/dashboard/rooms")
  redirect("/dashboard/rooms")
}

export async function revokeRoom(roomId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("rooms")
    .update({ is_active: false })
    .eq("id", roomId)
    .eq("owner_id", user.id)

  if (error) throw new Error("Failed to revoke room")

  revalidatePath("/dashboard/rooms")
}
