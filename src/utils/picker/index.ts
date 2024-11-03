import { Window } from '@tauri-apps/api/window'
import { Webview } from '@tauri-apps/api/webview'

export const createMagnifyingGlassWindow = () => {
  const appWindow = new Window('PlainColor Magnifying Glass')

  const webview = new Webview(appWindow, 'theUniqueLabel', {
    url: 'path/to/page.html',
  })
}
