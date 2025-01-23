import { IPlainlibComponentProps } from '@/lib/types'
import { ReactNode } from 'react'

export interface IScrollerProps extends IPlainlibComponentProps {
  extraPaddingTop?: boolean
  extraPaddingBottom?: boolean
  virtualScrollRenderItem?: (index: number) => ReactNode
  virtualScrollItemCount?: number
  virtualScrollItemSize?: number
}
