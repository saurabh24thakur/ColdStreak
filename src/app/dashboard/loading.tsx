import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-sm font-medium animate-pulse">Loading dashboard...</p>
      </div>
    </div>
  )
}
