import { Stack } from '@/components/Stack'
import { FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import { Text } from '@/components/Text'
import {
  CaretLeft,
  Eyedropper,
  Plus,
  UploadSimple,
  DownloadSimple,
  SquaresFour,
  TextAlignJustify,
} from '@phosphor-icons/react'
import { usePalettesStore } from '@/store/palettes.store'
import { IPalette } from '@/types/palette.types'
import { ColorCard } from '@/components/ColorCard'
import { IColor } from '@/types/color.types'
import { usePickerStore } from '@/store/picker.store'
import { preparePickerForOpen } from '@/utils/picker.util'
import { sanitizeLabel } from '@/utils/sanitize.util'
import { VirtualScroller } from '@/components/VirtualScroller'

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

  const importPalette = () => {
    navigate(`/palettes/${palette.id}/import`)
  }

  const toggleView = () => {
    palettesStore.updatePalette(palette.id, { ...palette, view: palette.view === 'grid' ? 'list' : 'grid' })
  }

  const onPaletteNameInputBlur = () => {
    onPaletteChange({ ...palette, label: sanitizeLabel(palette.label) || 'My Palette' })
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
            onInputBlur={onPaletteNameInputBlur}
            align="center"
            grow
            textWrap={false}
            maxWidth={204}
          />
        </Stack>
      </Header>
      <Stack dir="vertical" gap="none" grow>
        <Header>
          <Stack grow>
            <Button iconPre={Eyedropper} onClick={pickColor} grow nativeTooltip="Pick color from screen" />
            <Button iconPre={Plus} onClick={addColor} grow nativeTooltip="Add color manually" />
            <Button iconPre={DownloadSimple} onClick={importPalette} grow nativeTooltip="Import colors" />
            <Button iconPre={UploadSimple} onClick={exportPalette} grow nativeTooltip="Export palette" />
            <Button
              iconPre={palette.view === 'grid' ? TextAlignJustify : SquaresFour}
              onClick={toggleView}
              grow
              nativeTooltip={palette.view === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            />
          </Stack>
        </Header>
        <VirtualScroller
          grow
          items={palette.colors}
          itemSize={palette.view === 'grid' ? 36 : 72}
          renderItem={(color) => (
            <ColorCard
              key={color.id}
              color={color}
              onDelete={() => palettesStore.removeColorFromPalette(palette.id, color.id)}
              onEdit={() => navigate(`/palettes/${palette.id}/color/${color.id}`)}
              onDuplicate={() => palettesStore.duplicateColorInPalette(palette.id, color.id)}
              onColorChange={onColorChange}
              variant={palette.view}
            />
          )}
          columnCount={palette.view === 'grid' ? 5 : 1}
        />
      </Stack>
    </Stack>
  )
}
