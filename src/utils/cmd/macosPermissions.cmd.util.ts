import { invokeCmd } from '.'

export const invokeCheckMacosScreenRecordingPermission = async () => {
  return invokeCmd<boolean>('check_macos_screen_recording_permission')
}

export const invokeRequestMacosScreenRecordingPermission = async () => {
  return invokeCmd<boolean>('request_macos_screen_recording_permission')
}

export const invokeOpenMacosScreenRecordingSettings = async () => {
  return invokeCmd<null>('open_macos_screen_recording_settings')
}
