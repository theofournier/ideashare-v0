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

## Overview
This tool uses machine learning to analyze code repositories and provide actionable feedback to developers. It helps improve code quality and catch issues before they make it to production.

## Features
- **Identify potential bugs** and security vulnerabilities
- **Suggest performance optimizations** based on best practices
- **Check for adherence** to coding standards
- **Recommend modern alternatives** to deprecated methods
- **Learn from feedback** to improve suggestions over time

## Technical Implementation
The system would integrate with GitHub, GitLab, and other version control platforms to provide feedback during pull requests.

### Architecture
\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Git Hook   │────▶│  AI Engine  │────▶│   Results   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   ▲                   │
       │                   │                   │
       ▼                   │                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Code Repo  │     │  Training   │◀────│   User      │
│             │     │  Data       │     │   Feedback  │
└─────────────┘     └─────────────┘     └─────────────┘
\`\`\`

## Example Code Analysis

\`\`\`javascript
// Before: Inefficient code
function findUser(users, id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
  return null;
}

// After: Suggested improvement
function findUser(users, id) {
  return users.find(user => user.id === id) || null;
}
\`\`\`

## Potential Challenges
1. Balancing precision with recall in suggestions
2. Handling different programming languages and paradigms
3. Integrating with various version control systems
4. Ensuring suggestions are helpful rather than annoying

## Next Steps
The initial version could focus on a single language (e.g., JavaScript) and a single platform (e.g., GitHub) before expanding to support more languages and integrations.
`,
    techStack: ["Python", "TensorFlow", "GitHub API", "Docker"],
    tags: ["1", "3", "4"],
    difficulty: "Advanced",
    upvotes: 42,
    createdAt: "2023-10-15",
    userId: "1",
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
  },
  {
    id: "7",
    title: "Personal Finance Dashboard",
    shortDescription: "A dashboard to track expenses, investments, and financial goals.",
    fullDescription: `
      # Personal Finance Dashboard
      
      A comprehensive dashboard that helps users manage their personal finances:
      
      - Connect to bank accounts and credit cards to automatically import transactions
      - Categorize expenses and visualize spending patterns
      - Track investments and monitor portfolio performance
      - Set financial goals and track progress
      - Generate reports and insights to improve financial health
      
      This would help users take control of their finances and make better financial decisions.
    `,
    techStack: ["React", "D3.js", "Node.js", "MongoDB", "Plaid API"],
    tags: ["1", "4", "6"],
    difficulty: "Intermediate",
    upvotes: 24,
    createdAt: "2024-03-18",
    userId: "1",
  },
  {
    id: "8",
    title: "Recipe Recommendation System",
    shortDescription: "AI-powered recipe suggestions based on available ingredients.",
    fullDescription: `
      # Recipe Recommendation System
      
      An application that suggests recipes based on ingredients users already have:
      
      - Input available ingredients in your pantry
      - Get recipe recommendations that maximize the use of available ingredients
      - Filter by dietary restrictions, cuisine type, and preparation time
      - Learn about possible ingredient substitutions
      - Save favorite recipes and create meal plans
      
      This would reduce food waste and make meal planning easier.
    `,
    techStack: ["Python", "TensorFlow", "Flask", "React", "PostgreSQL"],
    tags: ["1", "3", "7"],
    difficulty: "Advanced",
    upvotes: 33,
    createdAt: "2024-03-25",
    userId: "2",
  },
  {
    id: "9",
    title: "Virtual Study Group Platform",
    shortDescription: "Platform for students to form study groups and collaborate remotely.",
    fullDescription: `
      # Virtual Study Group Platform
      
      A platform designed to help students form and participate in virtual study groups:
      
      - Find study partners based on courses, subjects, or learning goals
      - Schedule and manage study sessions with video conferencing integration
      - Collaborative note-taking and document sharing
      - Flashcard creation and quiz tools for group study
      - Progress tracking and accountability features
      
      This would make remote learning more effective and social.
    `,
    techStack: ["Next.js", "Socket.io", "WebRTC", "Firebase", "Tailwind CSS"],
    tags: ["1", "7", "8"],
    difficulty: "Intermediate",
    upvotes: 19,
    createdAt: "2024-04-02",
    userId: "1",
  },
  {
    id: "10",
    title: "IoT Plant Care System",
    shortDescription: "Smart system to monitor and automate plant care at home.",
    fullDescription: `
      # IoT Plant Care System
      
      A smart system that monitors plant health and automates care:
      
      - Sensors to measure soil moisture, light levels, and temperature
      - Automated watering system based on plant needs
      - Mobile app to monitor plant health and receive care notifications
      - Plant identification and care recommendations
      - Historical data tracking to optimize growing conditions
      
      Perfect for plant enthusiasts and those who travel frequently.
    `,
    techStack: ["Arduino", "Raspberry Pi", "MQTT", "React Native", "Node.js"],
    tags: ["2", "4", "6"],
    difficulty: "Advanced",
    upvotes: 28,
    createdAt: "2024-04-10",
    userId: "2",
  },
  {
    id: "11",
    title: "Local Business Discovery App",
    shortDescription: "App to discover and support small local businesses in your area.",
    fullDescription: `
      # Local Business Discovery App
      
      An application focused on helping users discover and support small local businesses:
      
      - Map-based interface to find local shops, restaurants, and services
      - Filter by business type, distance, and special features (e.g., minority-owned, sustainable)
      - User reviews and recommendations
      - Special offers and loyalty programs
      - Business stories and profiles to create personal connections
      
      This would help strengthen local economies and build community connections.
    `,
    techStack: ["React Native", "Google Maps API", "Firebase", "Node.js", "Express"],
    tags: ["2", "4", "8"],
    difficulty: "Intermediate",
    upvotes: 22,
    createdAt: "2024-04-15",
    userId: "1",
  },
  {
    id: "12",
    title: "Augmented Reality Interior Designer",
    shortDescription: "AR app to visualize furniture and decor in your space before buying.",
    fullDescription: `
      # Augmented Reality Interior Designer
      
      An AR application that helps users visualize how furniture and decor would look in their space:
      
      - Scan your room using your smartphone camera
      - Browse furniture catalogs from various retailers
      - Place virtual furniture in your space to see how it fits
      - Experiment with different colors, styles, and arrangements
      - Save and share design ideas with friends or interior designers
      
      This would make home decorating more accessible and reduce purchase regrets.
    `,
    techStack: ["Unity", "ARKit", "ARCore", "React Native", "Node.js"],
    tags: ["2", "3", "6"],
    difficulty: "Advanced",
    upvotes: 37,
    createdAt: "2024-04-22",
    userId: "2",
  },
  {
    id: "13",
    title: "Peer-to-Peer Skill Exchange Platform",
    shortDescription: "Platform for people to teach and learn skills from each other.",
    fullDescription: `
      # Peer-to-Peer Skill Exchange Platform
      
      A platform that connects people who want to teach skills with those who want to learn:
      
      - Create profiles highlighting skills you can teach and skills you want to learn
      - Match with others for mutual skill exchange or one-way teaching
      - Schedule virtual or in-person sessions
      - Rating and review system to maintain quality
      - Built-in tools for video lessons, resource sharing, and progress tracking
      
      This would democratize education and build community connections.
    `,
    techStack: ["Vue.js", "Django", "PostgreSQL", "WebRTC", "Redis"],
    tags: ["1", "7", "8"],
    difficulty: "Intermediate",
    upvotes: 26,
    createdAt: "2024-04-28",
    userId: "1",
  },
  {
    id: "14",
    title: "Mental Health Journal & Mood Tracker",
    shortDescription: "App to track mood patterns and practice mindfulness techniques.",
    fullDescription: `
      # Mental Health Journal & Mood Tracker
      
      An application focused on mental health self-care and awareness:
      
      - Daily mood tracking with customizable factors (sleep, exercise, social interaction)
      - Guided journaling prompts based on cognitive behavioral therapy principles
      - Visualization of mood patterns and potential triggers over time
      - Mindfulness exercises and breathing techniques
      - Optional sharing of insights with mental health professionals
      
      This would help users understand their mental health patterns and develop healthy coping strategies.
    `,
    techStack: ["React Native", "Firebase", "TensorFlow.js", "Node.js", "Express"],
    tags: ["2", "3", "7"],
    difficulty: "Beginner",
    upvotes: 41,
    createdAt: "2024-05-05",
    userId: "2",
  },
  {
    id: "15",
    title: "Collaborative Music Creation Platform",
    shortDescription: "Platform for musicians to collaborate on tracks remotely.",
    fullDescription: `
      # Collaborative Music Creation Platform
      
      A web application that allows musicians to collaborate on music projects remotely:
      
      - Upload and share audio tracks with collaborators
      - Real-time collaborative audio editing and mixing
      - Version control for music projects
      - In-app messaging and feedback tools
      - Integration with popular digital audio workstations
      
      This would make music collaboration possible regardless of geographic location.
    `,
    techStack: ["React", "Web Audio API", "Socket.io", "Node.js", "MongoDB"],
    tags: ["1", "4", "8"],
    difficulty: "Advanced",
    upvotes: 32,
    createdAt: "2024-05-12",
    userId: "1",
  },
  {
    id: "16",
    title: "Sustainable Living Tracker",
    shortDescription: "App to track and reduce your environmental footprint.",
    fullDescription: `
      # Sustainable Living Tracker
      
      An application that helps users track and reduce their environmental impact:
      
      - Calculate carbon footprint based on lifestyle choices
      - Track water usage, energy consumption, and waste production
      - Set sustainability goals and track progress
      - Personalized recommendations for reducing environmental impact
      - Community challenges and achievements to encourage sustainable habits
      
      This would empower individuals to make more environmentally conscious decisions.
    `,
    techStack: ["Flutter", "Firebase", "Node.js", "Express", "MongoDB"],
    tags: ["2", "6", "7"],
    difficulty: "Beginner",
    upvotes: 29,
    createdAt: "2024-05-20",
    userId: "2",
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
