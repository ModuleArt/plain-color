import { ColorCard } from '@/components/ColorCard'
import { Stack } from '@/components/Stack'
import { useColorsStore } from '@/store/colors.store'
import { FC, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { ColorPicker } from '@/components/ColorPicker'
import { generateRandomUuid } from '@/utils/uuid.util'
import { defaultColor, generateColorLabel } from '@/utils/color'
import { usePalettesStore } from '@/store/palettes.store'
import { IColor } from '@/types/color.types'
import { ColorInput } from '@/components/ColorInput'
import { Scroller } from '@/components/Scroller'

export const ColorPage: FC = () => {
  const params = useParams<{ paletteId?: string; colorId?: string }>()
  const colorsStore = useColorsStore()
  const palettesStore = usePalettesStore()
  const navigate = useNavigate()

  const emptyColor = useMemo(
    () => ({
      id: generateRandomUuid(),
      label: '',
      hex: defaultColor,
    }),
    []
  )

  const initialColor = useMemo(
    () =>
      params.colorId
        ? (params.paletteId
            ? palettesStore.palettes.find((palette) => palette.id === params.paletteId)?.colors || []
            : colorsStore.colors
          ).find((color) => color.id === params.colorId) || emptyColor
        : emptyColor,
    [params.colorId, params.paletteId, palettesStore.palettes, colorsStore.colors]
  )

  const [color, setColor] = useState<IColor>(initialColor)
  const [isCustomNameSet, setIsCustomNameSet] = useState(!!initialColor.label)

  useEffect(() => {
    if (!isCustomNameSet) {
      const label = generateColorLabel(color.hex)
      setColor({ ...color, label })
    }
  }, [isCustomNameSet, color.hex])

  const onCancel = () => {
    navigate(-1)
  }

  const onSave = () => {
    if (params.paletteId) {
      if (params.colorId) {
        palettesStore.updateColorInPalette(params.paletteId, color.id, color)
      } else {
        palettesStore.addColorToPalette(params.paletteId, color)
      }
    } else {
      if (params.colorId) {
        colorsStore.updateColor(color.id, color)
      } else {
        colorsStore.addColor(color)
      }
    }
    navigate(-1)
  }

  const onColorChange = (c: IColor) => {
    if (!isCustomNameSet && c.label !== color.label) {
      setIsCustomNameSet(true)
    }

    setColor(c)
  }

  return (
    <Stack dir="vertical" gap="none" grow>
      <Scroller grow>
        <Stack dir="vertical" gap="medium" grow padding="medium">
          <ColorCard color={color} onColorChange={onColorChange} showQuickCopyVariants={false} showHex={false} />
          <ColorPicker hexValue={color.hex} onChange={(hex) => setColor({ ...color, hex })} grow />
          <ColorInput colorHex={color.hex} onChange={(hex) => setColor({ ...color, hex })} />
          <Stack>
            <Button label="Cancel" onClick={onCancel} grow />
            <Button label={params.colorId ? 'Save' : 'Add'} onClick={onSave} grow />
          </Stack>
        </Stack>
      </Scroller>
    </Stack>
  )
}
