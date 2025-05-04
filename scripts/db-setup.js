import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigrations() {
  console.log("Running migrations...")

  try {
    const migrationsDir = path.join(process.cwd(), "supabase/migrations")
    const migrationFiles = fs.readdirSync(migrationsDir).sort()

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`)
      const migrationSql = fs.readFileSync(path.join(migrationsDir, file), "utf8")

      const { error } = await supabase.query(migrationSql)
      if (error) {
        console.error(`Error running migration ${file}:`, error)
        throw error
      }

      console.log(`Successfully ran migration: ${file}`)
    }

    console.log("All migrations completed successfully!")
    return true
  } catch (error) {
    console.error("Error running migrations:", error)
    return false
  }
}

async function runSeed() {
  console.log("Running seed...")

  try {
    const seedPath = path.join(process.cwd(), "supabase/seed.sql")
    const seedSql = fs.readFileSync(seedPath, "utf8")

    const { error } = await supabase.query(seedSql)
    if (error) {
      console.error("Error running seed:", error)
      throw error
    }

    console.log("Seed completed successfully!")
    return true
  } catch (error) {
    console.error("Error running seed:", error)
    return false
  }
}

async function main() {
  const migrationsSuccess = await runMigrations()

  if (migrationsSuccess) {
    await runSeed()
  }
}

main()
