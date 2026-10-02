import Link from "next/link"
import { signup } from "../login/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const resolvedParams = await searchParams;
  const message = resolvedParams?.message;

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-ground text-ink selection:bg-amber/20 font-sans">
      
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 h-[58px] flex items-center px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.15em] text-muted hover:text-amber transition-colors font-medium">
          <ArrowLeft className="w-3 h-3" /> Return to Portal
        </Link>
      </nav>

      <div className="w-full max-w-md p-8 bg-ground-secondary border border-hairline shadow-2xl relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal/5 rounded-tr-full pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-heading font-bold text-3xl tracking-tight">Initiate.</h1>
            <p className="text-[10.5px] uppercase tracking-[0.15em] text-muted leading-relaxed">
              Register your identity to access the archive.
            </p>
          </div>
          
          {message && (
            <div className="p-3 border border-red-900/50 bg-red-950/20 text-xs text-center text-red-400 font-medium">
              {message}
            </div>
          )}
          
          <form action={signup} className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-[10.5px] uppercase tracking-[0.15em] text-muted">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="bg-ground border-hairline h-12 focus-visible:ring-amber focus-visible:border-amber rounded-sm font-sans"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="email" className="text-[10.5px] uppercase tracking-[0.15em] text-muted">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-ground border-hairline h-12 focus-visible:ring-amber focus-visible:border-amber rounded-sm font-sans"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="password" className="text-[10.5px] uppercase tracking-[0.15em] text-muted">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-ground border-hairline h-12 focus-visible:ring-amber focus-visible:border-amber rounded-sm font-sans"
              />
            </div>
            
            <button type="submit" className="w-full h-12 mt-4 bg-ink text-ground font-medium text-[10.5px] uppercase tracking-[0.15em] hover:bg-amber transition-colors rounded-sm">
              Create Identity
            </button>
          </form>

          <div className="flex justify-center pt-4 border-t border-hairline">
            <div className="text-[10.5px] uppercase tracking-[0.15em] text-muted">
              Recognized?{" "}
              <Link href="/login" className="text-teal hover:text-amber transition-colors">
                Access Node
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
