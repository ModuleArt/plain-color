import { IPlainlibComponentProps } from '@/lib/types'
import { Icon } from '@phosphor-icons/react'

export interface IIconProps extends IPlainlibComponentProps {
  icon: Icon
  width?: number
  height?: number
  tinted?: boolean
}
