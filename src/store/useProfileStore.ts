import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
  activeProfileId: string | null;
  setActiveProfile: (id: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      activeProfileId: null,
      setActiveProfile: (id: string) => set({ activeProfileId: id }),
    }),
    {
      name: 'profile-storage',
    }
  )
);
