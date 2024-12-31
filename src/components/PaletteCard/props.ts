import { IPlainlibComponentProps } from '@/lib/types'
import { IPalette } from '@/types/palette.types'

export interface IPaletteCardProps extends IPlainlibComponentProps {
  palette: IPalette
  onDelete: () => void
  onDuplicate: () => void
  onPaletteChange?: (color: IPalette) => void
}
