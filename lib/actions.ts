"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "./supabase-server"
import type { Difficulty } from "./types"

export async function getIdeas() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("ideas")
    .select(`
      *,
      profiles:user_id(*),
      tags:idea_tags(tags(*))
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching ideas:", error)
    return []
  }

  // Transform the data to match our types
  const ideas = data.map((idea) => ({
    ...idea,
    tags: idea.tags.map((t: any) => t.tags),
  }))

  return ideas
}

export async function getIdeaById(id: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("ideas")
    .select(`
      *,
      profiles:user_id(*),
      tags:idea_tags(tags(*))
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching idea:", error)
    return null
  }

  // Transform the data to match our types
  const idea = {
    ...data,
    tags: data.tags.map((t: any) => t.tags),
  }

  return idea
}

export async function getTags() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("tags").select("*").order("name")

  if (error) {
    console.error("Error fetching tags:", error)
    return []
  }

  return data
}

export async function getUserIdeas(userId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("ideas")
    .select(`
      *,
      profiles:user_id(*),
      tags:idea_tags(tags(*))
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user ideas:", error)
    return []
  }

  // Transform the data to match our types
  const ideas = data.map((idea) => ({
    ...idea,
    tags: idea.tags.map((t: any) => t.tags),
  }))

  return ideas
}

export async function getUserVotes(userId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("votes")
    .select(`
      idea_id,
      ideas:idea_id(
        *,
        profiles:user_id(*),
        tags:idea_tags(tags(*))
      )
    `)
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching user votes:", error)
    return []
  }

  // Transform the data to match our types
  const ideas = data.map((vote) => ({
    ...vote.ideas,
    tags: vote.ideas.tags.map((t: any) => t.tags),
  }))

  return ideas
}

export async function createIdea(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const title = formData.get("title") as string
  const shortDescription = formData.get("shortDescription") as string
  const fullDescription = formData.get("fullDescription") as string
  const difficulty = formData.get("difficulty") as Difficulty
  const techStackString = formData.get("techStack") as string
  const techStack = techStackString ? JSON.parse(techStackString) : []
  const tagIds = formData.getAll("tags") as string[]
  const imageUrl = (formData.get("imageUrl") as string) || null

  // Insert the idea
  const { data: idea, error: ideaError } = await supabase
    .from("ideas")
    .insert({
      title,
      short_description: shortDescription,
      full_description: fullDescription,
      difficulty,
      tech_stack: techStack,
      image_url: imageUrl,
      user_id: session.user.id,
    })
    .select()
    .single()

  if (ideaError) {
    console.error("Error creating idea:", ideaError)
    return { error: "Failed to create idea" }
  }

  // Insert the idea-tag relationships
  if (tagIds.length > 0) {
    const ideaTags = tagIds.map((tagId) => ({
      idea_id: idea.id,
      tag_id: tagId,
    }))

    const { error: tagError } = await supabase.from("idea_tags").insert(ideaTags)

    if (tagError) {
      console.error("Error adding tags to idea:", tagError)
    }
  }

  revalidatePath("/")
  redirect("/")
}

export async function toggleVote(ideaId: string) {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "You must be logged in to vote" }
  }

  // Check if the user has already voted
  const { data: existingVote, error: checkError } = await supabase
    .from("votes")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("idea_id", ideaId)
    .maybeSingle()

  if (checkError) {
    console.error("Error checking vote:", checkError)
    return { error: "Failed to check vote status" }
  }

  if (existingVote) {
    // Remove the vote
    const { error: deleteError } = await supabase
      .from("votes")
      .delete()
      .eq("user_id", session.user.id)
      .eq("idea_id", ideaId)

    if (deleteError) {
      console.error("Error removing vote:", deleteError)
      return { error: "Failed to remove vote" }
    }

    revalidatePath(`/idea/${ideaId}`)
    return { success: true, action: "removed" }
  } else {
    // Add the vote
    const { error: insertError } = await supabase.from("votes").insert({
      user_id: session.user.id,
      idea_id: ideaId,
    })

    if (insertError) {
      console.error("Error adding vote:", insertError)
      return { error: "Failed to add vote" }
    }

    revalidatePath(`/idea/${ideaId}`)
    return { success: true, action: "added" }
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const username = formData.get("username") as string
  const fullName = formData.get("fullName") as string
  const avatarUrl = formData.get("avatarUrl") as string
  const website = formData.get("website") as string

  const { error } = await supabase.from("profiles").upsert({
    id: session.user.id,
    username,
    full_name: fullName,
    avatar_url: avatarUrl,
    website,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error updating profile:", error)
    return { error: "Failed to update profile" }
  }

  revalidatePath("/profile")
  return { success: true }
}

export async function getVoteCount(ideaId: string) {
  const supabase = createServerSupabaseClient()

  const { count, error } = await supabase
    .from("votes")
    .select("*", { count: "exact", head: true })
    .eq("idea_id", ideaId)

  if (error) {
    console.error("Error getting vote count:", error)
    return 0
  }

  return count || 0
}

export async function checkUserVote(ideaId: string) {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return false
  }

  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("idea_id", ideaId)
    .maybeSingle()

  if (error) {
    console.error("Error checking user vote:", error)
    return false
  }

  return !!data
}
