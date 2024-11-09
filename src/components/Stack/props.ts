import { CSSProperties } from 'react'

export interface IStackProps {
  dir?: 'horizontal' | 'vertical'
  className?: string
  style?: CSSProperties
  justify?: 'start' | 'end' | 'center'
  align?: 'start' | 'end' | 'center'
  grow?: boolean
  gap?: 'none' | 'small' | 'medium' | 'large'
}
