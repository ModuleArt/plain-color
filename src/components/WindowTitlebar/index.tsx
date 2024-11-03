import { FC, PropsWithChildren } from 'react'
import './index.scss'

export const WindowTitlebar: FC<PropsWithChildren> = (props) => {
  return (
    <div data-tauri-drag-region className="window-titlebar">
      {props.children}
    </div>
  )
}
