import { IPlainlibComponentProps } from '@/lib/types'
import { IColor } from '@/types/color.types'
import { MouseEvent } from 'react'

export interface IColorCardProps extends IPlainlibComponentProps<HTMLDivElement> {
  color: IColor
  onDelete?: (event: MouseEvent<HTMLButtonElement>) => void
  onEdit?: (event: MouseEvent<HTMLButtonElement>) => void
  onDuplicate?: (event: MouseEvent<HTMLButtonElement>) => void
  onColorChange?: (color: IColor) => void
}
