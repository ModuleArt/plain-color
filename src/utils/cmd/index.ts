import { invoke, InvokeArgs } from '@tauri-apps/api/core'

export type TInvokeCmd =
  | 'start_picker_loop'
  | 'stop_picker_loop'
  | 'set_picker_preview_size'
  | 'set_picker_color_profile'
  | 'check_macos_screen_recording_permission'
  | 'request_macos_screen_recording_permission'
  | 'open_macos_screen_recording_settings'

export const invokeCmd = <T>(cmd: TInvokeCmd, args?: InvokeArgs) => {
  return invoke<T>(cmd, args)
}
