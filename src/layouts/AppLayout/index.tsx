import { FC, useEffect, useState } from 'react'
import { WindowTitlebar } from '@/components/WindowTitlebar'
import { WindowContent } from '@/components/WindowContent'
import { Outlet } from 'react-router-dom'
import { usePickerStore } from '@/store/picker.store'
import { Window } from '@tauri-apps/api/window'
import { UnlistenFn } from '@tauri-apps/api/event'
import { useColorsStore } from '@/store/colors.store'
import { Logo } from '@/components/Logo'
import { getPlatform } from '@/utils/tauri.util'
import { Header } from '@/components/Header'
import { Stack } from '@/components/Stack'
import { exit } from '@tauri-apps/plugin-process'
import { generateRandomUuid } from '@/utils/uuid.util'
import { disableDefaultContextMenu } from '@/utils/contextMenu.util'
import { ContextMenu } from '@/components/ContextMenu'
import { invokeSetPickerPreviewSize, invokeStartPickerLoop, invokeStopPickerLoop } from '@/utils/cmd/picker.cmd.util'
import { usePalettesStore } from '@/store/palettes.store'
import { listenInMain } from '@/utils/emit'
import { formatCopyText } from '@/utils/copyVariants.util'
import { useSettingsStore } from '@/store/settings.store'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { generateColorLabel } from '@/utils/color'
import { registerGlobalShortcuts, unregisterGlobalShortcuts } from '@/utils/shortcuts'
import { preparePickerForOpen } from '@/utils/picker.util'

export const AppLayout: FC = () => {
  const pickerStore = usePickerStore()
  const colorsStore = useColorsStore()
  const palettesStore = usePalettesStore()
  const settingsStore = useSettingsStore()
  const [isPickerLoopActive, setIsPickerLoopActive] = useState(false)
  const platform = getPlatform()

  useEffect(() => {
    if (pickerStore.isPicking) {
      if (!isPickerLoopActive) {
        Window.getByLabel('picker').then((pickerWindow) => {
          if (pickerWindow) {
            pickerWindow.show()

            setIsPickerLoopActive(true)
            invokeStartPickerLoop()
          }
        })
      }
    } else {
      if (isPickerLoopActive) {
        Window.getByLabel('picker').then((pickerWindow) => {
          if (pickerWindow) {
            pickerWindow.hide()

            setIsPickerLoopActive(false)
            invokeStopPickerLoop()
          }
        })
      }
    }
  }, [pickerStore.isPicking])

  useEffect(() => {
    invokeSetPickerPreviewSize({ size: settingsStore.pickerPreviewSize })
  }, [settingsStore.pickerPreviewSize])

  useEffect(() => {
    disableDefaultContextMenu()
    registerGlobalShortcuts({
      triggerOpenPicker: () => {
        preparePickerForOpen(() => pickerStore.openPicker({ target: 'HOME' }))
      },
    })

    Window.getByLabel('main').then((mainWindow) => {
      if (mainWindow) {
        mainWindow.onCloseRequested(() => {
          exit()
        })
      }
    })

    return () => {
      unregisterGlobalShortcuts()
    }
  }, [])

  useEffect(() => {
    const listeners: Promise<UnlistenFn>[] = []

    listeners.push(
      listenInMain('color_picked', (payload) => {
        const label = generateColorLabel(payload.color)
        const newColor = { id: generateRandomUuid(), label, hex: payload.color }

        switch (pickerStore.pickerTarget.target) {
          case 'HOME':
            colorsStore.addColor(newColor)
            break
          case 'PALETTE':
            palettesStore.addColorToPalette(pickerStore.pickerTarget.paletteId, newColor)
            break
        }

        if (payload.instantCopy) {
          const text = formatCopyText(payload.color, settingsStore.defaultCopyVariant)
          writeText(text)
        }

        if (payload.closePicker) {
          pickerStore.closePicker()
        }
      })
    )

    listeners.push(
      listenInMain('preview_zoom_out', () => {
        if (settingsStore.pickerPreviewSize < 32) {
          settingsStore.setPickerPreviewSize(settingsStore.pickerPreviewSize + 2)
        }
      })
    )

    listeners.push(
      listenInMain('preview_zoom_in', () => {
        if (settingsStore.pickerPreviewSize > 4) {
          settingsStore.setPickerPreviewSize(settingsStore.pickerPreviewSize - 2)
        }
      })
    )

    listeners.push(
      listenInMain('preview_canceled', () => {
        pickerStore.closePicker()
      })
    )

    return () => {
      listeners.map((unlisten) => unlisten.then((f) => f()))
    }
  }, [pickerStore.pickerTarget, settingsStore.defaultCopyVariant, settingsStore.pickerPreviewSize])

  return (
    <>
      <WindowTitlebar color="bg" windowControls={platform !== 'macos'}>
        {platform === 'macos' ? (
          <Header pointerEvents="disable" grow>
            <Logo grow />
          </Header>
        ) : (
          <Stack pointerEvents="disable" grow>
            <Logo />
          </Stack>
        )}
      </WindowTitlebar>
      <WindowContent>
        <Outlet />
      </WindowContent>
      <ContextMenu />
    </>
  )
}
