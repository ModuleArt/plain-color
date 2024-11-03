import hexRgb from 'hex-rgb'
import rgbHex from 'rgb-hex'

export type TColorRgb =
  | `rgb(${string},${string},${string})`
  | `rgba(${string},${string},${string},${string})`
  | { red: number; green: number; blue: number; alpha?: number }

export const hexToRgbObj = (hex: string) => {
  return hexRgb(hex)
}

export const hexToRgbStr = (hex: string) => {
  const obj = hexToRgbObj(hex)
  return obj.alpha
    ? `rgba(${obj.red},${obj.green},${obj.blue},${obj.alpha})`
    : `rgb(${obj.red},${obj.green},${obj.blue})`
}

export const rgbToHex = (rgb: TColorRgb) => {
  if (typeof rgb === 'string') {
    return rgbHex(rgb)
  }

  const hexa = rgbHex(rgb.red, rgb.green, rgb.blue, rgb.alpha)

  return hexa.length === 8 && hexa.endsWith('ff') ? hexa.slice(0, 6) : hexa
}
