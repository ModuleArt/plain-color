import { invoke, InvokeArgs } from '@tauri-apps/api/core'

export type TInvokeCmd =
  | 'fetch_preview'
  | 'check_macos_screen_recording_permission'
  | 'request_macos_screen_recording_permission'
  | 'open_macos_screen_recording_settings'

export const invokeCmd = <T>(cmd: TInvokeCmd, args?: InvokeArgs) => {
  return invoke<T>(cmd, args)
}