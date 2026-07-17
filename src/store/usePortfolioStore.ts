import { create } from 'zustand';

interface PortfolioState {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  activeCategory: null,
  setActiveCategory: (category) => set({ activeCategory: category }),
}));
