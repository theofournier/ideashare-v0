import { ideas, users, type Idea, type User } from "@/lib/mock-data"

// Extend the Idea type to include status
export type IdeaStatus = "published" | "hidden" | "pending" | "rejected"

export type ExtendedIdea = Idea & {
  status: IdeaStatus
  reportCount?: number
}

// Extend the User type to include status
export type UserStatus = "active" | "suspended" | "banned"

export type ExtendedUser = User & {
  status: UserStatus
  ideasCount: number
}

// Report types
export type ReportReason = "inappropriate" | "spam" | "offensive" | "copyright" | "misinformation" | "other"

export type Report = {
  id: string
  ideaId: string
  userId: string
  reason: ReportReason
  description: string
  createdAt: string
  status: "pending" | "reviewed" | "dismissed"
}

// Create extended ideas with status
export const extendedIdeas: ExtendedIdea[] = ideas.map((idea) => ({
  ...idea,
  status: Math.random() > 0.2 ? "published" : Math.random() > 0.5 ? "hidden" : "pending",
}))

// Create extended users with status and ideas count
export const extendedUsers: ExtendedUser[] = users.map((user) => ({
  ...user,
  status: Math.random() > 0.2 ? "active" : "suspended",
  ideasCount: ideas.filter((idea) => idea.userId === user.id).length,
}))

// Add a few more users for the admin panel
extendedUsers.push(
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    ideasCount: 0,
  },
  {
    id: "4",
    name: "Bob Williams",
    email: "bob@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "suspended",
    ideasCount: 0,
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    ideasCount: 0,
  },
)

// Generate mock reports
export const reports: Report[] = [
  {
    id: "1",
    ideaId: "1",
    userId: "2",
    reason: "inappropriate",
    description: "This content contains inappropriate material",
    createdAt: "2023-11-15T10:30:00Z",
    status: "pending",
  },
  {
    id: "2",
    ideaId: "1",
    userId: "3",
    reason: "spam",
    description: "This is promotional content",
    createdAt: "2023-11-16T14:20:00Z",
    status: "pending",
  },
  {
    id: "3",
    ideaId: "3",
    userId: "4",
    reason: "offensive",
    description: "This content is offensive to certain groups",
    createdAt: "2023-11-17T09:45:00Z",
    status: "reviewed",
  },
  {
    id: "4",
    ideaId: "4",
    userId: "1",
    reason: "copyright",
    description: "This idea infringes on existing intellectual property",
    createdAt: "2023-11-18T16:10:00Z",
    status: "dismissed",
  },
  {
    id: "5",
    ideaId: "2",
    userId: "5",
    reason: "misinformation",
    description: "This idea contains factually incorrect information",
    createdAt: "2023-11-19T11:25:00Z",
    status: "pending",
  },
]

// Calculate report counts for each idea
export const ideaReportCounts = reports.reduce((counts: Record<string, number>, report) => {
  if (report.status === "pending") {
    counts[report.ideaId] = (counts[report.ideaId] || 0) + 1
  }
  return counts
}, {})

// Add report counts to extended ideas
extendedIdeas.forEach((idea) => {
  idea.reportCount = ideaReportCounts[idea.id] || 0
})

// Helper function to get reports for a specific idea
export function getReportsForIdea(ideaId: string): Report[] {
  return reports.filter((report) => report.ideaId === ideaId)
}

// Helper function to get idea by id with report count
export function getExtendedIdeaById(id: string): ExtendedIdea | undefined {
  return extendedIdeas.find((idea) => idea.id === id)
}
