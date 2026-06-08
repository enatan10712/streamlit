import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  createdAt: number;
  updatedAt: number;
  watchHistory: WatchHistoryItem[];
  favorites: string[];
  continueWatching: ContinueWatchingItem[];
}

export interface WatchHistoryItem {
  contentId: string;
  contentType: 'movie' | 'tv';
  title: string;
  watchedAt: number;
  duration: number;
}

export interface ContinueWatchingItem {
  contentId: string;
  contentType: 'movie' | 'tv';
  title: string;
  posterPath: string;
  progress: number;
  duration: number;
  lastWatchedAt: number;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
}));
