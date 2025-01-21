import { Stack } from '@/components/Stack'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { usePalettesStore } from '@/store/palettes.store'
import { Textarea } from '@/components/Textarea'
import { EExportPaletteVariant } from '@/types/palette.types'
import { Select } from '@/components/Select'
import { exportPalette, exportPaletteVariants } from '@/utils/palette/export.palette'
import { useSettingsStore } from '@/store/settings.store'
import { copyVariants } from '@/utils/copyVariants.util'
import { Copy } from '@phosphor-icons/react'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { save } from '@tauri-apps/plugin-dialog'
import { writeTextFile } from '@tauri-apps/plugin-fs'
import { ITextareaRef } from '@/components/Textarea/props'
import { invokeSaveClrFile } from '@/utils/cmd/clr.cmd.util'

export const ExportPalettePage: FC = () => {
  const params = useParams<{ paletteId: string }>()
  const navigate = useNavigate()
  const palettesStore = usePalettesStore()
  const settingsStore = useSettingsStore()
  const [exportVariant, setExportVariant] = useState(EExportPaletteVariant.PLAINCOLOR_JSON)
  const [colorFormat, setColorFormat] = useState(settingsStore.defaultCopyVariant)
  const textareaRef = useRef<ITextareaRef>(null)

  const palette = useMemo(
    () => palettesStore.palettes.find((palette) => palette.id === params.paletteId),
    [palettesStore.palettes, params.paletteId]
  )

  if (!palette) return null

  const goBack = () => {
    navigate(`/palettes/${palette.id}`)
  }

  const exportPaletteVariant = useMemo(
    () => exportPaletteVariants.find((epv) => epv.id === exportVariant)!,
    [exportVariant]
  )
  const fileContent = useMemo(
    () => exportPalette(exportVariant, palette, colorFormat),
    [exportVariant, palette, colorFormat]
  )

  const saveFile = async () => {
    switch (exportPaletteVariant.id) {
      case EExportPaletteVariant.APPLE_CLR: {
        invokeSaveClrFile(palette)
        break
      }
      default: {
        const filePath = await save({
          title: `Save "${palette.label}"`,
          filters: [
            {
              name: exportPaletteVariant.fileExtension.toUpperCase(),
              extensions: [exportPaletteVariant.fileExtension],
            },
          ],
          defaultPath: palette.label,
        })

        if (filePath) {
          writeTextFile(filePath, fileContent)
        }
      }
    }
  }

  const copyContent = () => {
    writeText(fileContent)
    textareaRef.current?.showOverlayMessage('Copied')
  }

  const filteredCopyVariants = useMemo(
    () =>
      exportPaletteVariant.availableColorProfiles === 'all'
        ? copyVariants
        : copyVariants.filter((cp) =>
            Array.isArray(exportPaletteVariant.availableColorProfiles)
              ? exportPaletteVariant.availableColorProfiles.find((acp) => cp.id === acp)
              : []
          ),
    [exportPaletteVariant]
  )

  useEffect(() => {
    if (filteredCopyVariants.length) {
      setColorFormat(filteredCopyVariants[0].id)
    }
  }, [exportVariant])

  return (
    <Stack dir="vertical" gap="medium" grow padding="medium">
      <Stack grow dir="vertical">
        <Select
          options={exportPaletteVariants}
          value={[exportVariant]}
          onChange={(options) => setExportVariant(options[0])}
          fullWidth
        />
        {filteredCopyVariants.length > 0 && (
          <Select
            options={filteredCopyVariants}
            value={[colorFormat]}
            onChange={(options) => setColorFormat(options[0])}
            fullWidth
          />
        )}
        <Textarea readonly value={fileContent} ref={textareaRef} />
      </Stack>
      <Stack>
        <Button label="Cancel" onClick={goBack} grow />
        <Button label="Export" onClick={saveFile} grow />
        {exportPaletteVariant.allowCopy && <Button onClick={copyContent} iconPre={Copy} padding="small" />}
      </Stack>
    </Stack>
  )
}
