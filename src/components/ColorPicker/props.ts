import { IPlainlibComponentProps } from '@/lib/types'

export interface IColorPickerProps extends IPlainlibComponentProps<null> {
  hexValue: string
  onChange?: (hexValue: string) => void
}
