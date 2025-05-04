import type React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, Users, Lightbulb, Settings, LogOut, Flag, Tag, Layers } from "lucide-react"
import { currentUser } from "@/lib/mock-data"

// Mock admin check - in a real app, this would check if the user has admin privileges
const isAdmin = true

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // In a real app, we would check if the user is authenticated and is an admin
  if (!isAdmin) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 border-r bg-background">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Admin Panel</span>
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/ideas"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Lightbulb className="h-4 w-4" />
                Ideas Management
              </Link>
            </li>
            <li>
              <Link
                href="/admin/reports"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Flag className="h-4 w-4" />
                Reports
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Users className="h-4 w-4" />
                User Management
              </Link>
            </li>
            <li>
              <Link
                href="/admin/tags"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Tag className="h-4 w-4" />
                Tags Management
              </Link>
            </li>
            <li>
              <Link
                href="/admin/tech-stacks"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Layers className="h-4 w-4" />
                Tech Stacks Management
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </li>
          </ul>

          <div className="mt-8 border-t pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="h-4 w-4" />
              Back to Site
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="ml-64 flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Logged in as {currentUser.name}</span>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
