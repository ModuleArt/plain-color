export const sanitizeLabel = (label: string) => {
  return label.trim().replace(/\s\s+/g, ' ')
}

export const sanitizeHexInputValue = (text: string) => {
  let sanitized = text.replace(/[^0-9a-fA-F]/g, '').slice(0, 8)

  return sanitized.toUpperCase()
}

export const sanitizeHexInputBlur = (text: string) => {
  let sanitized = sanitizeHexInputValue(text)

  if (sanitized === '') {
    return '000000'
  }

  if (sanitized.length === 7) {
    sanitized = sanitized.slice(0, 6)
  }

  // If the input length is less than 6, repeat it to fill 6 characters
  if (sanitized.length < 6) {
    sanitized = sanitized.repeat(6).slice(0, 6)
  }

  return sanitized
}

export const sanitizeRgbInputValue = (text: string, maxValue = 255) => {
  // Remove non-numeric characters
  let sanitized = text.replace(/[^0-9]/g, '')

  // Remove leading zeros unless the input is exactly "0"
  sanitized = sanitized.replace(/^0+(?!$)/, '')

  // Limit the input to a maximum of 3 digits
  sanitized = sanitized.slice(0, 3)

  // Ensure the value does not exceed 255
  if (sanitized !== '' && parseInt(sanitized, 10) > maxValue) {
    return maxValue.toString()
  }

  return sanitized
}

export const sanitizeRgbInputBlur = (text: string) => {
  if (text === '') return '0'

  return text
}
