# Database Setup with Drizzle ORM

This project uses Drizzle ORM with Supabase PostgreSQL database.

## Environment Variables

Add the following variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key

# Database Configuration for Drizzle
DATABASE_URL=your_supabase_database_url

# Creem API Configuration
CREEM_API_KEY=your_creem_api_key
CREEM_WEBHOOK_SECRET=your_creem_webhook_secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Getting Your Database URL

1. Go to your Supabase project dashboard
2. Navigate to Settings > Database
3. Copy the connection string under "Connection string"
4. Replace `[YOUR-PASSWORD]` with your actual database password

## Available Commands

- `pnpm db:generate` - Generate migration files from schema changes
- `pnpm db:migrate` - Apply migrations to the database
- `pnpm db:push` - Push schema changes directly to the database (for development)
- `pnpm db:studio` - Open Drizzle Studio for database management

## Usage

1. Define your tables in `lib/db/schema.ts`
2. Generate migrations: `pnpm db:generate`
3. Apply migrations: `pnpm db:migrate`
4. Use the database client in your app: `import { db } from '@/lib/db'`

## File Structure

- `lib/db/index.ts` - Database client configuration
- `lib/db/schema.ts` - Database schema definitions
- `lib/db/migrations/` - Generated migration files (auto-created)
- `drizzle.config.ts` - Drizzle configuration 