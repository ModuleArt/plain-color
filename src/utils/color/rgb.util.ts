import hexRgb from 'hex-rgb'

export interface TColorRgb {
  red: number
  green: number
  blue: number
  alpha: number
}

export const hexToRgbObj = (colorHex: string): TColorRgb => {
  return hexRgb(colorHex)
}

export const hexToRgbStr = (colorHex: string, wrapWithCssFunc?: boolean) => {
  const obj = hexToRgbObj(colorHex)

  const main = `${obj.red},${obj.green},${obj.blue}`

  if (obj.alpha === 1) {
    return wrapWithCssFunc ? `rgb(${main})` : main
  }

  const alpha = obj.alpha.toFixed(2)
  return wrapWithCssFunc
    ? `rgba(${main},${alpha === '0.00' ? '0' : alpha})`
    : `${main},${alpha === '0.00' ? '0' : alpha}`
}
