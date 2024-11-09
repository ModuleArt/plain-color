import { FC, PropsWithChildren } from 'react'
import './index.scss'
import { IWindowTitlebarProps } from './props'
import cn from 'classnames'
import { commonComponentClasses } from '@/lib'
import { Stack } from '@/components/Stack'
import { Button } from '../Button'
import { X, Minus } from '@phosphor-icons/react'
import { Window } from '@tauri-apps/api/window'

export const WindowTitlebar: FC<PropsWithChildren<IWindowTitlebarProps>> = ({
  color = 'window',
  leftIndent = 0,
  windowControls = false,
  ...props
}) => {
  const onClose = () => {
    Window.getByLabel('main').then((mainWindow) => {
      if (mainWindow) {
        mainWindow.close()
      }
    })
  }

  const onMinimize = () => {
    Window.getByLabel('main').then((mainWindow) => {
      if (mainWindow) {
        mainWindow.minimize()
      }
    })
  }

  return (
    <div
      data-tauri-drag-region
      className={cn('window-titlebar', [`window-titlebar--color-${color}`], commonComponentClasses(props))}
      style={{ paddingLeft: `${leftIndent}px` }}
    >
      {props.children}
      {windowControls && (
        <Stack gap="none">
          <Button icon={Minus} variant="clear" onClick={onMinimize} />
          <Button icon={X} variant="clear" onClick={onClose} />
        </Stack>
      )}
    </div>
  )
}
