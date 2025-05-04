# Supabase Database Management

This directory contains scripts for managing your Supabase database schema and data.

## Structure

- `migrations/`: Contains SQL migration files that define your database schema
- `seed.sql`: Contains SQL to seed your database with initial data

## Running Migrations and Seeds

You can run migrations and seeds using the provided script:

\`\`\`bash
node scripts/db-setup.js
\`\`\`

Make sure you have the following environment variables set:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (with admin privileges)

## Migration Files

Migration files are named with a timestamp prefix to ensure they run in the correct order. For example:

- `20240503_initial_schema.sql`
- `20240504_add_comments_table.sql`

## Adding New Migrations

When you need to make changes to your database schema:

1. Create a new migration file in the `migrations/` directory with a timestamp prefix
2. Write the SQL for your schema changes
3. Run the migrations script

## Seed Data

The `seed.sql` file contains data that will be inserted into your database. By default, it includes:

- Tags for categorizing ideas

There's also commented-out code for adding sample ideas if you want to use them.

## Local Development

For local development with Supabase, you can use the Supabase CLI to start a local instance:

\`\`\`bash
supabase start
\`\`\`

Then run the migrations and seeds against your local instance.
