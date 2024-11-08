import { FC, useEffect, useState } from 'react'
import {
  House,
  // Palette
} from '@phosphor-icons/react'
import { WindowTitlebar } from '@/components/WindowTitlebar'
import { Tabs } from '@/components/Tabs'
import { WindowContent } from '@/components/WindowContent'
import { Outlet, useNavigate } from 'react-router-dom'
import { usePickerStore } from '@/store/picker'
import { invoke } from '@tauri-apps/api/core'
import { Window } from '@tauri-apps/api/window'
import { listen, UnlistenFn } from '@tauri-apps/api/event'
import namer from 'color-namer'
import { useColorsStore } from '@/store/colors'
import { Stack } from '@/components/Stack'
import { Logo } from '@/components/Logo'

const tabs = [
  { id: 'home', icon: House },
  // { id: 'palettes', icon: Palette },
]

export const AppLayout: FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const navigate = useNavigate()
  const pickerStore = usePickerStore()
  const colorsStore = useColorsStore()
  const [pickingInterval, setPickingInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    switch (activeTab) {
      case 'home':
        navigate('/', { replace: true })
        break
      case 'palettes':
        navigate('/palettes', { replace: true })
        break
    }
  }, [activeTab])

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
      <WindowTitlebar>
        <Stack grow justify="between" pointerEvents="disable">
          <Tabs tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} pointerEvents="enable" />
          <Logo />
        </Stack>
      </WindowTitlebar>
      <WindowContent>
        <Outlet />
      </WindowContent>
    </>
  )
}
