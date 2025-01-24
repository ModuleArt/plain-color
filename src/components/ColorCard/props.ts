import { IPlainlibComponentProps, TPlainlibRef } from '@/lib/types'
import { IColor } from '@/types/color.types'

export interface IColorCardProps extends IPlainlibComponentProps {
  color: IColor
  onDelete?: (event: MouseEvent) => void
  onEdit?: (event: MouseEvent) => void
  onDuplicate?: (event: MouseEvent) => void
  onColorChange?: (color: IColor) => void
  variant?: 'list' | 'grid'
  colorCardRef?: TPlainlibRef<HTMLDivElement>
  showQuickCopyVariants?: boolean
  showHex?: boolean
}
