import { emitTo, listen } from '@tauri-apps/api/event'

interface TEmitToPickerPayload {
  picker_loop_tick: [string, [number, number, number, number], number]
  toggle_guidelines: { show: boolean }
}

export type TEmitToPickerCmd = { cmd: 'toggle_guidelines'; payload: TEmitToPickerPayload['toggle_guidelines'] }

export const emitToPicker = (cmd: TEmitToPickerCmd) => {
  return emitTo('main', cmd.cmd, cmd.payload)
}

export const listenInPicker = <K extends keyof TEmitToPickerPayload>(
  cmd: K,
  callback: (payload: TEmitToPickerPayload[K]) => void
) => {
  return listen(cmd, ({ payload }) => {
    callback(payload as TEmitToPickerPayload[K])
  })
}
