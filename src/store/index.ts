import { create } from 'zustand'

interface AppState {
  isLoaded: boolean
  setLoaded: (loaded: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  isLoaded: false,
  setLoaded: (loaded) => set({ isLoaded: loaded }),
}))
