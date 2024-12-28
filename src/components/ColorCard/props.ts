import { IColor } from '@/types/color'

export interface IColorCardProps {
  color: IColor
  onSave?: () => void
  onDelete?: () => void
  onEdit?: () => void
  onDuplicate?: () => void
  onColorChange?: (color: IColor) => void
}
