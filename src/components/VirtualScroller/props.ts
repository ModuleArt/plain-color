import { IPlainlibComponentProps } from '@/lib/types'
import { ReactNode } from 'react'

export interface IVirtualScrollerProps<T> extends IPlainlibComponentProps {
  items: T[]
  itemSize: number
  renderItem: (item: T) => ReactNode
  columnCount?: number
}
