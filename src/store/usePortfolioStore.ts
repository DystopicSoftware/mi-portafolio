import { create } from 'zustand';

interface PortfolioState {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  showAbout: boolean;
  setShowAbout: (show: boolean) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  activeCategory: null,
  setActiveCategory: (category) => set({ activeCategory: category }),
  showAbout: false,
  setShowAbout: (show) => set({ showAbout: show }),
}));

