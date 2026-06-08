# Streamlit

A Netflix-style streaming platform built with Next.js. Browse movies and shows, manage profiles, watch content, and subscribe to plans — all in a cinematic dark UI.

## Features

- **Landing page** — Marketing homepage with animated hero and plan overview
- **Authentication** — Email/password sign-up and sign-in via NextAuth (Google OAuth optional)
- **Profiles** — Up to 5 viewer profiles per account
- **Browse** — Hero banner, horizontal content rows, hover previews, and detail modals
- **Video player** — HLS streaming with Vidstack
- **Search** — Full-text search across the content library
- **Subscriptions** — Stripe-powered checkout (optional)
- **Admin** — Content management dashboard

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL + Prisma 7 |
| Auth | NextAuth.js |
| Payments | Stripe |
| State | Zustand |
| Animations | Framer Motion |

## Prerequisites

- **Node.js** 20 or later
- **PostgreSQL** running locally (or a hosted database URL)
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd streamlit
npm install
```

### 2. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Random secret for session encryption |

Optional variables for Google sign-in and Stripe are listed in `.env.example`.

### 3. Set up the database

Make sure PostgreSQL is running, then apply the schema:

```bash
npx prisma migrate dev
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/              # Pages and API routes (App Router)
│   ├── auth/         # Login & register
│   ├── browse/       # Main catalog
│   ├── profiles/     # Profile selection
│   ├── watch/        # Video player
│   ├── search/       # Search results
│   ├── subscribe/    # Pricing plans
│   └── admin/        # Admin dashboard
├── components/       # Reusable UI components
├── actions/          # Server actions
├── lib/              # Auth, Prisma, Stripe helpers
└── store/            # Client-side state (Zustand)

prisma/
└── schema.prisma     # Database schema
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/auth/login` | Sign in |
| `/auth/register` | Create account |
| `/profiles` | Choose a profile |
| `/browse` | Content catalog (requires auth) |
| `/watch/[id]` | Video player |
| `/search` | Search content |
| `/subscribe` | Subscription plans |
| `/admin` | Admin dashboard |

## Production

```bash
npm run build
npm run start
```

Set all environment variables on your hosting platform (e.g. Vercel). The app is configured for Vercel deployment via `vercel.json`.

## License

Private project.
