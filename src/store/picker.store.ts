import { create } from 'zustand'

type TPickerTarget = { target: 'HOME' } | { target: 'PALETTE'; paletteId: string }

interface IPickerState {
  isPicking: boolean
  openPicker: (pickerTarget: TPickerTarget) => void
  closePicker: () => void
  pickerTarget: TPickerTarget
}

export const usePickerStore = create<IPickerState>()((set) => ({
  isPicking: false,
  openPicker: (pickerTarget) => set(() => ({ isPicking: true, pickerTarget })),
  closePicker: () => set(() => ({ isPicking: false })),
  pickerTarget: { target: 'HOME' },
}))
