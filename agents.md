# AGENTS.md

## Project Purpose

This is to display the movies for one single user (myself). It shows a list of movies that I have watched on the homepage and then have single pages for additional information about each movie.

## Tech Stack

- TypeScript
- Next.js 16
- Next.js using SSR
- Supabase for database
- Netlify for hosting

## Setup commands and tasks

- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
- Run tests: `pnpm vitest`
- Build for production: `pnpm build`
- Lint code: `pnpm lint`
- Format JS, TS, and CSS: `pnpm format`
- Check typescript files: `pnpm type-check`
- Generate design tokens: `pnpm generate:tokens`

## Important Files

- next.config.ts - Config for next.js
- vitest.config.mts - Config for testing with vitest
- src/utils/supabase - This is where the Utility functions for getting data from Supabase live

## Code style

- TypeScript strict mode
- single quotes, no semicolons
- Use functional patterns where possible

## Key Directories

- `/src/app` - Next.js app structure
- `/src/components` - React components
- `/src/utils` - Utility functions
- `/src/types` - TypeScript type definitions
- `/scripts` - Build/automation scripts

## Database Schema

## Environment Variables

- NEXT_LOGIN_REDIRECT
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_TMDB_KEY

## Architecture Notes

For the most part this is a display application, just show the data from supabase.

- The Home page `/`
- Single movie pages `/movie/[slug]`

The exception will be that there will be feature to add new movies. This will be limited to logged in users.

- Route: `/add-movie`
- This will let a user set the watch data and movie data for a new movie. The movie data will come by searching TMDB.

## Debugging Tips

- Checking for exposing the api keys especially for TMDB in the client side.
