import { seedTagsAndTechStacks } from "@/lib/supabase/seed-metadata"
import { seedDatabase } from "@/lib/supabase/seed-data"

export default async function SeedPage() {
  // First seed tags and tech stacks
  const metadataResult = await seedTagsAndTechStacks()

  // Then seed ideas
  const ideasResult = await seedDatabase()

  const success = metadataResult.success && ideasResult.success

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Database Seeding</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Seeding Status</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium">Tags and Tech Stacks:</span>
            <span className={metadataResult.success ? "text-green-500" : "text-red-500"}>
              {metadataResult.success ? "Success" : "Failed"}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium">Project Ideas:</span>
            <span className={ideasResult.success ? "text-green-500" : "text-red-500"}>
              {ideasResult.success ? "Success" : "Failed"}
            </span>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>{metadataResult.message}</p>
            <p>{ideasResult.message}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <a
          href="/admin"
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Back to Admin
        </a>

        <a href="/browse" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Browse Ideas
        </a>
      </div>
    </div>
  )
}
