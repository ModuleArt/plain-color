import { IPlainlibComponentProps } from '@/lib/types'

export interface IImageProps extends IPlainlibComponentProps<HTMLImageElement> {
  src: string
  width?: number
  height?: number
}
