"use client"

import { useState } from "react"
import { submitDailyCheckin } from "./actions"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, Plus, X, CheckCircle2, ListTodo } from "lucide-react"

export function CheckInForm({ 
  hasEntryToday, 
  customGoals = [],
  initialMetrics = {},
  initialCheckpoints = [""]
}: { 
  hasEntryToday: boolean, 
  customGoals?: string[],
  initialMetrics?: Record<string, boolean>,
  initialCheckpoints?: string[]
}) {
  const [metrics, setMetrics] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = { ...initialMetrics }
    customGoals.forEach(g => { 
      if (initial[g] === undefined) initial[g] = false 
    })
    return Object.keys(initial).length > 0 ? initial : { Workout: false, Study: false, Sleep: false }
  })
  const [checkpoints, setCheckpoints] = useState<string[]>(initialCheckpoints.length > 0 ? initialCheckpoints : [""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(hasEntryToday)

  const handleMetricToggle = (key: string) => {
    setMetrics(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleCheckpointChange = (index: number, value: string) => {
    const newCheckpoints = [...checkpoints]
    newCheckpoints[index] = value
    setCheckpoints(newCheckpoints)
  }

  const addCheckpoint = () => {
    setCheckpoints([...checkpoints, ""])
  }

  const removeCheckpoint = (index: number) => {
    if (checkpoints.length > 1) {
      const newCheckpoints = checkpoints.filter((_, i) => i !== index)
      setCheckpoints(newCheckpoints)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Filter out empty checkpoints before submitting
      const validCheckpoints = checkpoints.filter(c => c.trim() !== "")
      const result = await submitDailyCheckin(metrics, validCheckpoints)
      
      if (result?.error) {
        alert("Database Error: " + result.error)
      } else {
        setIsSuccess(true)
      }
    } catch (error: any) {
      console.error(error)
      alert("Failed to submit check-in: " + (error.message || "Unknown error"))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto border-purple-500/20 bg-purple-500/5">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-purple-600" />
          <h2 className="text-2xl font-bold">Day Secured!</h2>
          <p className="text-muted-foreground">Your entry has been securely saved to your Arc.</p>
          <Button 
            variant="outline" 
            className="mt-6 border-purple-200 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            onClick={() => setIsSuccess(false)}
          >
            Edit Today's Check-in
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Today's Check-in</CardTitle>
        <CardDescription>Lock in your progress for the day. Be honest with yourself.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Core Metrics</h3>
            {Object.keys(metrics).map((key) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <Label htmlFor={`metric-${key}`} className="text-base cursor-pointer font-medium flex-1">
                  Did you {key.toLowerCase()} today?
                </Label>
                <Switch 
                  id={`metric-${key}`} 
                  checked={metrics[key]} 
                  onCheckedChange={() => handleMetricToggle(key)} 
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <h3 className="font-semibold text-lg">Daily Achievements</h3>
              <ListTodo className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-sm text-muted-foreground">
              Add your specific tasks, questions solved, or milestones for the day.
            </p>
            
            <div className="space-y-3 mt-4">
              {checkpoints.map((checkpoint, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={checkpoint}
                    onChange={(e) => handleCheckpointChange(index, e.target.value)}
                    placeholder="e.g. Solved 2 DSA questions"
                    className="flex-1 bg-gray-50 dark:bg-[#16161f] border border-gray-200 dark:border-white/5 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  {checkpoints.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeCheckpoint(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addCheckpoint}
                className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 mt-2 px-2"
              >
                <Plus className="h-4 w-4" /> Add another item
              </button>
            </div>
          </div>

        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white border-0"
            disabled={isSubmitting || (checkpoints.length === 1 && checkpoints[0].trim() === "")}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              "Submit Check-in"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
