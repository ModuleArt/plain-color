import { Stack } from '@/components/Stack'
import { FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { usePalettesStore } from '@/store/palettes.store'
import { Textarea } from '@/components/Textarea'
import { EExportPaletteVariant } from '@/types/export.types'
import { Select } from '@/components/Select'
import { exportPalette, exportPaletteVariants } from '@/utils/export'
import { useSettingsStore } from '@/store/settings.store'
import { copyVariants } from '@/utils/copyVariants.util'
import { Copy } from '@phosphor-icons/react'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'

export const ExportPalettePage: FC = () => {
  const params = useParams<{ paletteId: string }>()
  const navigate = useNavigate()
  const palettesStore = usePalettesStore()
  const settingsStore = useSettingsStore()
  const [exportVariant, setExportVariant] = useState(EExportPaletteVariant.JSON)
  const [colorFormat, setColorFormat] = useState(settingsStore.defaultCopyVariant)

  const palette = palettesStore.palettes.find((palette) => palette.id === params.paletteId)

  if (!palette) return null

  const goBack = () => {
    navigate(`/palettes/${palette.id}`)
  }

  const result = exportPalette(exportVariant, palette.colors, colorFormat)

  const saveFile = () => {}

  const copyContent = () => {
    writeText(result)
  }

  return (
    <Stack dir="vertical" gap="medium" grow padding="medium">
      <Stack grow dir="vertical">
        <Select
          options={exportPaletteVariants}
          value={[exportVariant]}
          onChange={(options) => setExportVariant(options[0])}
          fullWidth
        />
        <Select
          options={copyVariants}
          value={[colorFormat]}
          onChange={(options) => setColorFormat(options[0])}
          fullWidth
        />
        <Textarea readonly value={result} />
      </Stack>
      <Stack>
        <Button label="Cancel" onClick={goBack} grow />
        <Button label="Export" onClick={saveFile} grow />
        <Button onClick={copyContent} iconPre={Copy} padding="small" />
      </Stack>
    </Stack>
  )
}
