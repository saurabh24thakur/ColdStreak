import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, XCircle, Activity, CalendarDays } from "lucide-react"

export default async function ActivityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch all daily entries
  const { data: entries } = await supabase
    .from("daily_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  const typedEntries = entries || []

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <Activity className="h-8 w-8 text-purple-600" /> 
          Activity Log
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          A complete history of all your daily check-ins and checkpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {typedEntries.length === 0 ? (
          <Card className="bg-white dark:bg-[#1f1f2b] border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
              <CalendarDays className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <p>No activity found yet.</p>
              <p className="text-sm mt-1">Your check-ins will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          typedEntries.map((entry) => {
            const dateStr = new Date(entry.date).toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })
            
            const metricsArray = Object.entries(entry.metrics || {})
            const checkpoints = entry.checkpoints || []

            return (
              <Card key={entry.id} className="bg-white dark:bg-[#1f1f2b] shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Left: Date & Status */}
                  <div className="bg-purple-50 dark:bg-purple-900/10 p-6 flex flex-col justify-center items-start md:items-center md:w-64 border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/5">
                    <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
                      {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long' })}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(entry.date).getFullYear()}
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="p-6 flex-1 space-y-6">
                    {/* Metrics Row */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Core Habits</h4>
                      <div className="flex flex-wrap gap-3">
                        {metricsArray.map(([key, val]) => (
                          <div key={key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                            val ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}>
                            {val ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                            {key}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Checkpoints Row */}
                    {checkpoints.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Achievements</h4>
                        <ul className="space-y-2">
                          {checkpoints.map((cp: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                              {cp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
