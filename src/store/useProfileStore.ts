import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile } from './useAuthStore';

interface ProfileStoreState {
  profiles: Profile[];
  currentProfile: Profile | null;
  setProfiles: (profiles: Profile[]) => void;
  setCurrentProfile: (profile: Profile | null) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (profile: Profile) => void;
}

export const useProfileStore = create<ProfileStoreState>()(
  persist(
    (set) => ({
      profiles: [],
      currentProfile: null,

      setProfiles: (profiles) => set({ profiles }),

      setCurrentProfile: (profile) => set({ currentProfile: profile }),

      addProfile: (profile) =>
        set((state) => ({
          profiles: [...state.profiles, profile],
        })),

      updateProfile: (profile) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === profile.id ? profile : p
          ),
        })),
    }),
    {
      name: 'profile-storage',
    }
  )
);
