import { IPlainlibComponentProps } from '@/lib/types'
import { CSSProperties, RefObject } from 'react'

export interface IStackProps extends IPlainlibComponentProps {
  dir?: 'horizontal' | 'vertical'
  style?: CSSProperties
  justify?: 'start' | 'end' | 'center' | 'between'
  align?: 'start' | 'end' | 'center'
  gap?: 'none' | 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'
  padding?: 'none' | 'extra-small' | 'small' | 'medium' | 'large'
  wrap?: boolean
  stackRef?: RefObject<HTMLDivElement>
}
