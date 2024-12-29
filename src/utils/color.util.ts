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

export const hexToCmykStr = (hex: string, wrapWithCssFunc?: boolean) => {
  let C = 0,
    M = 0,
    Y = 0,
    K = 0

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  if (r === 0 && g === 0 && b === 0) {
    K = 1
  } else {
    C = 1 - r / 255
    M = 1 - g / 255
    Y = 1 - b / 255

    const minCMY = Math.min(C, M, Y)
    C = (C - minCMY) / (1 - minCMY)
    M = (M - minCMY) / (1 - minCMY)
    Y = (Y - minCMY) / (1 - minCMY)
    K = minCMY
  }
  C = C * 100
  M = M * 100
  Y = Y * 100
  K = K * 100

  const resC = C === 0 ? '0' : Math.round(C)
  const resM = M === 0 ? '0' : Math.round(M)
  const resY = Y === 0 ? '0' : Math.round(Y)
  const resK = K === 0 ? 0 : Math.round(K)

  if (wrapWithCssFunc) {
    return `cmyk(${resC}%,${resM}%,${resY}%,${resK}%)`
  }

  return `${resC},${resM},${resY},${resK}`
}

export const rgbToHslStr = (r: number, g: number, b: number, a: number, wrapWithCssFunc?: boolean) => {
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

  if (a !== 1) {
    const alpha = a.toFixed(2)
    if (wrapWithCssFunc) {
      return `hsla(${h},${s}%,${l}%,${alpha === '0.00' ? '0' : alpha})`
    }
    return `${h},${s},${l},${alpha === '0.00' ? '0' : alpha}`
  }

  if (wrapWithCssFunc) {
    return `hsl(${h},${s}%,${l}%)`
  }
  return `${h},${s},${l}`
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
