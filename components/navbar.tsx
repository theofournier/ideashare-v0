"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { UserCircle, PlusCircle, Home, Lightbulb, LogIn } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar() {
  const pathname = usePathname()
  const { user, signOut, isLoading } = useSupabase()

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

          {!isLoading && (
            <>
              {user ? (
                <>
                  <Link href="/submit">
                    <Button variant={pathname === "/submit" ? "default" : "ghost"} size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Submit Idea
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.email || ""} />
                          <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline">{user.email?.split("@")[0]}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href="/profile">
                        <DropdownMenuItem>
                          <UserCircle className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link href="/login">
                  <Button variant={pathname === "/login" ? "default" : "ghost"} size="sm">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </>
          )}

          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
