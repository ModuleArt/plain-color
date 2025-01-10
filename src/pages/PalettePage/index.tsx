import { Stack } from '@/components/Stack'
import { FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import { Text } from '@/components/Text'
import { CaretLeft, Eyedropper, Plus, Export } from '@phosphor-icons/react'
import { usePalettesStore } from '@/store/palettes.store'
import { IPalette } from '@/types/palette.types'
import { ColorCard } from '@/components/ColorCard'
import { IColor } from '@/types/color.types'
import { usePickerStore } from '@/store/picker.store'
import { Scroller } from '@/components/Scroller'
import { preparePickerForOpen } from '@/utils/picker.util'

export const PalettePage: FC = () => {
  const params = useParams<{ paletteId: string }>()
  const navigate = useNavigate()
  const palettesStore = usePalettesStore()
  const pickerStore = usePickerStore()

  const palette = palettesStore.palettes.find((palette) => palette.id === params.paletteId)

  if (!palette) return null

  const goBack = () => {
    navigate('/palettes')
  }

  const onPaletteChange = (palette: IPalette) => {
    palettesStore.updatePalette(palette.id, palette)
  }

  const onColorChange = (color: IColor) => {
    palettesStore.updateColorInPalette(palette.id, color.id, color)
  }

  const pickColor = async () => {
    preparePickerForOpen(() => pickerStore.openPicker({ target: 'PALETTE', paletteId: palette.id }))
  }

  const addColor = () => {
    navigate(`/palettes/${palette.id}/color`)
  }

  const exportPalette = () => {
    navigate(`/palettes/${palette.id}/export`)
  }

  return (
    <Stack dir="vertical" gap="none" grow>
      <Header extraPaddingRight>
        <Stack grow align="center">
          <Button iconPre={CaretLeft} padding="small" onClick={goBack} nativeTooltip="Back" />
          <Text
            text={palette.label}
            editable
            onTextChange={(label) => onPaletteChange({ ...palette, label })}
            align="center"
            grow
          />
        </Stack>
      </Header>
      <Scroller>
        <Stack dir="vertical" gap="medium" padding="medium">
          <Stack>
            <Button iconPre={Eyedropper} onClick={pickColor} grow nativeTooltip="Pick color from screen" />
            <Button iconPre={Plus} onClick={addColor} grow nativeTooltip="Add color manually" />
            <Button iconPre={Export} onClick={exportPalette} grow nativeTooltip="Export palette" />
          </Stack>
          {palette.colors.map((color) => (
            <ColorCard
              key={color.id}
              color={color}
              onDelete={() => palettesStore.removeColorFromPalette(palette.id, color.id)}
              onEdit={() => navigate(`/palettes/${palette.id}/color/${color.id}`)}
              onDuplicate={() => palettesStore.duplicateColorInPalette(palette.id, color.id)}
              onColorChange={onColorChange}
            />
          ))}
        </Stack>
      </Scroller>
    </Stack>
  )
}
