# Streamlit Implementation Guide

## Quick Start

### 1. Environment Setup
Copy `.env.local.example` to `.env.local` and add:
- Firebase credentials
- TMDB API key

### 2. Firebase Setup
1. Create a Firebase project
2. Enable Firebase Authentication (Email/Password & Google Sign-In)
3. Create a Firestore database
4. Add your credentials to `.env.local`

### 3. TMDB Setup
1. Go to https://www.themoviedb.org/settings/api
2. Get your API key
3. Add to `.env.local`

### 4. Run Locally
```bash
npm install
npm run dev
```

## Architecture Overview

### Authentication Flow
1. User registers/logs in via Firebase Auth
2. Auth context manages session persistence
3. Middleware protects routes
4. Upon auth, user is redirected to profile selection

### Data Storage
- **Firebase Firestore**: User profiles, watch history, favorites, continue watching
- **TMDB API**: Movie/TV show data
- **Local Storage (Zustand)**: UI state, favorites cache

### Component Structure
- `/src/app`: Next.js app router pages
- `/src/components`: Reusable React components
- `/src/lib`: Utilities, Firebase config, TMDB client, Firestore helpers
- `/src/store`: Zustand stores for state management

## Key Features Implemented

### Authentication
- ✅ Email/Password signup & login
- ✅ Google Sign-In
- ✅ Session persistence
- ✅ Protected routes

### Profiles
- ✅ Multiple profiles (up to 5) per account
- ✅ Custom avatars
- ✅ Per-profile watch history & favorites
- ✅ Profile selection on login

### Content
- ✅ TMDB integration for movies/shows
- ✅ Trending, popular, top-rated, upcoming
- ✅ Search functionality
- ✅ Content details & cast info

### Video Player
- Vidstack player with:
  - Fullscreen mode
  - Volume & playback speed controls
  - Progress bar & timestamp
  - Continue watching tracking

### UI/UX
- ✅ Dark theme with purple/blue gradients
- ✅ Responsive design (mobile-first)
- ✅ Animations with Framer Motion
- ✅ Loading states & skeletons
- ✅ Toast notifications (Sonner)
- ✅ Error boundaries

## Deployment

### Vercel Deployment
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

No custom backend required - Firebase handles all server-side logic!

## API Routes Used

### TMDB Endpoints
- GET `/trending/{media_type}/week`
- GET `/movie/popular`
- GET `/movie/top_rated`
- GET `/movie/upcoming`
- GET `/tv/popular`
- GET `/search/multi`
- GET `/movie/{id}` (with credits)

### Firestore Collections
```
/users/{userId}
  - email
  - displayName
  - createdAt
  - updatedAt
  
/users/{userId}/profiles/{profileId}
  - name
  - avatar
  - watchHistory: []
  - favorites: []
  - continueWatching: []
  - createdAt
  - updatedAt
```

## Future Enhancements

- Add Stripe integration for subscription plans
- Implement movie/show recommendations engine
- Add social features (sharing, reviews)
- Create admin dashboard
- Add more authentication methods (Facebook, Apple)
- Implement watch party feature
- Add content rating & parental controls
