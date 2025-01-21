import { emitTo, listen } from '@tauri-apps/api/event'

interface TEmitToMainPayload {
  color_picked: { color: string; closePicker: boolean; instantCopy: boolean }
  preview_zoom_in: {}
  preview_zoom_out: {}
  preview_canceled: {}
  toggle_guidelines: { show: boolean }
  open_file: string
}

export type TEmitToMainCmd =
  | { cmd: 'color_picked'; payload: TEmitToMainPayload['color_picked'] }
  | { cmd: 'preview_zoom_in'; payload: TEmitToMainPayload['preview_zoom_in'] }
  | { cmd: 'preview_zoom_out'; payload: TEmitToMainPayload['preview_zoom_out'] }
  | { cmd: 'preview_canceled'; payload: TEmitToMainPayload['preview_canceled'] }
  | { cmd: 'toggle_guidelines'; payload: TEmitToMainPayload['toggle_guidelines'] }
  | { cmd: 'open_file'; payload: TEmitToMainPayload['open_file'] }

export const emitToMain = (cmd: TEmitToMainCmd) => {
  return emitTo('main', cmd.cmd, cmd.payload)
}

export const listenInMain = <K extends keyof TEmitToMainPayload>(
  cmd: K,
  callback: (payload: TEmitToMainPayload[K]) => void
) => {
  return listen(cmd, ({ payload }) => {
    callback(payload as TEmitToMainPayload[K])
  })
}
