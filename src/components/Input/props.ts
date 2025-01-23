import { IPlainlibComponentProps, TPlainlibRef } from '@/lib/types'
import { KeyboardEvent } from 'react'

export interface IInputProps extends IPlainlibComponentProps {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  autoComplete?: 'off'
  autoCorrect?: 'off'
  autoCapitalize?: 'off'
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  handleDefaultKeyboardShortcuts?: boolean
  inputRef?: TPlainlibRef<HTMLInputElement>
}
