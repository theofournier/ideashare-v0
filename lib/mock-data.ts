export type User = {
  id: string
  name: string
  email: string
  avatar: string
}

export type Difficulty = "Beginner" | "Intermediate" | "Advanced"

export type Tag = {
  id: string
  name: string
  color: string
}

export type TechStack = {
  id: string
  name: string
}

export type Idea = {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
  techStack: string[]
  tags: string[]
  difficulty: Difficulty
  upvotes: number
  createdAt: string
  userId: string
  image?: string
}

export const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export const tags: Tag[] = [
  { id: "1", name: "Web", color: "bg-blue-500" },
  { id: "2", name: "Mobile", color: "bg-green-500" },
  { id: "3", name: "AI", color: "bg-purple-500" },
  { id: "4", name: "API", color: "bg-yellow-500" },
  { id: "5", name: "Game", color: "bg-red-500" },
  { id: "6", name: "Productivity", color: "bg-pink-500" },
  { id: "7", name: "Education", color: "bg-indigo-500" },
  { id: "8", name: "Social", color: "bg-orange-500" },
]

export const techStacks: TechStack[] = [
  { id: "1", name: "React" },
  { id: "2", name: "Next.js" },
  { id: "3", name: "Node.js" },
  { id: "4", name: "Python" },
  { id: "5", name: "TensorFlow" },
  { id: "6", name: "Firebase" },
  { id: "7", name: "MongoDB" },
  { id: "8", name: "Express" },
  { id: "9", name: "React Native" },
  { id: "10", name: "Docker" },
  { id: "11", name: "GitHub API" },
  { id: "12", name: "Redux" },
  { id: "13", name: "WebSockets" },
  { id: "14", name: "Unity" },
  { id: "15", name: "ARKit/ARCore" },
  { id: "16", name: "TensorFlow Lite" },
  { id: "17", name: "Swift/Kotlin" },
  { id: "18", name: "Tailwind CSS" },
  { id: "19", name: "Vercel" },
  { id: "20", name: "MQTT" },
  { id: "21", name: "TensorFlow.js" },
  { id: "22", name: "Chart.js" },
]

export const ideas: Idea[] = [
  {
    id: "1",
    title: "AI-Powered Code Reviewer",
    shortDescription: "An AI tool that reviews code and suggests improvements.",
    fullDescription: `
      # AI-Powered Code Reviewer
      
      This tool would use machine learning to analyze code repositories and provide actionable feedback to developers. It would:
      
      - Identify potential bugs and security vulnerabilities
      - Suggest performance optimizations
      - Check for adherence to coding standards
      - Recommend modern alternatives to deprecated methods
      
      The system could integrate with GitHub, GitLab, and other version control platforms to provide feedback during pull requests.
    `,
    techStack: ["Python", "TensorFlow", "GitHub API", "Docker"],
    tags: ["1", "3", "4"],
    difficulty: "Advanced",
    upvotes: 42,
    createdAt: "2023-10-15",
    userId: "1",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    title: "Habit Tracker with Social Accountability",
    shortDescription: "Track habits and share progress with friends for accountability.",
    fullDescription: `
      # Habit Tracker with Social Accountability
      
      A mobile app that helps users build positive habits by combining tracking with social accountability:
      
      - Set daily, weekly, or monthly habit goals
      - Track streaks and progress over time
      - Connect with friends to share goals and progress
      - Receive notifications and reminders
      - Earn achievements and compete on leaderboards
      
      The social aspect would provide motivation and accountability that many habit trackers lack.
    `,
    techStack: ["React Native", "Firebase", "Redux", "Node.js"],
    tags: ["2", "6", "8"],
    difficulty: "Intermediate",
    upvotes: 38,
    createdAt: "2023-11-02",
    userId: "2",
    // No image for this idea
  },
  {
    id: "3",
    title: "Collaborative Markdown Editor",
    shortDescription: "Real-time collaborative markdown editor with preview.",
    fullDescription: `
      # Collaborative Markdown Editor
      
      A web-based markdown editor that allows multiple users to edit documents simultaneously:
      
      - Real-time collaboration with cursor positions
      - Live preview of rendered markdown
      - Version history and change tracking
      - Export to PDF, HTML, and other formats
      - Custom themes and syntax highlighting
      
      Think Google Docs but specifically optimized for markdown with developer-friendly features.
    `,
    techStack: ["React", "WebSockets", "Express", "MongoDB"],
    tags: ["1", "4", "6"],
    difficulty: "Intermediate",
    upvotes: 27,
    createdAt: "2023-12-05",
    userId: "1",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    title: "AR Language Learning App",
    shortDescription: "Learn languages by pointing your camera at objects.",
    fullDescription: `
      # AR Language Learning App
      
      An augmented reality app that helps users learn new languages by identifying objects in the real world:
      
      - Point your camera at objects to see their names in your target language
      - Practice pronunciation with voice recognition
      - Gamified challenges based on your surroundings
      - Spaced repetition system to reinforce vocabulary
      - Offline mode for learning anywhere
      
      This combines the immersion of real-world objects with the convenience of a mobile app.
    `,
    techStack: ["Unity", "ARKit/ARCore", "TensorFlow Lite", "Swift/Kotlin"],
    tags: ["2", "3", "7"],
    difficulty: "Advanced",
    upvotes: 35,
    createdAt: "2024-01-10",
    userId: "2",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    title: "Developer Portfolio Generator",
    shortDescription: "Generate a professional portfolio site from your GitHub profile.",
    fullDescription: `
      # Developer Portfolio Generator
      
      A tool that automatically creates a customizable portfolio website based on a developer's GitHub profile:
      
      - Pull projects, contributions, and stats from GitHub
      - Customize themes, layout, and highlighted projects
      - Add additional sections for skills, experience, and contact info
      - Deploy automatically to GitHub Pages, Vercel, or Netlify
      - Update automatically when new projects are added
      
      This would save developers time while creating professional-looking portfolios.
    `,
    techStack: ["Next.js", "GitHub API", "Tailwind CSS", "Vercel"],
    tags: ["1", "4", "6"],
    difficulty: "Beginner",
    upvotes: 31,
    createdAt: "2024-02-18",
    userId: "1",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    title: "Smart Home Energy Dashboard",
    shortDescription: "Monitor and optimize your home's energy usage.",
    fullDescription: `
      # Smart Home Energy Dashboard
      
      A web and mobile app that connects to smart home devices to track and optimize energy usage:
      
      - Real-time monitoring of electricity, water, and gas usage
      - Integration with smart plugs, thermostats, and other IoT devices
      - AI-powered suggestions for reducing energy consumption
      - Cost tracking and comparison with historical usage
      - Alerts for unusual consumption patterns
      
      This would help users save money while reducing their environmental impact.
    `,
    techStack: ["React", "Node.js", "MQTT", "TensorFlow.js", "Chart.js"],
    tags: ["1", "2", "3", "4"],
    difficulty: "Advanced",
    upvotes: 29,
    createdAt: "2024-03-05",
    userId: "2",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export const userVotes: Record<string, string[]> = {
  "1": ["2", "4", "6"],
  "2": ["1", "3", "5"],
}

export const userIdeas: Record<string, string[]> = {
  "1": ["1", "3", "5"],
  "2": ["2", "4", "6"],
}

// Helper functions to work with mock data
export function getTagById(id: string): Tag | undefined {
  return tags.find((tag) => tag.id === id)
}

export function getTechStackById(id: string): TechStack | undefined {
  return techStacks.find((tech) => tech.id === id)
}

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

export function getIdeaById(id: string): Idea | undefined {
  return ideas.find((idea) => idea.id === id)
}

export function getTagsForIdea(idea: Idea): Tag[] {
  return idea.tags.map((tagId) => getTagById(tagId)).filter(Boolean) as Tag[]
}

export function getUserForIdea(idea: Idea): User | undefined {
  return getUserById(idea.userId)
}

// Current user for mock authentication
export const currentUser = users[0]
