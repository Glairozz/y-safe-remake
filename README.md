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

## Deployment (Vercel)

This project is configured for Vercel via `vercel.json`:

- **Build command:** `npm run build` (installs and builds the Vite client)
- **Output directory:** `client/dist`
- The Express API in `server.js` is exposed as a serverless function through
  `api/index.js`. Requests to `/api/*` and `/health` are routed to it, and all
  other paths fall back to the SPA.
- On Vercel the project directory is read-only, so SQLite is written to
  `/tmp/database.sqlite`. That data does **not** persist across function
  instances — use an external database if you need durable storage.

Set these environment variables in the Vercel project (Settings → Environment
Variables):

| Variable | Purpose |
| --- | --- |
| `JWT_SECRET` | Secret for signing JWTs |
| `ADMIN_PASSWORD` | Admin console password |
| `DATABASE_PATH` | Optional; defaults to `/tmp/database.sqlite` on Vercel |

## Attribution & License

Developed by the **Y-SAFE Team** for ELIAS A. SALVADOR NATIONAL HIGH SCHOOL.

Released under the ISC license, as declared in `package.json`.
