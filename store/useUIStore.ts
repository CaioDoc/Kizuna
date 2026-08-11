import { create } from "zustand";

export interface UIStoreState {
  sidebarOpen: boolean;
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  theme: "dark" | "light";

  // Actions
  toggleSidebar: () => void;
  openModal: (type: string, data?: Record<string, unknown> | null) => void;
  closeModal: () => void;
  setTheme: (theme: "dark" | "light") => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
  sidebarOpen: true,
  activeModal: null,
  modalData: null,
  theme: "dark",

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  openModal: (type, data = null) => set({ activeModal: type, modalData: data }),

  closeModal: () => set({ activeModal: null, modalData: null }),

  setTheme: (theme) => set({ theme }),
}));
