import hexRgb from 'hex-rgb'
import rgbHex from 'rgb-hex'
import { colorIsDark } from 'color-is-dark'

export type TColorRgb =
  | `rgb(${string},${string},${string})`
  | `rgba(${string},${string},${string},${string})`
  | { red: number; green: number; blue: number; alpha?: number }
  | [number, number, number, number?]

export const hexToRgbObj = (hex: string) => {
  return hexRgb(hex)
}

export const hexToRgbStr = (hex: string, wrapWithCssFunc?: boolean) => {
  const obj = hexToRgbObj(hex)

  const main = `${obj.red},${obj.green},${obj.blue}`

  if (obj.alpha === 1) {
    return wrapWithCssFunc ? `rgb(${main})` : main
  }

  const alpha = obj.alpha.toFixed(2)
  return wrapWithCssFunc
    ? `rgba(${main},${alpha === '0.00' ? '0' : alpha})`
    : `${main},${alpha === '0.00' ? '0' : alpha}`
}

export const rgbToHex = (rgb: TColorRgb) => {
  let hexa = ''
  if (typeof rgb === 'string') {
    hexa = rgbHex(rgb)
  } else if (Array.isArray(rgb)) {
    hexa = rgbHex(rgb[0], rgb[1], rgb[2], rgb[3])
  } else {
    hexa = rgbHex(rgb.red, rgb.green, rgb.blue, rgb.alpha)
  }

  return hexa.length === 8 && hexa.endsWith('ff') ? hexa.slice(0, 6) : hexa
}

export const isDark = (hex: string) => {
  const obj = hexToRgbObj(hex)
  return colorIsDark([obj.red, obj.green, obj.blue])
}
