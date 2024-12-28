import { create } from 'zustand'

type TPickerTarget = 'HOME'

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
  pickerTarget: 'HOME',
}))
