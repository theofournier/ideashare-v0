"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { UserCircle, PlusCircle, Home, Lightbulb, LogIn, LogOut, Settings, Search } from "lucide-react"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/supabase/auth-context"
import { signOut } from "@/lib/supabase/actions"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await signOut()
  }

  // Mock admin check - in a real app, this would check if the user has admin privileges
  const isAdmin = user?.email?.includes("admin")

  if (!mounted || isLoading) {
    return null
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm">
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

          <Link href="/browse">
            <Button variant={pathname === "/browse" ? "default" : "ghost"} size="sm">
              <Search className="mr-2 h-4 w-4" />
              Browse
            </Button>
          </Link>

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
                      <AvatarImage
                        src={profile?.avatar_url || "/placeholder.svg"}
                        alt={profile?.full_name || user.email || ""}
                      />
                      <AvatarFallback>{profile?.full_name?.[0] || user.email?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{profile?.full_name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>

                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <Link href="/admin">
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
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

          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
