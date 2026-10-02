import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Flame, Trophy, CalendarDays, CheckCircle2, ShieldCheck, User } from "lucide-react"

export default async function PublicRoomPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const resolvedParams = await params
  const code = resolvedParams.code
  
  const supabase = await createClient()

  // Call the secure Postgres function to get data based on visibility settings
  const { data, error } = await supabase.rpc('get_public_room_data', {
    room_code_input: code
  })

  if (error || !data) {
    console.error("Error fetching room:", error)
    notFound()
  }

  const roomData = data as {
    owner_name: string
    total_days: number
    days_completed: number | null
    current_streak: number | null
    longest_streak: number | null
    last_checkpoints: string[] | null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 dark:bg-orange-950 rounded-full mb-2">
            <ShieldCheck className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold">Accountability Room</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <User className="h-4 w-4" /> {roomData.owner_name}'s Winter Arc
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {roomData.current_streak !== null && (
            <Card className="bg-orange-500/5 border-orange-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" /> Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{roomData.current_streak} Days</div>
              </CardContent>
            </Card>
          )}
          
          {roomData.longest_streak !== null && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" /> Longest Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{roomData.longest_streak} Days</div>
              </CardContent>
            </Card>
          )}

          {roomData.days_completed !== null && (
            <Card className="col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" /> Arc Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{roomData.days_completed} / {roomData.total_days} Days</div>
                <div className="w-full bg-muted rounded-full h-2 mt-3 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${Math.round((roomData.days_completed / roomData.total_days) * 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {roomData.last_checkpoints !== null && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-orange-500" /> 
                Latest Checkpoints
              </CardTitle>
              <CardDescription>
                AI-generated summary of their most recent check-in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {roomData.last_checkpoints.length > 0 ? (
                <ul className="space-y-3">
                  {roomData.last_checkpoints.map((cp, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="text-orange-500 font-bold">•</span>
                      <span className="text-foreground">{cp}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground italic">No checkpoints logged yet.</p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold text-foreground">Winter Arc</span>. Build your own discipline today.
          </p>
        </div>
      </div>
    </div>
  )
}
