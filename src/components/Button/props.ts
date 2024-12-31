import { IPlainlibComponentProps } from '@/lib/types'
import { Icon } from '@phosphor-icons/react'
import { MouseEvent } from 'react'

export interface IButtonProps extends IPlainlibComponentProps<HTMLButtonElement> {
  iconPre?: Icon
  iconPost?: Icon
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  variant?: 'fill' | 'outline' | 'clear'
  tinted?: boolean
  label?: string
  size?: 'inline' | 'regular'
  padding?: 'none' | 'small' | 'medium' | 'large'
  nativeTooltip?: string
  justify?: 'start' | 'end' | 'center' | 'between'
  maxWidth?: number
  growLabel?: boolean
  tintedLabel?: boolean
  textWrap?: boolean
  tintedIconPre?: boolean
  tintedIconPost?: boolean
}
