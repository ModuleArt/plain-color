import { Platform, platform } from '@tauri-apps/plugin-os'

declare global {
  interface Window {
    __TAURI_INTERNALS__: Record<string, unknown>
  }
}

export type TPlatform = 'web' | Platform

export const getPlatform = (): TPlatform => {
  return window.__TAURI_INTERNALS__ ? platform() : 'web'
}
