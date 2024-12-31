import { hexToRgbObj } from './rgb.color.util'

export interface TColorHsl {
  hue: number
  saturation: number
  lightness: number
  alpha: number
}

export const hexToHslObj = (colorHex: string): TColorHsl => {
  const rgb = hexToRgbObj(colorHex)

  let r = rgb.red
  let g = rgb.green
  let b = rgb.blue

  ;(r /= 255), (g /= 255), (b /= 255)
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s,
    l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  s = s * 100
  s = Math.round(s)
  l = l * 100
  l = Math.round(l)
  h = Math.round(360 * h)

  return { hue: h, saturation: s, lightness: l, alpha: rgb.alpha }
}

export const hexToHslStr = (colorHex: string, wrapWithCssFunc?: boolean) => {
  const hsl = hexToHslObj(colorHex)

  if (hsl.alpha !== 1) {
    const alpha = hsl.alpha.toFixed(2)
    if (wrapWithCssFunc) {
      return `hsla(${hsl.hue},${hsl.saturation}%,${hsl.lightness}%,${alpha === '0.00' ? '0' : alpha})`
    }
    return `${hsl.hue},${hsl.saturation},${hsl.lightness},${alpha === '0.00' ? '0' : alpha}`
  }

  if (wrapWithCssFunc) {
    return `hsl(${hsl.hue},${hsl.saturation}%,${hsl.lightness}%)`
  }
  return `${hsl.hue},${hsl.saturation},${hsl.lightness}`
}
