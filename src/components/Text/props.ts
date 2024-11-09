import { IPlainlibComponentProps } from '@/lib/types'

export interface ITextProps extends IPlainlibComponentProps {
  tinted?: boolean
  text: string
  transform?: 'none' | 'uppercase' | 'lowercase'
  editable?: boolean
  onTextChange?: (text: string) => void
}
