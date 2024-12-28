import { IPlainlibComponentProps } from '@/lib/types'
import { ReactNode } from 'react'

export interface IHeaderProps extends IPlainlibComponentProps<HTMLDivElement> {
  leftElement?: ReactNode
  rightElement?: ReactNode
}
