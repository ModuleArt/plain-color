import { FC, useEffect, useState } from 'react'
import { Stack } from '@/components/Stack'
import { Text } from '@/components/Text'
import { hexToRgbObj } from '@/utils/color/rgb.color.util'
import { IColorInputProps } from './props'
import './index.scss'

export const ColorInput: FC<IColorInputProps> = ({ colorHex }) => {
  const [innerHex, setInnerHex] = useState('000000')
  const [innerR, setInnerR] = useState('0')
  const [innerG, setInnerG] = useState('0')
  const [innerB, setInnerB] = useState('0')
  const [innerA, setInnerA] = useState('0')

  useEffect(() => {
    setInnerHex(colorHex)

    const rgb = hexToRgbObj(colorHex)
    setInnerR(rgb.red.toString())
    setInnerG(rgb.green.toString())
    setInnerB(rgb.blue.toString())
    setInnerA(Math.trunc(rgb.alpha * 100).toString())
  }, [colorHex])

  const sanitizeHexInputChange = (text: string, maxLength: 6 | 8 = 6) => {
    // Remove invalid characters
    const sanitized = text.replace(/[^0-9a-fA-F]/g, '').slice(0, maxLength)

    // Check if the sanitized value is a valid hex color
    const regex = maxLength === 6 ? /^[0-9a-fA-F]{1,6}$/ : /^[0-9a-fA-F]{1,8}$/

    return regex.test(sanitized) ? sanitized : ''
  }

  const sanitizeHexInputBlur = (value: string) => {
    // Sanitize the input: Remove invalid characters and convert to lowercase
    let sanitized = value.replace(/[^0-9a-f]/g, '').toLowerCase()

    // If the input is empty, return "000000"
    if (sanitized === '') {
      return '000000'
    }

    // If the input length is less than 6, repeat it to fill 6 characters
    if (sanitized.length < 6) {
      // Repeat the input enough times to get at least 6 characters
      return sanitized.repeat(6).slice(0, 6)
    }

    // If the input length is greater than 6, truncate it to 6 characters
    if (sanitized.length > 6) {
      return sanitized.slice(0, 6)
    }

    // If it's exactly 6 characters, return as-is
    return sanitized
  }

  const sanitizeRgbInputChange = (text: string) => {
    // Remove non-numeric characters
    let sanitized = text.replace(/[^0-9]/g, '')

    // Remove leading zeros unless the input is exactly "0"
    sanitized = sanitized.replace(/^0+(?!$)/, '')

    // Limit the input to a maximum of 3 digits
    sanitized = sanitized.slice(0, 3)

    // Ensure the value does not exceed 255
    if (sanitized !== '' && parseInt(sanitized, 10) > 255) {
      return '255'
    }

    return sanitized
  }

  return (
    <Stack justify="between" className="color-input">
      <Stack dir="vertical" align="center" className="color-input__hex-input">
        <Text text="HEX" size="small" tinted />
        <input
          value={innerHex}
          onChange={(e) => setInnerHex(sanitizeHexInputChange(e.target.value))}
          onBlur={(e) => setInnerHex(sanitizeHexInputBlur(e.target.value))}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </Stack>
      <Stack className="color-input__rgb-inputs" grow>
        <Stack dir="vertical" align="center" grow>
          <Text text="R" size="small" tinted />
          <input
            value={innerR}
            onChange={(e) => setInnerR(sanitizeRgbInputChange(e.target.value))}
            onBlur={() => innerR === '' && setInnerR('0')}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </Stack>
        <Stack dir="vertical" align="center" grow>
          <Text text="G" size="small" tinted />
          <input
            value={innerG}
            onChange={(e) => setInnerG(sanitizeRgbInputChange(e.target.value))}
            onBlur={() => innerG === '' && setInnerG('0')}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </Stack>
        <Stack dir="vertical" align="center" grow>
          <Text text="B" size="small" tinted />
          <input
            value={innerB}
            onChange={(e) => setInnerB(sanitizeRgbInputChange(e.target.value))}
            onBlur={() => innerB === '' && setInnerB('0')}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </Stack>
        <Stack dir="vertical" align="center" grow>
          <Text text="Alpha" size="small" tinted />
          <input
            value={innerA}
            onChange={(e) => setInnerA(sanitizeRgbInputChange(e.target.value))}
            onBlur={() => innerA === '' && setInnerA('0')}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </Stack>
      </Stack>
    </Stack>
  )
}
