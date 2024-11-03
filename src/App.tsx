import { FC, useEffect, useState } from 'react'
import { House, Palette, Eyedropper, Plus } from '@phosphor-icons/react'
import namer from 'color-namer'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { WindowTitlebar } from '@/components/WindowTitlebar'
import { Tabs } from '@/components/Tabs'
import { WindowContent } from '@/components/WindowContent'
import { Stack } from '@/components/Stack'
import { Button } from '@/components/Button'
import { useColorsStore } from '@/store/colors'
import { ColorCard } from '@/components/ColorCard'
import { rgbToHex } from './utils/color'

const tabs = [
  { id: 'home', icon: House },
  { id: 'palette', icon: Palette },
]

const App: FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const colorsStore = useColorsStore()

  useEffect(() => {
    listen<[number, number, number]>('color_picked', (event) => {
      const hex = rgbToHex({ red: event.payload[0], green: event.payload[1], blue: event.payload[2], alpha: 1 })
      const label = namer(hex).ntc[0].name

      colorsStore.addColor({ id: crypto.randomUUID(), label, hex })
    })
  }, [])

  const pickColor = () => {
    invoke('pick_color')
  }

  const addColor = () => {
    colorsStore.addColor({ id: crypto.randomUUID(), label: 'Red', hex: 'ec6a5e' })
  }

  return (
    <>
      <WindowTitlebar>
        <Tabs tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />
      </WindowTitlebar>
      <WindowContent>
        <Stack dir="vertical">
          <Stack itemsGrow>
            <Button icon={Eyedropper} variant="outline" tinted onClick={pickColor} />
            <Button icon={Plus} variant="outline" tinted onClick={addColor} />
          </Stack>
          {colorsStore.colors.map((color) => (
            <ColorCard color={color} onDelete={() => colorsStore.removeColor(color.id)} />
          ))}
        </Stack>
      </WindowContent>
    </>
  )
}

export default App
