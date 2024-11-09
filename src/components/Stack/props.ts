import { IPlainlibComponentProps } from '@/lib/types'
import { CSSProperties } from 'react'

export interface IStackProps extends IPlainlibComponentProps {
  dir?: 'horizontal' | 'vertical'
  style?: CSSProperties
  justify?: 'start' | 'end' | 'center' | 'between'
  align?: 'start' | 'end' | 'center'
  gap?: 'none' | 'small' | 'medium' | 'large'
}
