import { IPlainlibComponentProps } from '@/lib/types'
import { Icon } from '@phosphor-icons/react'

export interface IButtonProps extends IPlainlibComponentProps {
  icon?: Icon
  onClick?: () => void
  variant?: 'fill' | 'outline' | 'clear'
  tinted?: boolean
  label?: string
  size?: 'inline' | 'regular'
}
