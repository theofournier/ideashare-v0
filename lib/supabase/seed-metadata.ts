"use server"

import { createClient } from "./server"

export async function seedTagsAndTechStacks() {
  const supabase = createClient()

  try {
    // Check if we already have tags
    const { count: tagCount, error: tagCountError } = await supabase
      .from("tags")
      .select("*", { count: "exact", head: true })

    if (tagCountError) {
      console.error("Error checking for existing tags:", tagCountError)
      return { success: false, message: "Error checking for existing tags" }
    }

    // Check if we already have tech stacks
    const { count: techCount, error: techCountError } = await supabase
      .from("tech_stacks")
      .select("*", { count: "exact", head: true })

    if (techCountError) {
      console.error("Error checking for existing tech stacks:", techCountError)
      return { success: false, message: "Error checking for existing tech stacks" }
    }

    // If we have both tags and tech stacks, skip seeding
    if (tagCount && tagCount > 0 && techCount && techCount > 0) {
      console.log("Tags and tech stacks already exist, skipping seed")
      return { success: true, message: "Tags and tech stacks already exist" }
    }

    // Seed tags if needed
    if (!tagCount || tagCount === 0) {
      const tags = [
        { name: "Web", color: "#3b82f6" },
        { name: "Mobile", color: "#10b981" },
        { name: "API", color: "#f59e0b" },
        { name: "Database", color: "#8b5cf6" },
        { name: "AI", color: "#ec4899" },
        { name: "DevOps", color: "#6366f1" },
        { name: "Game", color: "#ef4444" },
        { name: "E-commerce", color: "#0ea5e9" },
        { name: "Social Media", color: "#f97316" },
        { name: "Productivity", color: "#14b8a6" },
        { name: "Finance", color: "#84cc16" },
        { name: "Health", color: "#06b6d4" },
        { name: "Education", color: "#a855f7" },
        { name: "Food", color: "#f43f5e" },
        { name: "Travel", color: "#0284c7" },
        { name: "Analytics", color: "#7c3aed" },
        { name: "Communication", color: "#22c55e" },
      ]

      const { error: tagInsertError } = await supabase.from("tags").insert(tags)

      if (tagInsertError) {
        console.error("Error seeding tags:", tagInsertError)
        return { success: false, message: "Error seeding tags" }
      }

      console.log("Tags seeded successfully")
    }

    // Seed tech stacks if needed
    if (!techCount || techCount === 0) {
      const techStacks = [
        { name: "React" },
        { name: "Next.js" },
        { name: "Vue.js" },
        { name: "Angular" },
        { name: "Svelte" },
        { name: "Node.js" },
        { name: "Express" },
        { name: "Django" },
        { name: "Flask" },
        { name: "Ruby on Rails" },
        { name: "Laravel" },
        { name: "Spring Boot" },
        { name: "ASP.NET" },
        { name: "GraphQL" },
        { name: "REST API" },
        { name: "MongoDB" },
        { name: "PostgreSQL" },
        { name: "MySQL" },
        { name: "Redis" },
        { name: "Firebase" },
        { name: "Supabase" },
        { name: "AWS" },
        { name: "Azure" },
        { name: "Google Cloud" },
        { name: "Docker" },
        { name: "Kubernetes" },
        { name: "Tailwind CSS" },
        { name: "Bootstrap" },
        { name: "Material UI" },
        { name: "Chakra UI" },
        { name: "React Native" },
        { name: "Flutter" },
        { name: "Swift" },
        { name: "Kotlin" },
        { name: "TensorFlow" },
        { name: "PyTorch" },
        { name: "Framer Motion" },
      ]

      const { error: techInsertError } = await supabase.from("tech_stacks").insert(techStacks)

      if (techInsertError) {
        console.error("Error seeding tech stacks:", techInsertError)
        return { success: false, message: "Error seeding tech stacks" }
      }

      console.log("Tech stacks seeded successfully")
    }

    return {
      success: true,
      message: "Tags and tech stacks seeded successfully",
    }
  } catch (error) {
    console.error("Unexpected error in seedTagsAndTechStacks:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}
