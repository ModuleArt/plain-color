import { ECopyVariant } from '@/types/settings.types'
import { hexToRgbStr } from './color/rgb.util'
import { hexToCmykStr } from './color/cmyk.util'
import { hexToHslStr } from './color/hsl.util'

export const copyVariants = [
  // hex
  { id: ECopyVariant.HEX_WITH_SHARP, label: '#HEX', supportsAlpha: true },
  { id: ECopyVariant.HEX_WITHOUT_SHARP, label: 'HEX', supportsAlpha: true },
  { id: ECopyVariant.HEX_LOWERCASE_WITH_SHARP, label: '#hex', supportsAlpha: true },
  { id: ECopyVariant.HEX_LOWERCASE_WITHOUT_SHARP, label: 'hex', supportsAlpha: true },
  // rgb
  { id: ECopyVariant.CSS_RGB, label: 'rgb()', supportsAlpha: true },
  { id: ECopyVariant.RGB_COMMA_SEPARATED, label: 'R,G,B', supportsAlpha: true },
  // hsl
  { id: ECopyVariant.CSS_HSL, label: 'hsl()', supportsAlpha: true },
  { id: ECopyVariant.HSL_COMMA_SEPARATED, label: 'H,S,L', supportsAlpha: true },
  // cmyk
  { id: ECopyVariant.CMYK_FUNCTION, label: 'cmyk()', supportsAlpha: false },
  { id: ECopyVariant.CMYK_COMMA_SEPARATED, label: 'C,M,Y,K', supportsAlpha: false },
]

export const formatCopyText = (colorHex: string, copyVariant: ECopyVariant) => {
  switch (copyVariant) {
    case ECopyVariant.HEX_WITH_SHARP: {
      return `#${colorHex.toUpperCase()}`
    }
    case ECopyVariant.HEX_WITHOUT_SHARP: {
      return colorHex.toUpperCase()
    }
    case ECopyVariant.HEX_LOWERCASE_WITH_SHARP: {
      return `#${colorHex.toLowerCase()}`
    }
    case ECopyVariant.HEX_LOWERCASE_WITHOUT_SHARP: {
      return colorHex.toLowerCase()
    }
    case ECopyVariant.CSS_RGB: {
      return hexToRgbStr(colorHex, true)
    }
    case ECopyVariant.RGB_COMMA_SEPARATED: {
      return hexToRgbStr(colorHex)
    }
    case ECopyVariant.CMYK_FUNCTION: {
      return hexToCmykStr(colorHex, true)
    }
    case ECopyVariant.CMYK_COMMA_SEPARATED: {
      return hexToCmykStr(colorHex)
    }
    case ECopyVariant.CSS_HSL: {
      return hexToHslStr(colorHex, true)
    }
    case ECopyVariant.HSL_COMMA_SEPARATED: {
      return hexToHslStr(colorHex)
    }
  }
}
