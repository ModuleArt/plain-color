import { FC } from 'react'
import { ColorCard } from '@/components/ColorCard'
import { Stack } from '@/components/Stack'
import { Button } from '@/components/Button'
import { Eyedropper, Plus, Trash, Gear, Palette } from '@phosphor-icons/react'
import { useColorsStore } from '@/store/colors.store'
import { useNavigate } from 'react-router-dom'
import { usePickerStore } from '@/store/picker.store'
import { IColor } from '@/types/color.types'
import {
  invokeCheckMacosScreenRecordingPermission,
  invokeRequestMacosScreenRecordingPermission,
} from '@/utils/cmd/macosPermissions.cmd.util'
import { IS_DEBUG } from '@/config'
import { Scroller } from '@/components/Scroller'
import { Header } from '@/components/Header'

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
    const authorized = await invokeCheckMacosScreenRecordingPermission()
    if (authorized || IS_DEBUG) {
      pickerStore.openPicker({ target: 'HOME' })
    } else {
      invokeRequestMacosScreenRecordingPermission()
    }
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
      <Scroller>
        <Stack dir="vertical" gap="medium" padding="medium">
          {colorsStore.colors.map((color) => (
            <ColorCard
              key={color.id}
              color={color}
              onDelete={() => colorsStore.removeColor(color.id)}
              onEdit={() => navigate(`/color/${color.id}`)}
              onDuplicate={() => colorsStore.duplicateColor(color.id)}
              onColorChange={onColorChange}
            />
          ))}
        </Stack>
      </Scroller>
    </Stack>
  )
}
