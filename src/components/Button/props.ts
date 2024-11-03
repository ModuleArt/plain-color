import { Icon } from '@phosphor-icons/react'

export interface IButtonProps {
  icon?: Icon
  onClick?: () => void
  variant?: 'fill' | 'outline' | 'clear'
  tinted?: boolean
  label?: string
  size?: 'inline' | 'regular'
  grow?: boolean
}
