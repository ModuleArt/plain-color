import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/assets/scss/global.scss'
import { PickerLayout } from '@/layouts/PickerLayout'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PickerLayout />
  </React.StrictMode>
)
