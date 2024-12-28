import { IPlainlibComponentProps } from '@/lib/types'
import { CSSProperties } from 'react'

export interface IStackProps extends IPlainlibComponentProps<HTMLDivElement> {
  dir?: 'horizontal' | 'vertical'
  style?: CSSProperties
  justify?: 'start' | 'end' | 'center' | 'between'
  align?: 'start' | 'end' | 'center'
  gap?: 'none' | 'extra-small' | 'small' | 'medium' | 'large'
  padding?: 'none' | 'extra-small' | 'small' | 'medium' | 'large'
}
