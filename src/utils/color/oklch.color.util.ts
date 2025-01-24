import { hexToRgbObj } from './rgb.color.util'

export interface TColorOklch {
  lightness: number // 0–1
  chroma: number
  hue: number // in degrees, 0–360
  alpha: number // 0–1
}

const multiplyMatrices = (A: number[], B: number[]) => {
  return [
    A[0] * B[0] + A[1] * B[1] + A[2] * B[2],
    A[3] * B[0] + A[4] * B[1] + A[5] * B[2],
    A[6] * B[0] + A[7] * B[1] + A[8] * B[2],
  ]
}

const oklab2oklch = ([l, a, b]: number[]) => [
  l,
  Math.sqrt(a ** 2 + b ** 2),
  Math.abs(a) < 0.0002 && Math.abs(b) < 0.0002 ? NaN : ((((Math.atan2(b, a) * 180) / Math.PI) % 360) + 360) % 360,
]

const rgb2srgbLinear = (rgb: number[]) =>
  rgb.map((c) => (Math.abs(c) <= 0.04045 ? c / 12.92 : (c < 0 ? -1 : 1) * ((Math.abs(c) + 0.055) / 1.055) ** 2.4))

const xyz2oklab = (xyz: number[]) => {
  const LMS = multiplyMatrices(
    [
      0.819022437996703, 0.3619062600528904, -0.1288737815209879, 0.0329836539323885, 0.9292868615863434,
      0.0361446663506424, 0.0481771893596242, 0.2642395317527308, 0.6335478284694309,
    ],
    xyz
  )
  const LMSg = LMS.map((val) => Math.cbrt(val))
  return multiplyMatrices(
    [
      0.210454268309314, 0.7936177747023054, -0.0040720430116193, 1.9779985324311684, -2.4285922420485799,
      0.450593709617411, 0.0259040424655478, 0.7827717124575296, -0.8086757549230774,
    ],
    LMSg
  )
}

const rgbLinear2xyz = (rgb: number[]) => {
  return multiplyMatrices(
    [
      0.41239079926595934, 0.357584339383878, 0.1804807884018343, 0.21263900587151027, 0.715168678767756,
      0.07219231536073371, 0.01933081871559182, 0.11919477979462598, 0.9505321522496607,
    ],
    rgb
  )
}

export const hexToOklchObj = (hexColor: string): TColorOklch => {
  const rgb = hexToRgbObj(hexColor)

  const r = rgb.red / 255
  const g = rgb.green / 255
  const b = rgb.blue / 255

  const rgbArr = [r, g, b]

  const oklch = oklab2oklch(xyz2oklab(rgbLinear2xyz(rgb2srgbLinear(rgbArr))))

  return { lightness: oklch[0], chroma: oklch[1], hue: oklch[2], alpha: rgb.alpha }
}

export const hexToOklchStr = (hexColor: string): string => {
  const oklch = hexToOklchObj(hexColor)

  const lightness = (oklch.lightness * 100).toFixed(2) // Convert to percentage
  const chroma = oklch.chroma.toFixed(4)
  const hue = oklch.hue.toFixed(2)
  const alpha = oklch.alpha === 1 ? '' : ` / ${(oklch.alpha * 100).toFixed(2)}%`

  return `oklch(${lightness}% ${chroma} ${hue}${alpha})`
}
