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
    }),
    {
      name: 'PlainColor_palettes',
    }
  )
)
