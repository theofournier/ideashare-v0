export type Profile = {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  website: string | null
  created_at: string
  updated_at: string
}

export type Tag = {
  id: string
  name: string
  color: string
  created_at: string
}

export type Difficulty = "Beginner" | "Intermediate" | "Advanced"

export type Idea = {
  id: string
  title: string
  short_description: string
  full_description: string
  tech_stack: string[]
  difficulty: Difficulty
  image_url: string | null
  user_id: string
  created_at: string
  updated_at: string
  // Join fields
  profiles?: Profile
  tags?: Tag[]
  votes_count?: number
}

export type Vote = {
  user_id: string
  idea_id: string
  created_at: string
}

export type IdeaTag = {
  idea_id: string
  tag_id: string
}
