import { invokeCmd } from '.'

export const invokeStartPickerLoop = async (args: { size: number }) => {
  return invokeCmd<boolean>('start_picker_loop', args)
}

export const invokeStopPickerLoop = async () => {
  return invokeCmd<boolean>('stop_picker_loop')
}
