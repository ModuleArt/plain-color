import rgbHex from 'rgb-hex'
import namer from 'color-namer'
import { colorIsDark } from 'color-is-dark'
import { hexToRgbObj } from './rgb.color.util'
import { IColor } from '@/types/color.types'
import { generateRandomUuid } from '@/utils/uuid.util'

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

export const hexWithoutAlpha = (colorHex: string) => {
  return colorHex.slice(0, 6)
}

export const isDark = (colorHex: string) => {
  const obj = hexToRgbObj(colorHex)

  return colorIsDark([obj.red, obj.green, obj.blue])
}

export const generateColorLabel = (colorHex: string) => {
  return namer(colorHex).ntc[0].name
}

const predefinedColors1 = ['9b5de5', 'f15bb5', 'fee440']
export const predefinedColors: IColor[] = predefinedColors1.map((hex) => ({
  id: generateRandomUuid(),
  hex,
  label: generateColorLabel(hex),
}))
