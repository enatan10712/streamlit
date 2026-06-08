import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileState {
  activeProfileId: string | null;
  setActiveProfileId: (id: string | null) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      activeProfileId: null,
      setActiveProfileId: (id) => set({ activeProfileId: id }),
    }),
    {
      name: "profile-storage",
    }
  )
);
