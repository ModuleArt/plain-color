import { create } from 'zustand'

interface IPickerState {
  isPicking: boolean
  openPicker: () => void
}

export const usePickerStore = create<IPickerState>()((set) => ({
  isPicking: false,
  openPicker: () => set(() => ({ isPicking: true })),
}))
