# LocalLens

LocalLens is a Next.js app for discovering and reviewing local businesses.

It includes:
- Business discovery with search and multi-filter support
- Category and location based browsing
- Business detail pages with reviews and ratings
- Favorites and profile pages persisted in local storage
- Mock auth flow with role-based admin access
- Admin dashboard for review moderation and content management

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint 9

## Project Structure

Key directories:
- app/: routes and page-level UI
- components/: reusable UI and feature components
- lib/: mock data, shared types, and local storage helpers
- public/: static assets

## Available Routes

- /: home discovery page
- /businesses: business listing page
- /business/[id]: business details
- /business/[id]/review: review submit flow
- /categories/[category]: category listing
- /favorites: saved businesses
- /profile: user profile
- /login: login screen
- /signup: signup screen
- /admin: admin dashboard

## Local Development

Prerequisites:
- Node.js 20+
- npm 10+

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

App runs at:

http://localhost:3000

## Authentication and Data Notes

- Auth is mock/client-side and stored in local storage.
- Any valid email + password length >= 6 works.
- Admin role is granted when:
	- email is admin@locallens.test, or
	- email ends with @admin.local
- Business and admin data currently come from local mock data files.
- Favorites, profile, and pending user reviews are saved in browser local storage.

## Important Files

- app/ui/HomePage.tsx: home search/filter experience
- components/AuthProvider.tsx: auth state and role logic
- app/admin/page.tsx: admin dashboard
- lib/mockData.ts: business/review seed data
- lib/adminMockData.ts: admin seed data
- lib/userStorage.ts: local storage helpers

## Future Improvements

- Replace mock auth with real authentication
- Persist data via backend/database
- Add server-side validation and moderation workflow
- Add automated tests for critical flows

## License

No license file is currently configured for this repository.
