import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/assets/scss/global.scss'
import { Routes } from './routes'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
)
