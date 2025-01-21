import { FC, KeyboardEvent, useEffect, useState } from 'react'
import { Stack } from '@/components/Stack'
import { Text } from '@/components/Text'
import { hexToRgbObj } from '@/utils/color/rgb.color.util'
import { IColorInputProps } from './props'
import './index.scss'
import {
  sanitizeHexInputValue,
  sanitizeHexInputBlur,
  sanitizeRgbInputValue,
  sanitizeRgbInputBlur,
} from '@/utils/sanitize.util'
import { rgbToHex } from '@/utils/color'
import { Input } from '@/components/Input'

export const ColorInput: FC<IColorInputProps> = ({ colorHex, onChange }) => {
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

  const prepareNewValue = () => {
    return rgbToHex({
      red: Number(innerR) || 0,
      green: Number(innerG) || 0,
      blue: Number(innerB) || 0,
      alpha: (Number(innerA) || 0) / 100,
    })
  }

  const handleInnerHexBlur = () => {
    const newValue = sanitizeHexInputBlur(innerHex)
    setInnerHex(newValue)
    onChange(newValue)
  }

  const handleInnerRBlur = () => {
    const newValue = sanitizeRgbInputBlur(innerR)
    setInnerR(newValue)

    const hex = prepareNewValue()
    onChange(hex)
  }

  const handleInnerGBlur = () => {
    const newValue = sanitizeRgbInputBlur(innerG)
    setInnerG(newValue)

    const hex = prepareNewValue()
    onChange(hex)
  }

  const handleInnerBBlur = () => {
    const newValue = sanitizeRgbInputBlur(innerB)
    setInnerB(newValue)

    const hex = prepareNewValue()
    onChange(hex)
  }

  const handleInnerABlur = () => {
    const newValue = sanitizeRgbInputBlur(innerA)
    setInnerA(newValue)

    const hex = prepareNewValue()
    onChange(hex)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>, onBlur: () => void) => {
    if (e.key === 'Enter') {
      onBlur()
    } else if (e.key === 'Escape') {
      const input = e.target as HTMLInputElement
      input.blur()
    }
  }

  return (
    <Stack justify="between" className="color-input">
      <Stack dir="vertical" align="center" className="color-input__hex-input">
        <Text text="HEX" size="small" tinted />
        <Input
          value={innerHex}
          onChange={(value) => setInnerHex(sanitizeHexInputValue(value))}
          onBlur={handleInnerHexBlur}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          onKeyDown={(e) => onKeyDown(e, handleInnerHexBlur)}
        />
      </Stack>
      <Stack className="color-input__rgb-inputs" grow>
        <Stack dir="vertical" align="center" grow>
          <Text text="R" size="small" tinted />
          <Input
            value={innerR}
            onChange={(value) => setInnerR(sanitizeRgbInputValue(value))}
            onBlur={handleInnerRBlur}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            onKeyDown={(e) => onKeyDown(e, handleInnerRBlur)}
          />
        </Stack>
        <Stack dir="vertical" align="center" grow>
          <Text text="G" size="small" tinted />
          <Input
            value={innerG}
            onChange={(value) => setInnerG(sanitizeRgbInputValue(value))}
            onBlur={handleInnerGBlur}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            onKeyDown={(e) => onKeyDown(e, handleInnerGBlur)}
          />
        </Stack>
        <Stack dir="vertical" align="center" grow>
          <Text text="B" size="small" tinted />
          <Input
            value={innerB}
            onChange={(value) => setInnerB(sanitizeRgbInputValue(value))}
            onBlur={handleInnerBBlur}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            onKeyDown={(e) => onKeyDown(e, handleInnerBBlur)}
          />
        </Stack>
        <Stack dir="vertical" align="center" grow>
          <Text text="Alpha" size="small" tinted />
          <Input
            value={innerA}
            onChange={(value) => setInnerA(sanitizeRgbInputValue(value, 100))}
            onBlur={handleInnerABlur}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            onKeyDown={(e) => onKeyDown(e, handleInnerABlur)}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}
