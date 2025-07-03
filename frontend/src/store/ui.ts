import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme, Language } from "../types/index";

interface UIState {
  theme: Theme;
  language: Language;
  sidebarOpen: boolean;
  searchQuery: string;

  // Theme & UI actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "LIGHT",
      language: "EN",
      sidebarOpen: false,
      searchQuery: "",

      setTheme: (theme: Theme) => {
        set({ theme });
        document.documentElement.setAttribute(
          "data-bs-theme",
          theme.toLowerCase()
        );
      },

      setLanguage: (language: Language) => {
        set({ language });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
