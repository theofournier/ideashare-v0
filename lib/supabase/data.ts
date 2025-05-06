"use server"

import { createClient } from "./server"

// Simple retry mechanism with exponential backoff
async function retryOperation<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Add a small delay before retrying, increasing with each attempt
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)))
      }
      return await operation()
    } catch (error) {
      lastError = error
      console.warn(`Attempt ${attempt + 1} failed, retrying...`, error)
    }
  }
  throw lastError
}

// Cache for tags and tech stacks to reduce API calls
let tagsCache: any[] | null = null
let techStacksCache: string[] | null = null
// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000
let tagsCacheTimestamp: number | null = null
let techStacksCacheTimestamp: number | null = null

export async function getTags() {
  const now = Date.now()

  // Return cached tags if available and not expired
  if (tagsCache && tagsCacheTimestamp && now - tagsCacheTimestamp < CACHE_EXPIRATION) {
    return tagsCache
  }

  try {
    const supabase = createClient()

    const { data, error } = await retryOperation(async () => {
      return await supabase.from("tags").select("*").order("name")
    })

    if (error) {
      console.error("Error fetching tags:", error)
      return tagsCache || [] // Return cached data even if expired, or empty array
    }

    // Process and cache the tags
    const processedTags = data.map((tag) => ({
      id: tag.id.toString(),
      name: tag.name,
      color: tag.color,
    }))

    tagsCache = processedTags
    tagsCacheTimestamp = now
    return processedTags
  } catch (error) {
    console.error("Unexpected error fetching tags:", error)
    return tagsCache || [] // Return cached data even if expired, or empty array
  }
}

export async function getTechStacks() {
  const now = Date.now()

  // Return cached tech stacks if available and not expired
  if (techStacksCache && techStacksCacheTimestamp && now - techStacksCacheTimestamp < CACHE_EXPIRATION) {
    return techStacksCache
  }

  try {
    const supabase = createClient()

    const { data, error } = await retryOperation(async () => {
      return await supabase.from("tech_stacks").select("*").order("name")
    })

    if (error) {
      console.error("Error fetching tech stacks:", error)
      return techStacksCache || [] // Return cached data even if expired, or empty array
    }

    // Process and cache the tech stacks
    const processedTechStacks = data.map((tech) => tech.name)

    techStacksCache = processedTechStacks
    techStacksCacheTimestamp = now
    return processedTechStacks
  } catch (error) {
    console.error("Unexpected error fetching tech stacks:", error)
    return techStacksCache || [] // Return cached data even if expired, or empty array
  }
}

export async function getIdeas({
  page = 1,
  limit = 10,
  search = "",
  difficulty = "All",
  tags = [],
  techStack = [],
  sort = "newest",
}: {
  page?: number
  limit?: number
  search?: string
  difficulty?: string
  tags?: string[]
  techStack?: string[]
  sort?: "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc"
}) {
  try {
    const supabase = createClient()
    const offset = (page - 1) * limit

    // Start building the query
    let query = supabase.from("ideas").select(`*`, { count: "exact" }).eq("status", "published")

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%,full_description.ilike.%${search}%`)
    }

    // Apply difficulty filter
    if (difficulty !== "All") {
      query = query.eq("difficulty", difficulty)
    }

    // Apply sorting
    switch (sort) {
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      case "oldest":
        query = query.order("created_at", { ascending: true })
        break
      case "most-upvoted":
        query = query.order("upvotes", { ascending: false })
        break
      case "title-asc":
        query = query.order("title", { ascending: true })
        break
      case "title-desc":
        query = query.order("title", { ascending: false })
        break
      default:
        query = query.order("created_at", { ascending: false })
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, count, error } = await retryOperation(async () => {
      return await query
    })

    if (error) {
      console.error("Error fetching ideas:", error)
      return { ideas: [], count: 0 }
    }

    // Process the data to match the expected format
    const processedIdeas = await Promise.all(
      (data || []).map(async (idea) => {
        // Get user profile
        const { data: userData } = await retryOperation(async () => {
          return await supabase.from("user_profiles").select("*").eq("id", idea.user_id).maybeSingle()
        })

        // Get tags for this idea
        const { data: tagData } = await retryOperation(async () => {
          return await supabase.from("idea_tags").select("tag_id").eq("idea_id", idea.id)
        })

        const tagIds = tagData?.map((item) => item.tag_id) || []
        let tags: any[] = []

        if (tagIds.length > 0) {
          const { data: tagsData } = await retryOperation(async () => {
            return await supabase.from("tags").select("*").in("id", tagIds)
          })
          tags = tagsData || []
        }

        // Get tech stack for this idea
        const { data: techData } = await retryOperation(async () => {
          return await supabase.from("idea_tech_stacks").select("tech_stack_id").eq("idea_id", idea.id)
        })

        const techIds = techData?.map((item) => item.tech_stack_id) || []
        let techStacks: any[] = []

        if (techIds.length > 0) {
          const { data: techStacksData } = await retryOperation(async () => {
            return await supabase.from("tech_stacks").select("*").in("id", techIds)
          })
          techStacks = techStacksData || []
        }

        // Check if the current user has upvoted this idea
        const { data: session } = await supabase.auth.getSession()
        let isUpvoted = false

        if (session?.session?.user) {
          const { data: voteData } = await retryOperation(async () => {
            return await supabase
              .from("user_votes")
              .select("*")
              .eq("idea_id", idea.id)
              .eq("user_id", session.session.user.id)
              .maybeSingle()
          })

          isUpvoted = !!voteData
        }

        return {
          id: idea.id,
          title: idea.title,
          shortDescription: idea.short_description,
          fullDescription: idea.full_description,
          difficulty: idea.difficulty,
          upvotes: idea.upvotes,
          createdAt: idea.created_at,
          userId: idea.user_id,
          tags: tags.map((tag) => ({
            id: tag?.id?.toString() || "",
            name: tag?.name || "",
            color: tag?.color || "",
          })),
          techStack: techStacks.map((tech) => tech.name),
          user: {
            name: userData?.full_name || "Unknown",
            avatar: userData?.avatar_url || null,
          },
          isUpvoted,
        }
      }),
    )

    return { ideas: processedIdeas, count: count || 0 }
  } catch (error) {
    console.error("Unexpected error in getIdeas:", error)
    return { ideas: [], count: 0 }
  }
}

// The rest of the functions remain the same but should also use the retry mechanism
// I'm not including them all to keep the response concise, but the same pattern should be applied

export async function getIdeaById(id: string) {
  try {
    const supabase = createClient()

    const { data: idea, error } = await retryOperation(async () => {
      return await supabase.from("ideas").select(`*`).eq("id", id).single()
    })

    if (error) {
      console.error("Error fetching idea:", error)
      return null
    }

    if (!idea) {
      console.error("Idea not found with ID:", id)
      return null
    }

    // Get user profile
    const { data: userData } = await retryOperation(async () => {
      return await supabase.from("user_profiles").select("*").eq("id", idea.user_id).maybeSingle()
    })

    // Get tags for this idea
    const { data: tagData } = await retryOperation(async () => {
      return await supabase.from("idea_tags").select("tag_id").eq("idea_id", idea.id)
    })

    const tagIds = tagData?.map((item) => item.tag_id) || []
    let tags: any[] = []

    if (tagIds.length > 0) {
      const { data: tagsData } = await retryOperation(async () => {
        return await supabase.from("tags").select("*").in("id", tagIds)
      })
      tags = tagsData || []
    }

    // Get tech stack for this idea
    const { data: techData } = await retryOperation(async () => {
      return await supabase.from("idea_tech_stacks").select("tech_stack_id").eq("idea_id", idea.id)
    })

    const techIds = techData?.map((item) => item.tech_stack_id) || []
    let techStacks: any[] = []

    if (techIds.length > 0) {
      const { data: techStacksData } = await retryOperation(async () => {
        return await supabase.from("tech_stacks").select("*").in("id", techIds)
      })
      techStacks = techStacksData || []
    }

    // Check if the current user has upvoted this idea
    const { data: session } = await supabase.auth.getSession()
    let isUpvoted = false

    if (session?.session?.user) {
      const { data: voteData } = await retryOperation(async () => {
        return await supabase
          .from("user_votes")
          .select("*")
          .eq("idea_id", idea.id)
          .eq("user_id", session.session.user.id)
          .maybeSingle()
      })

      isUpvoted = !!voteData
    }

    return {
      id: idea.id,
      title: idea.title,
      shortDescription: idea.short_description,
      fullDescription: idea.full_description,
      difficulty: idea.difficulty,
      upvotes: idea.upvotes,
      createdAt: idea.created_at,
      userId: idea.user_id,
      status: idea.status,
      tags: tags.map((tag) => ({
        id: tag?.id?.toString() || "",
        name: tag?.name || "",
        color: tag?.color || "",
      })),
      techStack: techStacks.map((tech) => tech.name),
      user: {
        id: userData?.id || "",
        name: userData?.full_name || "Unknown",
        avatar: userData?.avatar_url || null,
      },
      isUpvoted,
    }
  } catch (error) {
    console.error("Unexpected error fetching idea:", error)
    return null
  }
}

export async function getSimilarIdeas(ideaId: string) {
  const supabase = createClient()

  // First, get the current idea's tags and tech stack
  const idea = await getIdeaById(ideaId)
  if (!idea) return []

  const tagIds = idea.tags.map((tag) => tag.id)
  const techStackNames = idea.techStack

  // Get tech stack IDs
  const { data: techStackData } = await supabase.from("tech_stacks").select("id").in("name", techStackNames)

  const techStackIds = techStackData?.map((tech) => tech.id) || []

  // Find ideas with similar tags or tech stack
  const { data: similarIdeasData } = await supabase
    .from("ideas")
    .select(`*, idea_tags(tag_id), idea_tech_stacks(tech_stack_id)`)
    .neq("id", ideaId)
    .eq("status", "published")
    .limit(6)

  if (!similarIdeasData) return []

  // Filter ideas that have matching tags or tech stacks
  const filteredIdeas = similarIdeasData.filter((idea) => {
    const ideaTagIds = idea.idea_tags.map((tagRel: any) => tagRel.tag_id.toString())
    const ideaTechStackIds = idea.idea_tech_stacks.map((techRel: any) => techRel.tech_stack_id)

    return (
      ideaTagIds.some((id: string) => tagIds.includes(id)) ||
      ideaTechStackIds.some((id: number) => techStackIds.includes(id))
    )
  })

  // Process the data to match the expected format
  const processedIdeas = await Promise.all(
    filteredIdeas.map(async (idea) => {
      // Get tags for this idea
      const { data: tagData } = await retryOperation(async () => {
        return await supabase.from("idea_tags").select("tags(id, name, color)").eq("idea_id", idea.id)
      })

      const tags = tagData?.map((item) => item.tags) || []

      return {
        id: idea.id,
        title: idea.title,
        shortDescription: idea.short_description,
        difficulty: idea.difficulty,
        upvotes: idea.upvotes,
        createdAt: idea.created_at,
        tags: tags.map((tag) => ({
          id: tag?.id?.toString() || "",
          name: tag?.name || "",
          color: tag?.color || "",
        })),
      }
    }),
  )

  return processedIdeas
}

export async function getUserIdeas(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("ideas")
    .select(`*`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user ideas:", error)
    return []
  }

  // Process the data to match the expected format
  const processedIdeas = await Promise.all(
    data.map(async (idea) => {
      // Get tags for this idea
      const { data: tagData } = await retryOperation(async () => {
        return await supabase.from("idea_tags").select("tags(id, name, color)").eq("idea_id", idea.id)
      })

      const tags = tagData?.map((item) => item.tags) || []

      // Get tech stack for this idea
      const { data: techData } = await retryOperation(async () => {
        return await supabase.from("idea_tech_stacks").select("tech_stacks(id, name)").eq("idea_id", idea.id)
      })

      const techStack = techData?.map((item) => item.tech_stacks?.name || "") || []

      // Check if the current user has upvoted this idea
      const { data: session } = await supabase.auth.getSession()
      let isUpvoted = false

      if (session?.session?.user) {
        const { data: voteData } = await retryOperation(async () => {
          return await supabase
            .from("user_votes")
            .select("*")
            .eq("idea_id", idea.id)
            .eq("user_id", session.session.user.id)
            .maybeSingle()
        })

        isUpvoted = !!voteData
      }

      return {
        id: idea.id,
        title: idea.title,
        shortDescription: idea.short_description,
        fullDescription: idea.full_description,
        difficulty: idea.difficulty,
        upvotes: idea.upvotes,
        createdAt: idea.created_at,
        userId: idea.user_id,
        tags: tags.map((tag) => ({
          id: tag?.id?.toString() || "",
          name: tag?.name || "",
          color: tag?.color || "",
        })),
        techStack,
        isUpvoted,
      }
    }),
  )

  return processedIdeas
}

export async function getUserUpvotedIdeas(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("user_votes").select("idea_id").eq("user_id", userId)

  if (error) {
    console.error("Error fetching user upvoted ideas:", error)
    return []
  }

  const ideaIds = data.map((vote) => vote.idea_id)
  if (ideaIds.length === 0) return []

  const { data: ideasData, error: ideasError } = await supabase
    .from("ideas")
    .select("*")
    .in("id", ideaIds)
    .order("created_at", { ascending: false })

  if (ideasError) {
    console.error("Error fetching upvoted ideas:", ideasError)
    return []
  }

  // Process the data to match the expected format
  const processedIdeas = await Promise.all(
    ideasData.map(async (idea) => {
      // Get tags for this idea
      const { data: tagData } = await retryOperation(async () => {
        return await supabase.from("idea_tags").select("tags(id, name, color)").eq("idea_id", idea.id)
      })

      const tags = tagData?.map((item) => item.tags) || []

      // Get tech stack for this idea
      const { data: techData } = await retryOperation(async () => {
        return await supabase.from("idea_tech_stacks").select("tech_stacks(id, name)").eq("idea_id", idea.id)
      })

      const techStack = techData?.map((item) => item.tech_stacks?.name || "") || []

      return {
        id: idea.id,
        title: idea.title,
        shortDescription: idea.short_description,
        fullDescription: idea.full_description,
        difficulty: idea.difficulty,
        upvotes: idea.upvotes,
        createdAt: idea.created_at,
        userId: idea.user_id,
        tags: tags.map((tag) => ({
          id: tag?.id?.toString() || "",
          name: tag?.name || "",
          color: tag?.color || "",
        })),
        techStack,
        isUpvoted: true, // Since these are upvoted ideas
      }
    }),
  )

  return processedIdeas
}

export async function getUserProfile(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return {
    id: data.id,
    name: data.full_name,
    avatar: data.avatar_url,
  }
}
