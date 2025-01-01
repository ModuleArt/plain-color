import { FC } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

// layouts
import { AppLayout } from '@/layouts/AppLayout'

// pages
import { HomePage } from '@/pages/HomePage'
import { PalettesPage } from '@/pages/PalettesPage'
import { PalettePage } from '@/pages/PalettePage'
import { ColorPage } from '@/pages/ColorPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { KeybindingsPage } from '@/pages/KeybindingsPage'
import { AboutPage } from '@/pages/AboutPage'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path="palettes" element={<PalettesPage />} />
      <Route path="palettes/:paletteId" element={<PalettePage />} />
      <Route path="palettes/:paletteId/color" element={<ColorPage />} />
      <Route path="palettes/:paletteId/color/:colorId" element={<ColorPage />} />
      <Route path="color" element={<ColorPage />} />
      <Route path="color/:colorId" element={<ColorPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="keybindings" element={<KeybindingsPage />} />
      <Route path="about" element={<AboutPage />} />
    </Route>
  )
)

export const Routes: FC = () => {
  return <RouterProvider router={router} />
}
