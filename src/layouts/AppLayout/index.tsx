import { FC, useEffect, useRef, useState } from 'react'
import { WindowTitlebar } from '@/components/WindowTitlebar'
import { WindowContent } from '@/components/WindowContent'
import { Outlet } from 'react-router-dom'
import { usePickerStore } from '@/store/picker.store'
import { Window } from '@tauri-apps/api/window'
import { listen, UnlistenFn } from '@tauri-apps/api/event'
import namer from 'color-namer'
import { useColorsStore } from '@/store/colors.store'
import { Logo } from '@/components/Logo'
import { getPlatform } from '@/utils/tauri.util'
import { Header } from '@/components/Header'
import { Stack } from '@/components/Stack'
import { exit } from '@tauri-apps/plugin-process'
import { generateRandomUuid } from '@/utils/uuid.util'
import { disableDefaultContextMenu } from '@/utils/contextMenu.util'
import { ContextMenu } from '@/components/ContextMenu'
import { invokeFetchPreview } from '@/utils/cmd/picker.cmd.util'
import { usePalettesStore } from '@/store/palettes.store'

export const AppLayout: FC = () => {
  const pickerStore = usePickerStore()
  const colorsStore = useColorsStore()
  const palettesStore = usePalettesStore()
  const [pickingInterval, setPickingInterval] = useState<NodeJS.Timeout | null>(null)
  const platform = getPlatform()
  const previewSize = useRef(12) // should be even

  useEffect(() => {
    if (pickerStore.isPicking) {
      if (!pickingInterval) {
        Window.getByLabel('picker').then((pickerWindow) => {
          if (pickerWindow) {
            pickerWindow.show()

            const interval = setInterval(() => {
              invokeFetchPreview({ size: previewSize.current })
            }, 50)
            setPickingInterval(interval)
          }
        })
      }
    } else {
      if (pickingInterval) {
        Window.getByLabel('picker').then((pickerWindow) => {
          if (pickerWindow) {
            pickerWindow.hide()

            clearInterval(pickingInterval)
            setPickingInterval(null)
          }
        })
      }
    }
  }, [pickerStore.isPicking])

  useEffect(() => {
    disableDefaultContextMenu()

    Window.getByLabel('main').then((mainWindow) => {
      if (mainWindow) {
        mainWindow.onCloseRequested(() => {
          exit()
        })
      }
    })
  }, [])

  useEffect(() => {
    const listeners: Promise<UnlistenFn>[] = []

    listeners.push(
      listen<string>('color_picked', (event) => {
        const label = namer(event.payload).ntc[0].name

        const newColor = { id: generateRandomUuid(), label, hex: event.payload }

        switch (pickerStore.pickerTarget.target) {
          case 'HOME':
            colorsStore.addColor(newColor)
            break
          case 'PALETTE':
            palettesStore.addColorToPalette(pickerStore.pickerTarget.paletteId, newColor)
            break
        }

        pickerStore.closePicker()
      })
    )

    listeners.push(
      listen<string>('preview_zoom_out', () => {
        if (previewSize.current < 32) {
          previewSize.current += 2
        }
      })
    )

    listeners.push(
      listen<string>('preview_zoom_in', () => {
        if (previewSize.current > 4) {
          previewSize.current -= 2
        }
      })
    )

    listeners.push(
      listen<string>('color_canceled', () => {
        pickerStore.closePicker()
      })
    )

    return () => {
      listeners.map((unlisten) => unlisten.then((f) => f()))
    }
  }, [pickerStore.pickerTarget])

  return (
    <>
      <WindowTitlebar color="bg" windowControls={platform !== 'macos'}>
        {platform === 'macos' ? (
          <Header pointerEvents="disable" grow>
            <Logo />
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
