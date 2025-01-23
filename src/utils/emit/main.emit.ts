import { emitTo, listen } from '@tauri-apps/api/event'

interface TEmitToMainPayload {
  color_picked: { color: string; closePicker: boolean; instantCopy: boolean }
  preview_zoom_in: {}
  preview_zoom_out: {}
  preview_canceled: {}
  toggle_guidelines: { show: boolean }
  trigger_deep_link: string[]
  open_settings_page: {}
  open_about_page: {}
}

export type TEmitToMainCmd =
  | { cmd: 'color_picked'; payload: TEmitToMainPayload['color_picked'] }
  | { cmd: 'preview_zoom_in'; payload: TEmitToMainPayload['preview_zoom_in'] }
  | { cmd: 'preview_zoom_out'; payload: TEmitToMainPayload['preview_zoom_out'] }
  | { cmd: 'preview_canceled'; payload: TEmitToMainPayload['preview_canceled'] }
  | { cmd: 'toggle_guidelines'; payload: TEmitToMainPayload['toggle_guidelines'] }
  | { cmd: 'trigger_deep_link'; payload: TEmitToMainPayload['trigger_deep_link'] }
  | { cmd: 'open_settings_page'; payload: TEmitToMainPayload['open_settings_page'] }
  | { cmd: 'open_about_page'; payload: TEmitToMainPayload['open_about_page'] }

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
