import { ColorCard } from '@/components/ColorCard'
import { Stack } from '@/components/Stack'
import { useColorsStore } from '@/store/colors'
import { FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { ColorPicker } from '@/components/ColorPicker'

export const ColorPage: FC = () => {
  const params = useParams<{ id: string }>()
  const colorsStore = useColorsStore()
  const navigate = useNavigate()

  const [color, setColor] = useState(
    colorsStore.colors.find((color) => color.id === params.id) || {
      id: crypto.randomUUID(),
      label: 'New Color',
      hex: 'ff1500',
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
    <Stack dir="vertical">
      <ColorCard color={color} />
      <ColorPicker hexValue={color.hex} onChange={(hex) => setColor({ ...color, hex })} grow />
      <Stack>
        <Button label="Cancel" onClick={onCancel} grow />
        <Button label={params.id ? 'Save' : 'Add'} onClick={onSave} grow />
      </Stack>
    </Stack>
  )
}
