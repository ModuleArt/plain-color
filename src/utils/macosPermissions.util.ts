import { invoke } from '@tauri-apps/api/core'

export const checkMacosScreenRecordingPermission = async () => {
  return invoke<boolean>('check_macos_screen_recording_permission')
}

export const requestMacosScreenRecordingPermission = async () => {
  return invoke<null>('request_macos_screen_recording_permission')
}
