export interface TColorCmyk {
  cyan: number
  magenta: number
  yellow: number
  key: number
}

export const hexToCmykObj = (hexColor: string) => {
  let C = 0,
    M = 0,
    Y = 0,
    K = 0

  const r = parseInt(hexColor.substring(0, 2), 16)
  const g = parseInt(hexColor.substring(2, 4), 16)
  const b = parseInt(hexColor.substring(4, 6), 16)

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

  const cyan = C === 0 ? 0 : Math.round(C)
  const magenta = M === 0 ? 0 : Math.round(M)
  const yellow = Y === 0 ? 0 : Math.round(Y)
  const key = K === 0 ? 0 : Math.round(K)

  return { cyan, magenta, yellow, key }
}

export const hexToCmykStr = (hexColor: string, wrapWithCssFunc?: boolean) => {
  const cmyk = hexToCmykObj(hexColor)

  if (wrapWithCssFunc) {
    return `cmyk(${cmyk.cyan}%,${cmyk.magenta}%,${cmyk.yellow}%,${cmyk.key}%)`
  }

  return `${cmyk.cyan},${cmyk.magenta},${cmyk.yellow},${cmyk.key}`
}
