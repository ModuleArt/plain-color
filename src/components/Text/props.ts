import { IPlainlibComponentProps } from '@/lib/types'
import { RefObject } from 'react'

export interface ITextProps extends IPlainlibComponentProps {
  tinted?: boolean
  text: string
  transform?: 'none' | 'uppercase' | 'lowercase'
  editable?: boolean
  onTextChange?: (text: string) => void
  onInputBlur?: () => void
  size?: 'regular' | 'small'
  textRef?: RefObject<HTMLSpanElement>
  align?: 'left' | 'center' | 'right'
}
