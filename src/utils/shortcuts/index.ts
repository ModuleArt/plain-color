import { register, unregisterAll, isRegistered } from '@tauri-apps/plugin-global-shortcut'
import { Window } from '@tauri-apps/api/window'

export const registerGlobalShortcuts = async (triggers: { triggerOpenPicker: () => void }) => {
  // open main window
  const openMainWindowShortcut = 'CommandOrControl+Shift+P'
  isRegistered(openMainWindowShortcut).then((isRegistered) => {
    if (!isRegistered) {
      register(openMainWindowShortcut, () => {
        console.log('openMainWindowShortcut', openMainWindowShortcut)

        Window.getByLabel('main').then((mainWindow) => {
          if (mainWindow) {
            mainWindow.show()
          }
        })
      })
    }
  })

  // open picker
  const openPickerShortcut = 'CommandOrControl+Alt+P'
  isRegistered(openPickerShortcut).then((isRegistered) => {
    if (!isRegistered) {
      register(openPickerShortcut, () => {
        console.log('openPickerShortcut', openPickerShortcut)

        triggers.triggerOpenPicker()
      })
    }
  })
}

export const unregisterGlobalShortcuts = async () => {
  await unregisterAll()
}
