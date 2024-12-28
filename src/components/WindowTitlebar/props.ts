import { IPlainlibComponentProps } from '@/lib/types'

export interface IWindowTitlebarProps extends IPlainlibComponentProps<HTMLDivElement> {
  color?: 'window' | 'bg'
  leftIndent?: number
  windowControls?: boolean
}
