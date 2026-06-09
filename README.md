# ComicVerseAI

An AI-powered comic collection companion that understands what you own, connects your books to storylines, creators, characters, events, and reading orders, then recommends what to read or collect next.

## Current Scope

This first pass is only the web dashboard template.

## Run Locally

```powershell
npm install
npm run dev:web
```

Then open:

```text
http://localhost:3000
```

## Database

The app is set up for PostgreSQL with Prisma. This keeps the early cost low while leaving a clean path to AI features later with pgvector embeddings in the same database.

Recommended hosted options:

- Supabase Postgres if you want built-in auth/storage later and first-class pgvector support.
- Neon Postgres if you want a lightweight serverless Postgres database.

Create your local env file from the example:

```powershell
Copy-Item apps/web/.env.example apps/web/.env.local
```

Set `DATABASE_URL` in `apps/web/.env.local`, then run:

```powershell
npm --workspace apps/web run db:generate
npm --workspace apps/web run db:migrate
```

Useful DB commands:

```powershell
npm --workspace apps/web run db:studio
npm --workspace apps/web run db:push
```

## Later Stack

- Next.js web dashboard
- React Native / Expo mobile app
- PostgreSQL with pgvector
- AI/RAG pipelines that read from the collection schema and write embeddings back to Postgres
- Cloudflare R2
- Clerk
