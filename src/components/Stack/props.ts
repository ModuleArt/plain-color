import { CSSProperties } from 'react'

export interface IStackProps {
  dir?: 'horizontal' | 'vertical'
  itemsGrow?: boolean
  className?: string
  style?: CSSProperties
  justify?: 'start' | 'end' | 'center'
  align?: 'start' | 'end' | 'center'
  grow?: boolean
}
