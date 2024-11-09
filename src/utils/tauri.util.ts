declare global {
  interface Window {
    __TAURI_INTERNALS__: Record<string, unknown>
  }
}

export type TPlatform = 'web' | 'macos' | 'windows'

export const getPlatform = (): TPlatform => {
  return window.__TAURI_INTERNALS__ ? 'macos' : 'web'
}
