import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchListItem {
  id: string;
  type: 'movie' | 'tv';
  title: string;
  posterPath: string;
  rating: number;
  addedAt: number;
}

interface WatchListState {
  favorites: WatchListItem[];
  continueWatching: Record<
    string,
    { progress: number; duration: number; lastUpdated: number }
  >;
  addFavorite: (item: WatchListItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  updateProgress: (
    contentId: string,
    progress: number,
    duration: number
  ) => void;
  getProgress: (contentId: string) => number;
}

export const useWatchListStore = create<WatchListState>()(
  persist(
    (set, get) => ({
      favorites: [],
      continueWatching: {},

      addFavorite: (item) =>
        set((state) => ({
          favorites: [item, ...state.favorites.filter((f) => f.id !== item.id)],
        })),

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),

      isFavorite: (id) => get().favorites.some((f) => f.id === id),

      updateProgress: (contentId, progress, duration) =>
        set((state) => ({
          continueWatching: {
            ...state.continueWatching,
            [contentId]: {
              progress,
              duration,
              lastUpdated: Date.now(),
            },
          },
        })),

      getProgress: (contentId) =>
        get().continueWatching[contentId]?.progress || 0,
    }),
    {
      name: 'watchlist-storage',
    }
  )
);
