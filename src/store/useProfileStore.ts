import { create } from 'zustand';
export const useProfileStore = create<any>((set) => ({
  activeProfileId: null,
  setActiveProfile: (id: string) => set({ activeProfileId: id }),
}));
