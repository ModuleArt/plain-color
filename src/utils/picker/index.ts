import { Window } from '@tauri-apps/api/window'
import { Webview } from '@tauri-apps/api/webview'

export const createMagnifyingGlassWindow = () => {
  console.log('createMagnifyingGlassWindow')

  const appWindow = new Window('PlainColor Magnifying Glass')

  console.log(appWindow)

  new Webview(appWindow, 'PlainColor Magnifying Glass', {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    url: './picker.html',
  })

  appWindow.show()
}
