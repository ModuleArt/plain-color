import { ECopyVariant } from '@/types/settings.types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export enum EColorProfile {
  SYSTEM = 'SYSTEM',
  SRGB = 'SRGB',
}

interface ISettingsState {
  quickCopyVariants: ECopyVariant[]
  setQuickCopyVariants: (quickCopyVariants: ECopyVariant[]) => void
  defaultCopyVariant: ECopyVariant
  setDefaultCopyVariant: (defaultCopyVariant: ECopyVariant) => void
  pickerPreviewSize: number
  setPickerPreviewSize: (pickerPreviewSize: number) => void
  pickerColorProfile: EColorProfile
  setPickerColorProfile: (pickerColorProfile: EColorProfile) => void
}

export const useSettingsStore = create<ISettingsState>()(
  persist(
    (set) => ({
      quickCopyVariants: [ECopyVariant.HEX_WITH_SHARP, ECopyVariant.CSS_RGB],
      setQuickCopyVariants: (quickCopyVariants) => set(() => ({ quickCopyVariants })),
      defaultCopyVariant: ECopyVariant.HEX_WITH_SHARP,
      setDefaultCopyVariant: (defaultCopyVariant) => set(() => ({ defaultCopyVariant })),
      pickerPreviewSize: 12,
      setPickerPreviewSize: (pickerPreviewSize) => set(() => ({ pickerPreviewSize })),
      pickerColorProfile: EColorProfile.SRGB,
      setPickerColorProfile: (pickerColorProfile) => set(() => ({ pickerColorProfile })),
    }),
    {
      name: 'PlainColor_settings',
    }
  )
)
