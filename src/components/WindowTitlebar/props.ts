import { IPlainlibComponentProps } from '@/lib/types'

export interface IWindowTitlebarProps extends IPlainlibComponentProps {
  color?: 'window' | 'bg'
  leftIndent?: number
  windowControls?: boolean
}
