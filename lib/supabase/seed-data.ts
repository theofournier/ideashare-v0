"use server"

import { createClient } from "./server"
import { v4 as uuidv4 } from "uuid"

type SeedIdea = {
  title: string
  short_description: string
  full_description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  tags: string[]
  tech_stacks: string[]
}

export async function seedDatabase() {
  const supabase = createClient()

  try {
    // Check if we already have ideas
    const { count, error: countError } = await supabase.from("ideas").select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error checking for existing ideas:", countError)
      return { success: false, message: "Error checking for existing ideas" }
    }

    if (count && count > 5) {
      console.log("Sufficient ideas already exist, skipping seed")
      return { success: true, message: "Sufficient ideas already exist" }
    }

    // Get the first user to assign as the author
    const { data: userData, error: userError } = await supabase.auth.getUser()

    let userId: string

    if (userError || !userData.user) {
      console.log("No authenticated user found, creating a demo user profile")

      // Create a demo user profile
      userId = uuidv4()

      const { error: profileError } = await supabase.from("user_profiles").insert({
        id: userId,
        full_name: "Demo User",
      })

      if (profileError) {
        console.error("Error creating demo profile:", profileError)
        return { success: false, message: "Could not create demo profile" }
      }
    } else {
      userId = userData.user.id

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
    }

    // Fetch all tags and tech stacks
    const { data: allTags, error: tagsError } = await supabase.from("tags").select("id, name")
    const { data: allTechStacks, error: techStacksError } = await supabase.from("tech_stacks").select("id, name")

    if (tagsError || !allTags) {
      console.error("Error fetching tags:", tagsError)
      return { success: false, message: "Error fetching tags" }
    }

    if (techStacksError || !allTechStacks) {
      console.error("Error fetching tech stacks:", techStacksError)
      return { success: false, message: "Error fetching tech stacks" }
    }

    // Create a map of tag names to IDs
    const tagMap = new Map(allTags.map((tag) => [tag.name, tag.id]))
    const techStackMap = new Map(allTechStacks.map((tech) => [tech.name, tech.id]))

    // Create seed ideas
    const seedIdeas: SeedIdea[] = [
      {
        title: "Build a Weather App",
        short_description: "Create a weather application that shows current conditions and forecasts",
        full_description: `# Weather App

## Overview
Build a weather application that fetches data from a weather API and displays current conditions and forecasts for locations around the world.

## Features to Implement
- Search for locations by city name or zip code
- Display current weather conditions (temperature, humidity, wind speed, etc.)
- Show 5-day forecast
- Toggle between Celsius and Fahrenheit
- Responsive design for mobile and desktop
- Geolocation to automatically detect user's location

## Tech Stack Suggestions
- React for the frontend
- OpenWeatherMap API or WeatherAPI for data
- Tailwind CSS for styling
- React Query for data fetching and caching

## Learning Opportunities
- Working with third-party APIs
- State management in React
- Handling user location data
- Creating responsive UI components
- Error handling for API requests

## Difficulty
This project is suitable for beginners who want to practice working with APIs and building interactive UIs.`,
        difficulty: "Beginner",
        tags: ["Web", "API"],
        tech_stacks: ["React", "Tailwind CSS"],
      },
      {
        title: "E-commerce Product Page",
        short_description: "Build a responsive product page with image gallery, reviews, and add-to-cart functionality",
        full_description: `# E-commerce Product Page

## Overview
Create a detailed product page for an e-commerce website with image gallery, product information, reviews, and add-to-cart functionality.

## Features to Implement
- Image gallery with thumbnails and zoom functionality
- Product details section with title, price, description, and options
- Size and color selection
- Add to cart button with quantity selector
- Product reviews section with ratings
- Related products carousel

## Tech Stack Suggestions
- Next.js for the frontend
- Tailwind CSS for styling
- Framer Motion for animations
- State management with Context API or Redux

## Learning Opportunities
- Building complex UI components
- Managing product state and options
- Creating interactive image galleries
- Implementing responsive design patterns
- Animation and micro-interactions

## Difficulty
This project is suitable for intermediate developers who want to practice building complex UI components and managing product state.`,
        difficulty: "Intermediate",
        tags: ["Web", "E-commerce"],
        tech_stacks: ["Next.js", "Tailwind CSS", "Framer Motion"],
      },
      {
        title: "Task Management Application",
        short_description: "Build a Trello-like task management app with drag-and-drop functionality",
        full_description: `# Task Management Application

## Overview
Create a Trello-like task management application with boards, lists, and cards that users can drag and drop to reorganize.

## Features to Implement
- User authentication and authorization
- Create, edit, and delete boards
- Add lists to boards (e.g., To Do, In Progress, Done)
- Create, edit, and delete cards within lists
- Drag and drop cards between lists
- Add labels, due dates, and descriptions to cards
- User profile and settings

## Tech Stack Suggestions
- React or Next.js for the frontend
- Supabase for authentication and database
- react-beautiful-dnd for drag-and-drop functionality
- Tailwind CSS for styling

## Learning Opportunities
- Complex state management
- Drag-and-drop interactions
- Real-time database updates
- User authentication and authorization
- Building a multi-page application

## Difficulty
This project is suitable for intermediate developers who want to build a complex application with multiple features.`,
        difficulty: "Intermediate",
        tags: ["Web", "Productivity"],
        tech_stacks: ["React", "Supabase", "Tailwind CSS"],
      },
      {
        title: "Real-time Chat Application",
        short_description: "Build a real-time chat application with private messaging and group chats",
        full_description: `# Real-time Chat Application

## Overview
Create a real-time chat application with features like private messaging, group chats, and online status indicators.

## Features to Implement
- User authentication and profiles
- Contact list with online status indicators
- Private one-on-one messaging
- Group chat creation and management
- Message read receipts
- Typing indicators
- File and image sharing
- Message search functionality

## Tech Stack Suggestions
- Next.js for the frontend
- Supabase for authentication and real-time database
- Tailwind CSS for styling
- Zustand or Jotai for state management

## Learning Opportunities
- Real-time data synchronization
- Complex UI state management
- User presence and status tracking
- File upload and storage
- Building a responsive chat interface

## Difficulty
This project is suitable for intermediate to advanced developers who want to learn about real-time applications.`,
        difficulty: "Advanced",
        tags: ["Web", "Communication"],
        tech_stacks: ["Next.js", "Supabase", "Tailwind CSS"],
      },
      {
        title: "Personal Finance Dashboard",
        short_description: "Create a dashboard to track personal finances, expenses, and savings goals",
        full_description: `# Personal Finance Dashboard

## Overview
Build a comprehensive personal finance dashboard that helps users track their income, expenses, and savings goals.

## Features to Implement
- User authentication and data security
- Dashboard with financial overview
- Income and expense tracking
- Category-based expense analysis
- Budget creation and monitoring
- Savings goals with progress tracking
- Transaction history and search
- Data visualization with charts and graphs

## Tech Stack Suggestions
- Next.js for the frontend
- Supabase for authentication and database
- Recharts or Chart.js for data visualization
- Tailwind CSS for styling
- React Hook Form for form handling

## Learning Opportunities
- Working with financial data
- Creating interactive dashboards
- Data visualization techniques
- Form validation and submission
- Secure handling of sensitive information

## Difficulty
This project is suitable for intermediate developers who want to build a data-driven application with complex UI components.`,
        difficulty: "Intermediate",
        tags: ["Web", "Finance"],
        tech_stacks: ["Next.js", "Supabase", "Tailwind CSS"],
      },
      {
        title: "Recipe Sharing Platform",
        short_description: "Build a platform for users to share, discover, and save cooking recipes",
        full_description: `# Recipe Sharing Platform

## Overview
Create a platform where users can share their favorite recipes, discover new ones, and save recipes to their personal collection.

## Features to Implement
- User authentication and profiles
- Recipe creation with ingredients, instructions, and images
- Recipe search and filtering by category, cuisine, or ingredients
- Rating and review system
- Save recipes to personal collection
- Social sharing functionality
- Responsive design for mobile and desktop

## Tech Stack Suggestions
- Next.js for the frontend
- Supabase for authentication and database
- Tailwind CSS for styling
- Next.js Image component for optimized images
- React Hook Form for form handling

## Learning Opportunities
- Building a content-sharing platform
- Working with rich text and media
- Implementing search and filtering functionality
- Creating a responsive layout for different devices
- Managing user-generated content

## Difficulty
This project is suitable for beginners to intermediate developers who want to build a feature-rich web application.`,
        difficulty: "Beginner",
        tags: ["Web", "Food"],
        tech_stacks: ["Next.js", "Supabase", "Tailwind CSS"],
      },
      {
        title: "Fitness Tracking Application",
        short_description: "Create an app to track workouts, set fitness goals, and monitor progress",
        full_description: `# Fitness Tracking Application

## Overview
Build a fitness tracking application that allows users to log workouts, set goals, and monitor their progress over time.

## Features to Implement
- User authentication and profiles
- Workout logging with exercises, sets, reps, and weights
- Predefined workout routines and custom workout creation
- Progress tracking with charts and statistics
- Goal setting and achievement tracking
- Calendar view of past and planned workouts
- Body measurements and weight tracking

## Tech Stack Suggestions
- React Native for cross-platform mobile app
- Firebase or Supabase for backend and authentication
- Victory or D3.js for data visualization
- Styled Components or NativeWind for styling

## Learning Opportunities
- Mobile app development
- Working with health and fitness data
- Creating interactive charts and visualizations
- Building a calendar interface
- Implementing progress tracking algorithms

## Difficulty
This project is suitable for intermediate to advanced developers who want to build a mobile application with complex features.`,
        difficulty: "Advanced",
        tags: ["Mobile", "Health"],
        tech_stacks: ["React Native", "Supabase"],
      },
      {
        title: "Job Application Tracker",
        short_description: "Build an app to track job applications, interviews, and networking contacts",
        full_description: `# Job Application Tracker

## Overview
Create an application that helps job seekers track their job applications, interview schedules, and networking contacts.

## Features to Implement
- User authentication and data security
- Job application entry with company, position, and status
- Status tracking (Applied, Interview Scheduled, Offer, Rejected)
- Interview scheduling with reminders
- Contact management for networking
- Notes and document storage for each application
- Dashboard with application statistics and insights

## Tech Stack Suggestions
- Next.js for the frontend
- Supabase for authentication and database
- Tailwind CSS for styling
- React Hook Form for form handling
- date-fns for date manipulation

## Learning Opportunities
- Building a productivity application
- Working with dates and calendars
- Creating a dashboard with statistics
- Implementing a status tracking system
- Form handling and validation

## Difficulty
This project is suitable for beginners to intermediate developers who want to build a practical web application.`,
        difficulty: "Beginner",
        tags: ["Web", "Productivity"],
        tech_stacks: ["Next.js", "Supabase", "Tailwind CSS"],
      },
      {
        title: "AI-Powered Writing Assistant",
        short_description: "Create a writing assistant that uses AI to help users improve their writing",
        full_description: `# AI-Powered Writing Assistant

## Overview
Build a writing assistant application that uses AI to help users improve their writing by providing suggestions, grammar corrections, and style improvements.

## Features to Implement
- Text editor with real-time suggestions
- Grammar and spelling correction
- Style improvement suggestions
- Tone analysis and adjustment
- Readability scoring
- Synonym suggestions
- Document saving and organization

## Tech Stack Suggestions
- Next.js for the frontend
- OpenAI API for AI capabilities
- Supabase for authentication and database
- Slate.js or Lexical for rich text editing
- Tailwind CSS for styling

## Learning Opportunities
- Working with AI APIs
- Building a rich text editor
- Natural language processing
- Real-time suggestions and corrections
- Creating a user-friendly writing interface

## Difficulty
This project is suitable for advanced developers who want to work with AI and build a complex text editing application.`,
        difficulty: "Advanced",
        tags: ["Web", "AI", "Productivity"],
        tech_stacks: ["Next.js", "Supabase", "Tailwind CSS"],
      },
      {
        title: "Social Media Dashboard",
        short_description: "Build a dashboard to manage and analyze social media accounts across platforms",
        full_description: `# Social Media Dashboard

## Overview
Create a dashboard that allows users to manage and analyze their social media accounts across multiple platforms in one place.

## Features to Implement
- Integration with social media APIs (Twitter, Instagram, Facebook, etc.)
- Unified content posting to multiple platforms
- Analytics dashboard with engagement metrics
- Content calendar and scheduling
- Hashtag research and management
- Audience insights and growth tracking
- Competitor analysis

## Tech Stack Suggestions
- Next.js for the frontend
- Node.js for API integrations
- Supabase for authentication and database
- Recharts or Chart.js for data visualization
- Tailwind CSS for styling

## Learning Opportunities
- Working with multiple third-party APIs
- Building a complex dashboard interface
- Data visualization and analytics
- Content scheduling and management
- OAuth authentication flows

## Difficulty
This project is suitable for advanced developers who want to build a complex application with multiple API integrations.`,
        difficulty: "Advanced",
        tags: ["Web", "Social Media", "Analytics"],
        tech_stacks: ["Next.js", "Node.js", "Supabase", "Tailwind CSS"],
      },
    ]

    // Insert each idea and its relationships
    for (const seedIdea of seedIdeas) {
      // Insert the idea
      const { data: idea, error: ideaError } = await supabase
        .from("ideas")
        .insert({
          title: seedIdea.title,
          short_description: seedIdea.short_description,
          full_description: seedIdea.full_description,
          difficulty: seedIdea.difficulty,
          upvotes: Math.floor(Math.random() * 50), // Random upvotes between 0 and 49
          user_id: userId,
          status: "published",
        })
        .select()
        .single()

      if (ideaError) {
        console.error(`Error seeding idea "${seedIdea.title}":`, ideaError)
        continue
      }

      // Add tags to the idea
      for (const tagName of seedIdea.tags) {
        const tagId = tagMap.get(tagName)
        if (tagId) {
          const { error: tagRelationError } = await supabase
            .from("idea_tags")
            .insert({ idea_id: idea.id, tag_id: tagId })

          if (tagRelationError) {
            console.error(`Error adding tag "${tagName}" to idea "${seedIdea.title}":`, tagRelationError)
          }
        }
      }

      // Add tech stacks to the idea
      for (const techStackName of seedIdea.tech_stacks) {
        const techStackId = techStackMap.get(techStackName)
        if (techStackId) {
          const { error: techRelationError } = await supabase
            .from("idea_tech_stacks")
            .insert({ idea_id: idea.id, tech_stack_id: techStackId })

          if (techRelationError) {
            console.error(`Error adding tech stack "${techStackName}" to idea "${seedIdea.title}":`, techRelationError)
          }
        }
      }
    }

    return {
      success: true,
      message: "Database seeded successfully with multiple ideas",
    }
  } catch (error) {
    console.error("Unexpected error in seedDatabase:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}
