import { EColorProfile } from '@/store/settings.store'
import { invokeCmd } from '.'

export const invokeStartPickerLoop = async () => {
  return invokeCmd<boolean>('start_picker_loop')
}

export const invokeStopPickerLoop = async () => {
  return invokeCmd<boolean>('stop_picker_loop')
}

export const invokeSetPickerPreviewSize = async (args: { size: number }) => {
  return invokeCmd<boolean>('set_picker_preview_size', args)
}

export const invokeSetPickerColorProfile = async (args: { profile: EColorProfile }) => {
  return invokeCmd<boolean>('set_picker_color_profile', args)
}
