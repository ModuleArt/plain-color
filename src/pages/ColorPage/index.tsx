import { ColorCard } from '@/components/ColorCard'
import { Stack } from '@/components/Stack'
import { useColorsStore } from '@/store/colors.store'
import { FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { ColorPicker } from '@/components/ColorPicker'
import { generateRandomUuid } from '@/utils/uuid.util'

export const ColorPage: FC = () => {
  const params = useParams<{ id: string }>()
  const colorsStore = useColorsStore()
  const navigate = useNavigate()

  const [color, setColor] = useState(
    colorsStore.colors.find((color) => color.id === params.id) || {
      id: generateRandomUuid(),
      label: 'New Color',
      hex: '851723',
    }
  )

  const onCancel = () => {
    navigate(-1)
  }

  const onSave = () => {
    if (params.id) {
      colorsStore.updateColor(color.id, color)
    } else {
      colorsStore.addColor(color)
    }
    navigate(-1)
  }

  return (
    <Stack dir="vertical" gap="medium" grow padding="medium">
      <ColorCard color={color} onColorChange={setColor} />
      <ColorPicker hexValue={color.hex} onChange={(hex) => setColor({ ...color, hex })} grow />
      <Stack>
        <Button label="Cancel" onClick={onCancel} grow />
        <Button label={params.id ? 'Save' : 'Add'} onClick={onSave} grow />
      </Stack>
    </Stack>
  )
}
