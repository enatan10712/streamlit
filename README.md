# Streamlit

A high-fidelity Netflix-style streaming platform built with Next.js 16. Browse cinematic content, manage up to 5 profiles, watch content with progress saving, and enjoy a premium dark UI — all powered by Firebase and TMDB.

## Features

- **Premium UI** — Cinematic dark theme with glassmorphism, Framer Motion animations, and responsive design.
- **Authentication** — Firebase Authentication supporting Email/Password and Google Sign-In.
- **Profiles** — Support for up to 5 profiles per account with custom avatars.
- **Browse Experience** — Dynamic hero banner, horizontal scrolling rows, hover previews, and rich detail modals.
- **Content filtering** — Category and genre-based filtering using the TMDB Discovery API.
- **Video player** — Professional playback experience using Vidstack with fullscreen, volume, speed controls, and subtitles.
- **Persistence** — "Continue Watching" and "My List" functionality synced to Firebase Firestore.
- **Search** — Debounced multi-search across movies and TV shows.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Backend | Firebase (Auth & Firestore) |
| Content API | TMDB (The Movie Database) |
| Video Player | Vidstack |
| State | Zustand |
| Animations | Framer Motion |

## Prerequisites

- **Node.js** 22 or later
- **Firebase Account** (for Auth and Firestore)
- **TMDB API Key** (from [themoviedb.org](https://www.themoviedb.org/documentation/api))

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd streamlit
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root directory and add your credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# TMDB Configuration
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_TMDB_API_URL=https://api.themoviedb.org/3
```

### 3. Start the development server

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
│   ├── browse/       # Main catalog with genre filtering
│   ├── profiles/     # Profile management
│   ├── watch/        # Vidstack video player integration
│   ├── search/       # Debounced search results
│   ├── subscribe/    # UI-only subscription plans
│   └── account/      # Account settings & logout
├── components/       # Reusable UI components (Modals, Rows, Cards)
├── lib/              # Firebase, TMDB, and Auth helpers
├── store/            # Global state (Auth, Profiles, Watchlist)
└── types/            # TypeScript definitions
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/auth/login` | Sign in |
| `/auth/register` | Create account |
| `/profiles` | Profile selection & creation |
| `/browse` | Main content catalog |
| `/watch/[id]` | Video player with progress saving |
| `/search` | Search movies and shows |
| `/subscribe` | Subscription tiers (UI) |
| `/account` | User settings |

## Deployment

The project is optimized for deployment on Vercel.

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Add all environment variables listed in `.env.local` to the Vercel project settings.
4. The build command is `next build`.

## License

Private project.
