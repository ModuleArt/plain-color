import { FC, useEffect, useState } from 'react'
import { WindowTitlebar } from './components/WindowTitlebar'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { Tabs } from './components/Tabs'
import { House } from '@phosphor-icons/react'

const tabs = [{ id: 'home', icon: House }]

const App: FC = () => {
  const [color, setColor] = useState('')

  useEffect(() => {
    listen<any>('color_picked', (event) => {
      setColor(JSON.stringify(event))
    })
  }, [])

  const pickColor = () => {
    invoke<any>('pick_color')
  }

  return (
    <main className="app">
      <WindowTitlebar>
        <Tabs tabs={tabs} />
      </WindowTitlebar>
      <div>
        <button onClick={pickColor}>Pick color</button>
      </div>
      {color}
    </main>
  )
}

export default App
