import { FC } from 'react'
import { ColorCard } from '@/components/ColorCard'
import { Stack } from '@/components/Stack'
import { Button } from '@/components/Button'
import {
  Eyedropper,
  Plus,
  Trash,
  // Palette
} from '@phosphor-icons/react'
import { useColorsStore } from '@/store/colors'
import { useNavigate } from 'react-router-dom'
import { usePickerStore } from '@/store/picker'
import { IColor } from '@/types/color'

export const HomePage: FC = () => {
  const colorsStore = useColorsStore()
  const pickerStore = usePickerStore()
  const navigate = useNavigate()

  // const goToPalettes = () => {
  //   navigate('/palettes')
  // }

  const clearAllColors = () => {
    colorsStore.clearAllColors()
  }

  const pickColor = () => {
    pickerStore.openPicker('HOME')
  }

  const addColor = () => {
    navigate('/color')
  }

  const onColorChange = (color: IColor) => {
    colorsStore.updateColor(color.id, color)
  }

  return (
    <Stack dir="vertical" gap="medium" grow>
      <Stack>
        <Button icon={Eyedropper} onClick={pickColor} grow />
        <Button icon={Plus} onClick={addColor} grow />
        <Button icon={Trash} onClick={clearAllColors} grow />
        {/* <Button icon={Palette} onClick={goToPalettes} grow /> */}
      </Stack>
      <Stack dir="vertical" gap="medium">
        {colorsStore.colors.map((color) => (
          <ColorCard
            key={color.id}
            color={color}
            onDelete={() => colorsStore.removeColor(color.id)}
            onEdit={() => navigate(`/color/${color.id}`)}
            onColorChange={onColorChange}
          />
        ))}
      </Stack>
    </Stack>
  )
}
