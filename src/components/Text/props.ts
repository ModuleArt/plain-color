import { IPlainlibComponentProps, TPlainlibRef } from '@/lib/types'

export interface ITextProps extends IPlainlibComponentProps {
  tinted?: boolean
  text: string
  transform?: 'none' | 'uppercase' | 'lowercase'
  editable?: boolean
  onTextChange?: (text: string) => void
  onInputBlur?: () => void
  size?: 'regular' | 'small'
  textRef?: TPlainlibRef<HTMLSpanElement>
  align?: 'left' | 'center' | 'right'
  labelClassName?: string
  inputClassName?: string
  maxWidth?: number
  textWrap?: boolean
}
