import { FC, useEffect, useState } from 'react'
import { WindowTitlebar } from '@/components/WindowTitlebar'
import { WindowContent } from '@/components/WindowContent'
import { Outlet } from 'react-router-dom'
import { usePickerStore } from '@/store/picker'
import { invoke } from '@tauri-apps/api/core'
import { Window } from '@tauri-apps/api/window'
import { listen, UnlistenFn } from '@tauri-apps/api/event'
import namer from 'color-namer'
import { useColorsStore } from '@/store/colors'
import { Logo } from '@/components/Logo'
import { getPlatform } from '@/utils/tauri.util'
import { Header } from '@/components/Header'
import { Stack } from '@/components/Stack'
import { exit } from '@tauri-apps/plugin-process'

export const AppLayout: FC = () => {
  const pickerStore = usePickerStore()
  const colorsStore = useColorsStore()
  const [pickingInterval, setPickingInterval] = useState<NodeJS.Timeout | null>(null)
  const platform = getPlatform()

  useEffect(() => {
    if (pickerStore.isPicking) {
      if (!pickingInterval) {
        Window.getByLabel('picker').then((pickerWindow) => {
          if (pickerWindow) {
            pickerWindow.show()

            const interval = setInterval(() => {
              invoke('fetch_preview', { size: 12 }) // should be even
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
    const listeners: Promise<UnlistenFn>[] = []

    Window.getByLabel('main').then((mainWindow) => {
      if (mainWindow) {
        mainWindow.onCloseRequested(() => {
          exit()
        })
      }
    })

    listeners.push(
      listen<string>('color_picked', (event) => {
        const label = namer(event.payload).ntc[0].name

        switch (pickerStore.pickerTarget) {
          case 'HOME':
            colorsStore.addColor({ id: crypto.randomUUID(), label, hex: event.payload })
            break
        }

        pickerStore.closePicker()
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
  }, [])

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
    </>
  )
}
