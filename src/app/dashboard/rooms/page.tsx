import { createClient } from "@/utils/supabase/server"
import { RoomManager } from "./room-manager"

export default async function RoomsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Accountability Rooms</h1>
        <p className="text-muted-foreground">Share your progress with others securely. You control exactly what they see.</p>
      </div>

      <RoomManager initialRooms={rooms || []} />
    </div>
  )
}
