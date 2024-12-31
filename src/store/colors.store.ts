import { IColor } from '@/types/color.types'
import { generateRandomUuid } from '@/utils/uuid.util'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IColorsState {
  colors: IColor[]
  addColor: (color: IColor) => void
  removeColor: (colorId: string) => void
  updateColor: (colorId: string, payload: Omit<IColor, 'id'>) => void
  duplicateColor: (colorId: string) => void
  clearAllColors: () => void
}

export const useColorsStore = create<IColorsState>()(
  persist(
    (set) => ({
      colors: [{ id: 'default', label: 'Mine Shaft', hex: '2c2c2c' }],
      addColor: (color) => set((state) => ({ colors: [color, ...state.colors] })),
      removeColor: (colorId) => set((state) => ({ colors: state.colors.filter((color) => color.id !== colorId) })),
      updateColor: (colorId, payload) =>
        set((state) => ({
          colors: state.colors.map((color) => (color.id === colorId ? { ...color, ...payload } : color)),
        })),
      duplicateColor: (colorId) =>
        set((state) => {
          const colorToDuplicateIndex = state.colors.findIndex((color) => color.id === colorId)
          const colorToDuplicate = state.colors[colorToDuplicateIndex]
          return {
            colors: state.colors.toSpliced(colorToDuplicateIndex, 0, {
              ...colorToDuplicate,
              id: generateRandomUuid(),
            }),
          }
        }),
      clearAllColors: () => set(() => ({ colors: [] })),
    }),
    {
      name: 'PlainColor_colors',
    }
  )
)
