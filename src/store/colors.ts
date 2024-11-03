import { IColor } from '@/types/color'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IColorsState {
  colors: IColor[]
  addColor: (color: IColor) => void
  removeColor: (colorId: string) => void
}

export const useColorsStore = create<IColorsState>()(
  persist(
    (set) => ({
      colors: [],
      addColor: (color) => set((state) => ({ colors: [...state.colors, color] })),
      removeColor: (colorId) => set((state) => ({ colors: state.colors.filter((color) => color.id !== colorId) })),
    }),
    {
      name: 'PlainColor_colors',
    }
  )
)
