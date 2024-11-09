import { IColor } from '@/types/color'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IColorsState {
  colors: IColor[]
  addColor: (color: IColor) => void
  removeColor: (colorId: string) => void
  updateColor: (colorId: string, payload: Omit<IColor, 'id'>) => void
  clearAllColors: () => void
}

export const useColorsStore = create<IColorsState>()(
  persist(
    (set) => ({
      colors: [],
      addColor: (color) => set((state) => ({ colors: [color, ...state.colors] })),
      removeColor: (colorId) => set((state) => ({ colors: state.colors.filter((color) => color.id !== colorId) })),
      updateColor: (colorId, payload) =>
        set((state) => ({
          colors: state.colors.map((color) => (color.id === colorId ? { ...color, ...payload } : color)),
        })),
      clearAllColors: () => set(() => ({ colors: [] })),
    }),
    {
      name: 'PlainColor_colors',
    }
  )
)
