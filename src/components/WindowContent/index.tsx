import { FC, PropsWithChildren } from 'react'
import './index.scss'

export const WindowContent: FC<PropsWithChildren> = ({ children }) => {
  return <div className="window-content">{children}</div>
}
