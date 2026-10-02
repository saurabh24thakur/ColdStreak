"use client"

import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { Flame } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="hidden font-bold sm:inline-block">
              Winter Arc
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="#how-it-works"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              How it works
            </Link>
            <Link
              href="#features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile branding */}
            <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
              <Flame className="h-6 w-6 text-orange-500" />
              <span className="font-bold">Winter Arc</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
