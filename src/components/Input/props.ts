import { IPlainlibComponentProps } from '@/lib/types'
import { KeyboardEvent, RefObject } from 'react'

export interface IInputProps extends IPlainlibComponentProps {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  autoComplete?: 'off'
  autoCorrect?: 'off'
  autoCapitalize?: 'off'
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  inputRef?: RefObject<HTMLInputElement>
}
