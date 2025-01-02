import rgbHex from 'rgb-hex'
import namer from 'color-namer'
import { colorIsDark } from 'color-is-dark'
import { hexToRgbObj } from './rgb.color.util'

export const defaultColor = '2c2c2c'

export type TColorRgb =
  | `rgb(${string},${string},${string})`
  | `rgba(${string},${string},${string},${string})`
  | { red: number; green: number; blue: number; alpha?: number }
  | [number, number, number, number?]

export const rgbToHex = (rgb: TColorRgb) => {
  let hexa = ''
  if (typeof rgb === 'string') {
    hexa = rgbHex(rgb)
  } else if (Array.isArray(rgb)) {
    hexa = rgbHex(rgb[0], rgb[1], rgb[2], rgb[3])
  } else {
    hexa = rgbHex(rgb.red, rgb.green, rgb.blue, rgb.alpha)
  }

  return hexa.length === 8 && hexa.endsWith('ff') ? hexWithoutAlpha(hexa) : hexa
}

export const hexWithoutAlpha = (hex: string) => {
  return hex.slice(0, 6)
}

export const isDark = (hex: string) => {
  const obj = hexToRgbObj(hex)

  return colorIsDark([obj.red, obj.green, obj.blue])
}

export const generateColorLabel = (hex: string) => {
  return namer(hex).ntc[0].name
}
