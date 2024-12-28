import { IPlainlibComponentProps } from '@/lib/types'
import { IColor } from '@/types/color.types'

export interface IColorCardProps extends IPlainlibComponentProps<HTMLDivElement> {
  color: IColor
  onSave?: () => void
  onDelete?: () => void
  onEdit?: () => void
  onDuplicate?: () => void
  onColorChange?: (color: IColor) => void
}
