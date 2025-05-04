"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { UserCircle, PlusCircle, Home, Lightbulb } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6" />
          <span className="text-xl font-bold">IdeaShare</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/">
            <Button variant={pathname === "/" ? "default" : "ghost"} size="sm">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/submit">
            <Button variant={pathname === "/submit" ? "default" : "ghost"} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit Idea
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant={pathname === "/profile" ? "default" : "ghost"} size="sm">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
