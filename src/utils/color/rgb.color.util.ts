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

export const hexToRgbStr = (colorHex: string, wrapWithCssFunc?: boolean, displayP3?: boolean) => {
  const obj = hexToRgbObj(colorHex)

  const main = `${obj.red},${obj.green},${obj.blue}`

  if (obj.alpha === 1) {
    if (!wrapWithCssFunc) return main

    if (displayP3) {
      const rPercent = Math.round((obj.red / 255) * 100)
      const gPercent = Math.round((obj.green / 255) * 100)
      const bPercent = Math.round((obj.blue / 255) * 100)

      return `color(display-p3 ${rPercent}% ${gPercent}% ${bPercent}%)`
    }

    return `rgb(${main})`
  }

  const alpha = obj.alpha.toFixed(2)

  if (!wrapWithCssFunc) return `${main},${alpha === '0.00' ? '0' : alpha}`

  if (displayP3) {
    const rPercent = Math.round((obj.red / 255) * 100)
    const gPercent = Math.round((obj.green / 255) * 100)
    const bPercent = Math.round((obj.blue / 255) * 100)

    return `color(display-p3 ${rPercent}% ${gPercent}% ${bPercent}% / ${alpha === '0.00' ? '0' : alpha})`
  }

  return `rgba(${main},${alpha === '0.00' ? '0' : alpha})`
}
