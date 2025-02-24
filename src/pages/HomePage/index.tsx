import { FC } from 'react'
import { ColorCard } from '@/components/ColorCard'
import { Stack } from '@/components/Stack'
import { Button } from '@/components/Button'
import { Eyedropper, Plus, Trash, Gear, Palette } from '@phosphor-icons/react'
import { useColorsStore } from '@/store/colors.store'
import { useNavigate } from 'react-router-dom'
import { usePickerStore } from '@/store/picker.store'
import { IColor } from '@/types/color.types'
import { Header } from '@/components/Header'
import { preparePickerForOpen } from '@/utils/picker.util'
import { VirtualScroller } from '@/components/VirtualScroller'

export const HomePage: FC = () => {
  const navigate = useNavigate()
  const colorsStore = useColorsStore()
  const pickerStore = usePickerStore()

  const goToSettings = () => {
    navigate('/settings')
  }

  const goToPalettes = () => {
    navigate('/palettes')
  }

  const clearAllColors = () => {
    colorsStore.clearAllColors()
  }

  const pickColor = async () => {
    preparePickerForOpen(() => pickerStore.openPicker({ target: 'HOME' }))
  }

  const addColor = () => {
    navigate('/color')
  }

  const onColorChange = (color: IColor) => {
    colorsStore.updateColor(color.id, color)
  }

  return (
    <Stack dir="vertical" gap="none" grow>
      <Header>
        <Stack grow>
          <Button iconPre={Eyedropper} onClick={pickColor} grow nativeTooltip="Pick color from screen" />
          <Button iconPre={Plus} onClick={addColor} grow nativeTooltip="Add color manually" />
          <Button iconPre={Palette} onClick={goToPalettes} grow nativeTooltip="Palettes" />
          <Button iconPre={Trash} onClick={clearAllColors} grow nativeTooltip="Clear all colors" />
          <Button iconPre={Gear} onClick={goToSettings} grow nativeTooltip="Settings" />
        </Stack>
      </Header>
      <VirtualScroller
        grow
        items={colorsStore.colors}
        itemSize={72}
        renderItem={(color) => (
          <ColorCard
            key={color.id}
            color={color}
            onDelete={() => colorsStore.removeColor(color.id)}
            onEdit={() => navigate(`/color/${color.id}`)}
            onDuplicate={() => colorsStore.duplicateColor(color.id)}
            onColorChange={onColorChange}
          />
        )}
      />
    </Stack>
  )
}
