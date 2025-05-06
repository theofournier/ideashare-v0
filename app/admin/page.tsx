import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ideas, users } from "@/lib/mock-data"
import { reports, ideaReportCounts } from "@/lib/admin-data"
import { Users, Lightbulb, ThumbsUp, Flag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  // Calculate some stats for the dashboard
  const totalIdeas = ideas.length
  const totalUsers = users.length
  const totalVotes = ideas.reduce((sum, idea) => sum + idea.upvotes, 0)
  const averageVotesPerIdea = totalIdeas > 0 ? Math.round(totalVotes / totalIdeas) : 0
  const pendingReports = reports.filter((report) => report.status === "pending").length

  // Get ideas with reports
  const ideasWithReports = Object.keys(ideaReportCounts)
    .filter((ideaId) => ideaReportCounts[ideaId] > 0)
    .map((ideaId) => {
      const idea = ideas.find((i) => i.id === ideaId)
      return {
        id: ideaId,
        title: idea?.title || "Unknown Idea",
        reportCount: ideaReportCounts[ideaId],
      }
    })
    .sort((a, b) => b.reportCount - a.reportCount)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIdeas}</div>
            <p className="text-xs text-muted-foreground">Submitted ideas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes}</div>
            <p className="text-xs text-muted-foreground">Across all ideas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports}</div>
            <p className="text-xs text-muted-foreground">Reports awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seed Database</CardTitle>
            <CardDescription>Populate the database with sample project ideas</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/admin/seed" className="w-full">
              <Button className="w-full">Manage</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Reported Ideas</CardTitle>
            <Link href="/admin/reports">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {ideasWithReports.length > 0 ? (
              <div className="space-y-4">
                {ideasWithReports.map((idea) => (
                  <div key={idea.id} className="flex items-center justify-between">
                    <div className="truncate">
                      <Link href={`/idea/${idea.id}`} className="hover:underline">
                        {idea.title}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                        {idea.reportCount} {idea.reportCount === 1 ? "report" : "reports"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reported ideas.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="text-sm font-medium text-green-500">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API</span>
                <span className="text-sm font-medium text-green-500">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <span className="text-sm font-medium text-green-500">Online</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
