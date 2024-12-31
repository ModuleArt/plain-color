import { IColor } from '@/types/color.types'
import { IPalette } from '@/types/palette.types'
import { generateRandomUuid } from '@/utils/uuid.util'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IColorsState {
  palettes: IPalette[]
  addPalette: (palette: IPalette) => void
  removePalette: (paletteId: string) => void
  updatePalette: (paletteId: string, payload: Omit<IPalette, 'id'>) => void
  duplicatePalette: (paletteId: string) => void
  addColorToPalette: (paletteId: string, payload: Omit<IColor, 'id'>) => void
  removeColorFromPalette: (paletteId: string, colorId: string) => void
  duplicateColorInPalette: (paletteId: string, colorId: string) => void
  updateColorInPalette: (paletteId: string, colorId: string, payload: Omit<IColor, 'id'>) => void
}

export const usePalettesStore = create<IColorsState>()(
  persist(
    (set) => ({
      palettes: [],
      addPalette: (palette) => set((state) => ({ palettes: [palette, ...state.palettes] })),
      removePalette: (paletteId) =>
        set((state) => ({ palettes: state.palettes.filter((palette) => palette.id !== paletteId) })),
      updatePalette: (paletteId, payload) =>
        set((state) => ({
          palettes: state.palettes.map((palette) => (palette.id === paletteId ? { ...palette, ...payload } : palette)),
        })),
      duplicatePalette: (paletteId) =>
        set((state) => {
          const paletteToDuplicateIndex = state.palettes.findIndex((palette) => palette.id === paletteId)
          const paletteToDuplicate = state.palettes[paletteToDuplicateIndex]
          return {
            palettes: state.palettes.toSpliced(paletteToDuplicateIndex, 0, {
              ...paletteToDuplicate,
              id: generateRandomUuid(),
            }),
          }
        }),
      addColorToPalette: (paletteId, payload) =>
        set((state) => ({
          palettes: state.palettes.map((palette) =>
            palette.id === paletteId
              ? { ...palette, colors: [{ ...payload, id: generateRandomUuid() }, ...palette.colors] }
              : palette
          ),
        })),
      removeColorFromPalette: (paletteId, colorId) =>
        set((state) => ({
          palettes: state.palettes.map((palette) =>
            palette.id === paletteId
              ? { ...palette, colors: palette.colors.filter((color) => color.id !== colorId) }
              : palette
          ),
        })),
      duplicateColorInPalette: (paletteId, colorId) =>
        set((state) => ({
          palettes: state.palettes.map((palette) => {
            if (palette.id !== paletteId) return palette
            const colorToDuplicateIndex = palette.colors.findIndex((color) => color.id === colorId)
            const colorToDuplicate = palette.colors[colorToDuplicateIndex]
            return {
              ...palette,
              colors: palette.colors.toSpliced(colorToDuplicateIndex, 0, {
                ...colorToDuplicate,
                id: generateRandomUuid(),
              }),
            }
          }),
        })),
      updateColorInPalette: (paletteId, colorId, payload) =>
        set((state) => ({
          palettes: state.palettes.map((palette) =>
            palette.id === paletteId
              ? {
                  ...palette,
                  colors: palette.colors.map((color) => (color.id === colorId ? { ...color, ...payload } : color)),
                }
              : palette
          ),
        })),
    }),
    {
      name: 'PlainColor_palettes',
    }
  )
)
