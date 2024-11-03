import { FC, useEffect, useState } from 'react'
import { House, Palette } from '@phosphor-icons/react'
import { WindowTitlebar } from '@/components/WindowTitlebar'
import { Tabs } from '@/components/Tabs'
import { WindowContent } from '@/components/WindowContent'
import { Outlet, useNavigate } from 'react-router-dom'
import { rgbToHex } from '@/utils/color'
import namer from 'color-namer'
import { useColorsStore } from './store/colors'
import { listen, emit } from '@tauri-apps/api/event'
import { usePickerStore } from './store/picker'
import { invoke } from '@tauri-apps/api/core'
import { Window } from '@tauri-apps/api/window'

const tabs = [
  { id: 'home', icon: House },
  { id: 'palettes', icon: Palette },
]

const App: FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const navigate = useNavigate()
  const colorsStore = useColorsStore()
  const pickerStore = usePickerStore()
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
    listen<[number, number, number]>('color_picked', (event) => {
      const hex = rgbToHex({ red: event.payload[0], green: event.payload[1], blue: event.payload[2], alpha: 1 })
      const label = namer(hex).ntc[0].name

      colorsStore.addColor({ id: crypto.randomUUID(), label, hex })
    })

    listen<string>('preview_fetched', (event) => {
      emit('image_received', event.payload)
    })
  }, [])

  useEffect(() => {
    if (pickerStore.isPicking) {
      if (!pickingInterval) {
        Window.getByLabel('picker').then((pickerWindow) => {
          if (pickerWindow) {
            pickerWindow.show()

            const interval = setInterval(() => {
              invoke('fetch_preview')
            }, 1000)
            setPickingInterval(interval)
          }
        })
      }
    } else {
      if (pickingInterval) {
        Window.getByLabel('picker').then((pickerWindow) => {
          if (pickerWindow) {
            clearInterval(pickingInterval)
            setPickingInterval(null)
          }
        })
      }
    }
  }, [pickerStore.isPicking])

  return (
    <>
      <WindowTitlebar>
        <Tabs tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />
      </WindowTitlebar>
      <WindowContent>
        <Outlet />
      </WindowContent>
    </>
  )
}

export default App
