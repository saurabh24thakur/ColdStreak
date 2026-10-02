"use client"

import { useState } from "react"
import { createRoom, revokeRoom } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ExternalLink, Copy, Trash2, ShieldCheck, EyeOff, Loader2 } from "lucide-react"

type Room = {
  id: string
  code: string
  is_active: boolean
  visibility_settings: {
    show_streak: boolean
    show_completion: boolean
    show_checkpoints: boolean
  }
}

export function RoomManager({ initialRooms }: { initialRooms: Room[] }) {
  const [isCreating, setIsCreating] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  
  const activeRooms = initialRooms.filter(r => r.is_active)
  const pastRooms = initialRooms.filter(r => !r.is_active)

  const copyToClipboard = (code: string) => {
    const url = `${window.location.origin}/room/${code}`
    navigator.clipboard.writeText(url)
    alert("Copied link to clipboard!")
  }

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this room? Links will instantly stop working.")) return
    setRevokingId(id)
    try {
      await revokeRoom(id)
    } finally {
      setRevokingId(null)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Create Room Form */}
      <div>
        <Card className="border-orange-500/20">
          <CardHeader>
            <CardTitle>Create New Room</CardTitle>
            <CardDescription>Generate a secure, read-only link to share.</CardDescription>
          </CardHeader>
          <form action={async (formData) => {
            setIsCreating(true)
            try {
              await createRoom(formData)
            } finally {
              setIsCreating(false)
            }
          }}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show_streak">Show Streak</Label>
                    <p className="text-sm text-muted-foreground">Display your current and longest streak</p>
                  </div>
                  <Switch id="show_streak" name="show_streak" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show_completion">Show Completion %</Label>
                    <p className="text-sm text-muted-foreground">Display total days logged</p>
                  </div>
                  <Switch id="show_completion" name="show_completion" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show_checkpoints">Show Latest Checkpoints</Label>
                    <p className="text-sm text-muted-foreground">Display the AI summary of your last entry (never raw description)</p>
                  </div>
                  <Switch id="show_checkpoints" name="show_checkpoints" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Generate Secure Link
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Active Rooms List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Active Rooms</h3>
        {activeRooms.length === 0 ? (
          <div className="p-8 text-center border border-dashed rounded-lg text-muted-foreground">
            <EyeOff className="mx-auto h-8 w-8 mb-2 opacity-50" />
            No active rooms right now.
          </div>
        ) : (
          <div className="space-y-4">
            {activeRooms.map((room) => (
              <Card key={room.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-mono tracking-widest text-orange-500">
                        {room.code}
                      </CardTitle>
                      <CardDescription className="flex gap-2 mt-2">
                        {room.visibility_settings.show_streak && <span className="bg-muted px-2 py-0.5 rounded text-xs">Streak</span>}
                        {room.visibility_settings.show_completion && <span className="bg-muted px-2 py-0.5 rounded text-xs">Completion</span>}
                        {room.visibility_settings.show_checkpoints && <span className="bg-muted px-2 py-0.5 rounded text-xs">Checkpoints</span>}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(room.code)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardFooter className="pt-2 flex justify-between">
                  <Button variant="link" className="p-0 h-auto" onClick={() => window.open(`/room/${room.code}`, '_blank')}>
                    View Public Page <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleRevoke(room.id)} disabled={revokingId === room.id}>
                    {revokingId === room.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                    Revoke
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
