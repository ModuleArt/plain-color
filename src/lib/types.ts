import { RefObject } from 'react'

export interface IPlainlibComponentProps<T> {
  pointerEvents?: 'enable' | 'disable'
  grow?: boolean
  className?: string
  containerRef?: RefObject<T>
}
