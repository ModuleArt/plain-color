import { IPlainlibComponentProps } from '@/lib/types'

export interface ITextProps extends IPlainlibComponentProps<HTMLSpanElement> {
  tinted?: boolean
  text: string
  transform?: 'none' | 'uppercase' | 'lowercase'
  editable?: boolean
  onTextChange?: (text: string) => void
  size?: 'regular' | 'small'
}
