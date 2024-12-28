import { ECopyVariant } from '@/types/settings.types'
import { hexToRgbStr } from './color.util'

export const copyVariants = [
  { id: ECopyVariant.HEX_WITH_SHARP, label: 'HEX/HEXA with hash', shortLabel: 'HEX' },
  { id: ECopyVariant.HEX_WITHOUT_SHARP, label: 'HEX/HEXA', shortLabel: 'HEX' },
  { id: ECopyVariant.RGB_COMMA_SEPARATED, label: 'RGB/RGBA comma separated', shortLabel: 'RGB' },
  { id: ECopyVariant.CSS_RGB, label: 'CSS RGB/RGBA', shortLabel: 'RGB' },
]

export const formatCopyText = (colorHex: string, copyVariant: ECopyVariant) => {
  switch (copyVariant) {
    case ECopyVariant.HEX_WITH_SHARP:
      return `#${colorHex.toUpperCase()}`
    case ECopyVariant.HEX_WITHOUT_SHARP:
      return colorHex.toUpperCase()
    case ECopyVariant.RGB_COMMA_SEPARATED:
      return hexToRgbStr(colorHex)
    case ECopyVariant.CSS_RGB:
      return hexToRgbStr(colorHex, true)
  }

  return ''
}
