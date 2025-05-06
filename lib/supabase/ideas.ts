"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { Database } from "./database.types"
import { createClient } from "./server"

// Create a supabase client for server actions
const createActionClient = () => {
  return createServerActionClient<Database>({ cookies })
}

export async function submitIdea(formData: FormData) {
  const supabase = createActionClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "You must be logged in to submit an idea" }
  }

  const title = formData.get("title") as string
  const shortDescription = formData.get("shortDescription") as string
  const fullDescription = formData.get("fullDescription") as string
  const difficulty = formData.get("difficulty") as string
  const tagIds = JSON.parse(formData.get("tags") as string) as string[]
  const techStackNames = JSON.parse(formData.get("techStack") as string) as string[]

  try {
    // Insert the idea
    const { data: idea, error: ideaError } = await supabase
      .from("ideas")
      .insert({
        title,
        short_description: shortDescription,
        full_description: fullDescription,
        difficulty,
        user_id: session.user.id,
        status: "published", // Default status
        upvotes: 0, // Start with 0 upvotes
      })
      .select("id")
      .single()

    if (ideaError) {
      return { error: ideaError.message }
    }

    // Insert tags
    if (tagIds.length > 0) {
      const tagRelations = tagIds.map((tagId) => ({
        idea_id: idea.id,
        tag_id: Number.parseInt(tagId),
      }))

      const { error: tagError } = await supabase.from("idea_tags").insert(tagRelations)

      if (tagError) {
        return { error: tagError.message }
      }
    }

    // Insert tech stacks - first ensure they exist
    if (techStackNames.length > 0) {
      // Get existing tech stacks
      const { data: existingTechStacks } = await supabase
        .from("tech_stacks")
        .select("id, name")
        .in("name", techStackNames)

      // Create map of tech stack names to ids
      const techStackMap = new Map()
      existingTechStacks?.forEach((tech) => {
        techStackMap.set(tech.name, tech.id)
      })

      // Find tech stacks that need to be created
      const techStacksToCreate = techStackNames.filter((name) => !techStackMap.has(name))

      // Create new tech stacks if needed
      if (techStacksToCreate.length > 0) {
        const { data: newTechStacks, error: techStackError } = await supabase
          .from("tech_stacks")
          .insert(techStacksToCreate.map((name) => ({ name })))
          .select("id, name")

        if (techStackError) {
          return { error: techStackError.message }
        }

        // Add new tech stacks to map
        newTechStacks?.forEach((tech) => {
          techStackMap.set(tech.name, tech.id)
        })
      }

      // Create tech stack relations
      const techStackRelations = techStackNames.map((name) => ({
        idea_id: idea.id,
        tech_stack_id: techStackMap.get(name),
      }))

      const { error: relationError } = await supabase.from("idea_tech_stacks").insert(techStackRelations)

      if (relationError) {
        return { error: relationError.message }
      }
    }

    revalidatePath("/browse")
    revalidatePath("/")
    return { success: true, ideaId: idea.id }
  } catch (error) {
    return { error: "An unexpected error occurred" }
  }
}

export async function toggleUpvote(ideaId: string) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "You must be logged in to upvote ideas" }
  }

  const userId = session.user.id

  try {
    // Check if the user has already upvoted this idea
    const { data: existingVote, error: checkError } = await supabase
      .from("user_votes")
      .select("*")
      .eq("user_id", userId)
      .eq("idea_id", ideaId)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking vote:", checkError)
      return { error: "Failed to check if you've already upvoted" }
    }

    let action: "added" | "removed" = "added"

    if (existingVote) {
      // User has already upvoted, so remove the upvote
      const { error: deleteError } = await supabase
        .from("user_votes")
        .delete()
        .eq("user_id", userId)
        .eq("idea_id", ideaId)

      if (deleteError) {
        console.error("Error deleting vote:", deleteError)
        return { error: "Failed to remove upvote" }
      }

      // Decrement the upvote count
      const { error: updateError } = await supabase.rpc("decrement_upvotes", { idea_id: ideaId })

      if (updateError) {
        console.error("Error decrementing upvotes:", updateError)
        return { error: "Failed to update upvote count" }
      }

      action = "removed"
    } else {
      // User hasn't upvoted yet, so add the upvote
      const { error: insertError } = await supabase.from("user_votes").insert({ user_id: userId, idea_id: ideaId })

      if (insertError) {
        console.error("Error inserting vote:", insertError)
        return { error: "Failed to add upvote" }
      }

      // Increment the upvote count
      const { error: updateError } = await supabase.rpc("increment_upvotes", { idea_id: ideaId })

      if (updateError) {
        console.error("Error incrementing upvotes:", updateError)
        return { error: "Failed to update upvote count" }
      }
    }

    // Revalidate the idea detail page and browse page
    revalidatePath(`/idea/${ideaId}`)
    revalidatePath("/browse")

    return { success: true, action }
  } catch (error) {
    console.error("Unexpected error in toggleUpvote:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function reportIdea(formData: FormData) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "You must be logged in to report ideas" }
  }

  const ideaId = formData.get("ideaId") as string
  const reason = formData.get("reason") as string
  const description = formData.get("description") as string

  try {
    // Add the report
    const { error } = await supabase.from("reports").insert({
      user_id: session.user.id,
      idea_id: ideaId,
      reason,
      description,
      status: "pending",
    })

    if (error) {
      console.error("Error submitting report:", error)
      return { error: "Failed to submit report" }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error in reportIdea:", error)
    return { error: "An unexpected error occurred" }
  }
}
