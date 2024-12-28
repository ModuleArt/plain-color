import { IPlainlibComponentProps } from '@/lib/types'

export interface ISelectOption<T> {
  id: T
  label: string
  description?: string
}

export interface ISelectProps<T> extends IPlainlibComponentProps<HTMLDivElement> {
  options?: ISelectOption<T>[]
  value?: T[]
  onChange?: (optionIds: T[]) => void
  maxWidth?: number
  multiple?: boolean
}
