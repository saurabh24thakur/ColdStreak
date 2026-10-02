import { completeOnboarding } from "./actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const resolvedParams = await searchParams;
  const message = resolvedParams?.message;
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-ground text-ink selection:bg-amber/20 font-sans">
      <div className="w-full max-w-lg p-8 bg-ground-secondary border border-hairline shadow-2xl relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-heading font-bold text-3xl tracking-tight">Configure Parameters.</h1>
            <p className="text-[10.5px] uppercase tracking-[0.15em] text-muted leading-relaxed">
              Set the boundaries of your Cold Streak.
            </p>
          </div>
          
          {message && (
            <div className="p-3 border border-red-900/50 bg-red-950/20 text-xs text-center text-red-400 font-medium">
              {message}
            </div>
          )}
          
          <form action={completeOnboarding} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="start_date" className="text-[10.5px] uppercase tracking-[0.15em] text-muted">Commencement Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  defaultValue={today}
                  required
                  className="bg-ground border-hairline h-12 focus-visible:ring-amber focus-visible:border-amber rounded-sm font-sans"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="duration" className="text-[10.5px] uppercase tracking-[0.15em] text-muted">Duration (Days)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="7"
                  max="365"
                  defaultValue="90"
                  required
                  className="bg-ground border-hairline h-12 focus-visible:ring-amber focus-visible:border-amber rounded-sm font-sans"
                />
              </div>
            </div>
            
            <div className="space-y-3 pt-6 border-t border-hairline">
              <Label className="text-[10.5px] uppercase tracking-[0.15em] text-muted">Core Daily Habits (Metrics)</Label>
              <div className="space-y-3">
                <Input
                  name="goal_1"
                  placeholder="e.g. Physical Training"
                  defaultValue="Physical Training"
                  required
                  className="bg-ground border-hairline h-10 focus-visible:ring-amber focus-visible:border-amber rounded-sm font-sans"
                />
                <Input
                  name="goal_2"
                  placeholder="e.g. Deep Work"
                  defaultValue="Deep Work"
                  required
                  className="bg-ground border-hairline h-10 focus-visible:ring-amber focus-visible:border-amber rounded-sm font-sans"
                />
                <Input
                  name="goal_3"
                  placeholder="e.g. Read 10 Pages"
                  defaultValue="Read 10 Pages"
                  required
                  className="bg-ground border-hairline h-10 focus-visible:ring-amber focus-visible:border-amber rounded-sm font-sans"
                />
              </div>
              <p className="text-[10.5px] text-muted-foreground pt-2">These will appear as toggles in your daily check-in.</p>
            </div>
            
            <button type="submit" className="w-full h-12 mt-4 bg-ink text-ground font-medium text-[10.5px] uppercase tracking-[0.15em] hover:bg-amber transition-colors rounded-sm">
              Initialize Streak
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
