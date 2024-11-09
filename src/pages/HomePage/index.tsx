import { FC } from 'react'
import { ColorCard } from '@/components/ColorCard'
import { Stack } from '@/components/Stack'
import { Button } from '@/components/Button'
import { Eyedropper, Plus, Trash } from '@phosphor-icons/react'
import { useColorsStore } from '@/store/colors'
import { useNavigate } from 'react-router-dom'
import { usePickerStore } from '@/store/picker'

export const HomePage: FC = () => {
  const colorsStore = useColorsStore()
  const pickerStore = usePickerStore()
  const navigate = useNavigate()

  const clearAllColors = () => {
    colorsStore.clearAllColors()
  }

  const pickColor = () => {
    pickerStore.openPicker('HOME')
  }

  const addColor = () => {
    navigate('/color')
  }

  return (
    <Stack dir="vertical" gap="medium">
      <Stack>
        <Button icon={Eyedropper} onClick={pickColor} grow />
        <Button icon={Plus} onClick={addColor} grow />
        <Button icon={Trash} onClick={clearAllColors} grow />
      </Stack>
      {colorsStore.colors.map((color) => (
        <ColorCard
          key={color.id}
          color={color}
          onDelete={() => colorsStore.removeColor(color.id)}
          onEdit={() => navigate(`/color/${color.id}`)}
        />
      ))}
    </Stack>
  )
}
