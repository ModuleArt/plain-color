import { ColorCard } from '@/components/ColorCard'
import { Stack } from '@/components/Stack'
import { useColorsStore } from '@/store/colors.store'
import { FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { ColorPicker } from '@/components/ColorPicker'
import { generateRandomUuid } from '@/utils/uuid.util'
import { defaultColor } from '@/utils/color'
import { usePalettesStore } from '@/store/palettes.store'
import { IColor } from '@/types/color.types'

export const ColorPage: FC = () => {
  const params = useParams<{ paletteId?: string; colorId?: string }>()
  const colorsStore = useColorsStore()
  const palettesStore = usePalettesStore()
  const navigate = useNavigate()

  const [color, setColor] = useState<IColor>(
    (params.paletteId
      ? palettesStore.palettes.find((palette) => palette.id === params.paletteId)?.colors || []
      : colorsStore.colors
    ).find((color) => color.id === params.colorId) || {
      id: generateRandomUuid(),
      label: 'New Color',
      hex: defaultColor,
    }
  )

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

  return (
    <Stack dir="vertical" gap="medium" grow padding="medium">
      <ColorCard color={color} onColorChange={setColor} />
      <ColorPicker hexValue={color.hex} onChange={(hex) => setColor({ ...color, hex })} grow />
      <Stack>
        <Button label="Cancel" onClick={onCancel} grow />
        <Button label={params.colorId ? 'Save' : 'Add'} onClick={onSave} grow />
      </Stack>
    </Stack>
  )
}
