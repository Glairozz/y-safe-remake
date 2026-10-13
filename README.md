# Y-SAFE Web

Essential First Aid & Safety Awareness Website for ELIAS A. SALVADOR NATIONAL HIGH SCHOOL.

## Features

- Public landing page at `/`
- Login / registration (name + section) and guest access at `/login`
- Protected dashboard at `/dashboard`
- First Aid tutorials, Safety Awareness, and First Aid Essentials lessons with quizzes
- Progress tracking (lessons completed, quizzes taken, average score)
- Admin console at `/admin` (users, quizzes, lessons, stats)
- Legacy `.html` URLs redirect to their modern equivalents

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router, Lucide React
- **Backend**: Node.js, Express, SQLite, JWT

## Getting Started

```bash
npm install        # install backend dependencies
npm run build      # install client dependencies and build the frontend
npm start          # serve everything from Express on :3000
```

Development (two terminals):

```bash
npm run dev          # Express API on :3000
npm run dev:client   # Vite dev server with /api proxy
```

## Environment Variables

Copy `.env.example` to `.env` and adjust the values for your environment. Never commit
real secrets.

| Variable | Purpose |
| --- | --- |
| `PORT` | Server port (default 3000) |
| `JWT_SECRET` | Secret for signing JWTs |
| `ADMIN_PASSWORD` | Admin console password |
| `DATABASE_PATH` | SQLite database location |

## Routes

| Route | Behavior |
| --- | --- |
| `/` | Landing page |
| `/login` | Login (redirects to `/dashboard` when authenticated) |
| `/register` | Same login screen, framed for registration |
| `/dashboard` | Protected dashboard |
| `/first-aid`, `/safety`, `/essentials` | Protected lesson modules |
| `/admin-login`, `/admin` | Admin console |
| `/dashboard.html` etc. | 301 redirect to the modern route |

## Project Structure

```
server.js            Express backend (API + SPA hosting)
package.json         Root scripts and backend dependencies
client/
  index.html         Vite HTML entry point
  public/images/     Static image assets
  src/
    components/      UI, layout, and lesson components
    content/         Centralized user-facing copy
    data/            Lesson, video, and quiz content
    hooks/           Auth context
    pages/           Route pages
    services/        API client layer
    types/           Shared TypeScript types
```

## Deployment

This repository contains the application source and local development/build
configuration only. It intentionally excludes platform-specific deployment
configuration and deployment artifacts. Configure the hosting platform of your
choice (for example, Vercel) and its environment variables yourself.

## Attribution & License

Developed by the **Y-SAFE Team** for ELIAS A. SALVADOR NATIONAL HIGH SCHOOL.

Released under the ISC license, as declared in `package.json`.
