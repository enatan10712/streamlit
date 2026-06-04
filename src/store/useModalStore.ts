import { create } from 'zustand';
export const useModalStore = create<any>((set) => ({
  isOpen: false,
  content: null,
  openModal: (content: any) => set({ isOpen: true, content }),
  closeModal: () => set({ isOpen: false, content: null }),
}));
