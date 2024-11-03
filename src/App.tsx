import { FC, useEffect, useState } from 'react'
import { House, Palette } from '@phosphor-icons/react'
import { WindowTitlebar } from '@/components/WindowTitlebar'
import { Tabs } from '@/components/Tabs'
import { WindowContent } from '@/components/WindowContent'
import { Outlet, useNavigate } from 'react-router-dom'

const tabs = [
  { id: 'home', icon: House },
  { id: 'palettes', icon: Palette },
]

const App: FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const navigate = useNavigate()

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
