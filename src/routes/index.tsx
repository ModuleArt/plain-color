import { FC } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

// layouts
import { AppLayout } from '@/layouts/AppLayout'

// pages
import { HomePage } from '@/pages/HomePage'
import { PalettesPage } from '@/pages/PalettesPage'
import { ColorPage } from '@/pages/ColorPage'
import { AboutPage } from '@/pages/AboutPage'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path="palettes" element={<PalettesPage />} />
      <Route path="color" element={<ColorPage />} />
      <Route path="color/:id" element={<ColorPage />} />
      <Route path="about" element={<AboutPage />} />
    </Route>
  )
)

export const Routes: FC = () => {
  return <RouterProvider router={router} />
}
