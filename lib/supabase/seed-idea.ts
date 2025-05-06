"use server"

import { createClient } from "./server"

export async function seedInitialIdea() {
  const supabase = createClient()

  try {
    // Check if we already have ideas
    const { count, error: countError } = await supabase.from("ideas").select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error checking for existing ideas:", countError)
      return { success: false, message: "Error checking for existing ideas" }
    }

    if (count && count > 0) {
      console.log("Ideas already exist, skipping seed")
      return { success: true, message: "Ideas already exist" }
    }

    // Get the first user to assign as the author
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      console.error("No authenticated user found:", userError)
      return { success: false, message: "No authenticated user found" }
    }

    const userId = userData.user.id

    // Check if user profile exists
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle()

    if (profileError) {
      console.error("Error checking user profile:", profileError)
    }

    // Create user profile if it doesn't exist
    if (!profileData) {
      const { error: insertProfileError } = await supabase.from("user_profiles").insert({
        id: userId,
        full_name: userData.user.email?.split("@")[0] || "Anonymous User",
      })

      if (insertProfileError) {
        console.error("Error creating user profile:", insertProfileError)
      }
    }

    // Insert a sample idea
    const { data: idea, error: ideaError } = await supabase
      .from("ideas")
      .insert({
        title: "Build a Personal Portfolio Website",
        short_description: "Create a modern portfolio website to showcase your projects and skills",
        full_description: `# Build a Personal Portfolio Website

## Overview
A personal portfolio website is essential for developers and designers to showcase their work and skills. This project will help you create a modern, responsive portfolio that highlights your best work.

## Features to Implement
- Home page with a hero section
- About me section with your skills and experience
- Projects showcase with filtering options
- Contact form
- Blog section (optional)

## Tech Stack Suggestions
- Next.js for the frontend
- Tailwind CSS for styling
- Framer Motion for animations
- Supabase for the backend (contact form storage)

## Learning Opportunities
- Modern React patterns
- Responsive design principles
- SEO optimization
- Performance optimization
- Form handling and validation

## Difficulty
This project is suitable for beginners to intermediate developers who want to improve their frontend skills.`,
        difficulty: "Beginner",
        upvotes: 5,
        user_id: userId,
        status: "published",
      })
      .select()
      .single()

    if (ideaError) {
      console.error("Error seeding idea:", ideaError)
      return { success: false, message: ideaError.message }
    }

    // Get tag ID for Web
    const { data: webTag, error: tagError } = await supabase.from("tags").select("id").eq("name", "Web").maybeSingle()

    if (tagError) {
      console.error("Error fetching Web tag:", tagError)
    }

    // Add tags to the idea
    if (webTag) {
      const { error: tagRelationError } = await supabase
        .from("idea_tags")
        .insert({ idea_id: idea.id, tag_id: webTag.id })

      if (tagRelationError) {
        console.error("Error adding tag to idea:", tagRelationError)
      }
    }

    // Get tech stack IDs
    const { data: techStacks, error: techError } = await supabase
      .from("tech_stacks")
      .select("id, name")
      .in("name", ["React", "Next.js", "Tailwind CSS"])

    if (techError) {
      console.error("Error fetching tech stacks:", techError)
    }

    // Add tech stacks to the idea
    if (techStacks && techStacks.length > 0) {
      const techStackInserts = techStacks.map((tech) => ({
        idea_id: idea.id,
        tech_stack_id: tech.id,
      }))

      const { error: techRelationError } = await supabase.from("idea_tech_stacks").insert(techStackInserts)

      if (techRelationError) {
        console.error("Error adding tech stacks to idea:", techRelationError)
      }
    }

    return {
      success: true,
      message: "Initial idea seeded successfully",
      ideaId: idea.id,
    }
  } catch (error) {
    console.error("Unexpected error in seedInitialIdea:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}
