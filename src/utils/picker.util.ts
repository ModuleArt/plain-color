import {
  invokeCheckMacosScreenRecordingPermission,
  invokeRequestMacosScreenRecordingPermission,
} from '@/utils/cmd/macosPermissions.cmd.util'
import { IS_DEBUG } from '@/config'

export const preparePickerForOpen = async (onReady: () => void) => {
  const authorized = await invokeCheckMacosScreenRecordingPermission()
  if (authorized || IS_DEBUG) {
    onReady()
  } else {
    invokeRequestMacosScreenRecordingPermission()
  }
}
