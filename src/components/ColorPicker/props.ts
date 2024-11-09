import { IPlainlibComponentProps } from '@/lib/types'

export interface IColorPickerProps extends IPlainlibComponentProps {
  hexValue: string
  onChange?: (hexValue: string) => void
}
