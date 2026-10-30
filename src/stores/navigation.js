import { create } from 'zustand'

// Keep the mobile drawer state shared without persisting an open overlay across visits.
export const useNavigationDrawer = create(set => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false })
}))
