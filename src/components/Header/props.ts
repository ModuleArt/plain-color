import { IPlainlibComponentProps } from '@/lib/types'
import { ReactNode } from 'react'

export interface IHeaderProps extends IPlainlibComponentProps {
  leftElement?: ReactNode
  rightElement?: ReactNode
}
