import { IPlainlibComponentProps } from '@/lib/types'

export interface IImageProps extends IPlainlibComponentProps {
  src: string
  width?: number
  height?: number
}
