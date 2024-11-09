import { FC, PropsWithChildren } from 'react'
import './index.scss'
import { IWindowTitlebarProps } from './props'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'
import { getPlatform } from '@/utils/tauri.util'

export const WindowTitlebar: FC<PropsWithChildren<IWindowTitlebarProps>> = ({ ...props }) => {
  const platform = getPlatform()

  return (
    <div
      data-tauri-drag-region
      className={cn('window-titlebar', [`window-titlebar--${platform}`], commonComponentClasses(props))}
    >
      {props.children}
    </div>
  )
}
