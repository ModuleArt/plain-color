import { RefCallback, RefObject } from 'react'

export interface IPlainlibComponentProps {
  pointerEvents?: 'enable' | 'disable'
  grow?: boolean
  className?: string
}

export type TPlainlibRef<T> = RefObject<T | HTMLElement> | RefCallback<T | HTMLElement>
