import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Language type ─────────────────────────────────────────────────────────────
export type Language = 'en' | 'es';

// ── Store interface ───────────────────────────────────────────────────────────
interface PortfolioState {
  // Navigation / UI state
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  showAbout: boolean;
  setShowAbout: (show: boolean) => void;

  // i18n state — persisted to localStorage
  language: Language;
  toggleLanguage: () => void;
}

// ── Store — persist wraps only the 'language' key ────────────────────────────
// We use the 'partialize' option so that volatile UI state (activeCategory,
// showAbout) is never written to localStorage, only the language preference.
export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      // Navigation / UI
      activeCategory: null,
      setActiveCategory: (category) => set({ activeCategory: category }),
      showAbout: false,
      setShowAbout: (show) => set({ showAbout: show }),

      // i18n
      language: 'en',
      toggleLanguage: () =>
        set({ language: get().language === 'en' ? 'es' : 'en' }),
    }),
    {
      name: 'portfolio-lang',           // localStorage key
      partialize: (state) => ({         // persist ONLY the language field
        language: state.language,
      }),
    },
  ),
);
