import { Stack } from '@/components/Stack'
import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { usePalettesStore } from '@/store/palettes.store'
import { Select } from '@/components/Select'
import { importPalette, importPaletteVariants } from '@/utils/palette/import.palette'
import { EImportPaletteVariant } from '@/types/palette.types'
import { Text } from '@/components/Text'
import { open } from '@tauri-apps/plugin-shell'
import { ArrowSquareOut } from '@phosphor-icons/react'

export const ImportPalettePage: FC = () => {
  const params = useParams<{ paletteId: string }>()
  const navigate = useNavigate()
  const palettesStore = usePalettesStore()
  const [importVariant, setImportVariant] = useState(EImportPaletteVariant.PLAINCOLOR_JSON)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const palette = palettesStore.palettes.find((palette) => palette.id === params.paletteId)

  if (!palette) return null

  const goBack = () => {
    navigate(`/palettes/${palette.id}`)
  }

  const importPaletteVariant = importPaletteVariants.find((ipv) => ipv.id === importVariant)!

  const goImport = async () => {
    setIsLoading(true)
    try {
      const importedPalette = await importPalette(importVariant)
      palettesStore.updatePalette(palette.id, { ...palette, colors: importedPalette.colors.concat(palette.colors) })
      goBack()
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.toString())
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setErrorMessage('')
  }, [importVariant])

  const openUrl = (url: string) => {
    open(url)
  }

  return (
    <Stack dir="vertical" gap="medium" grow padding="medium">
      <Stack grow dir="vertical" gap="large">
        <Stack dir="vertical" gap="medium">
          <Select
            options={importPaletteVariants}
            value={[importVariant]}
            onChange={(options) => setImportVariant(options[0])}
            fullWidth
          />
          <Stack dir="vertical" gap="none">
            <Text text={importPaletteVariant.infoText} size="small" tinted />
            {importPaletteVariant.infoUrl && (
              <Stack>
                <Button
                  iconPost={ArrowSquareOut}
                  size="inline"
                  variant="clear"
                  label={importPaletteVariant.infoUrlLabel || 'Learn more'}
                  onClick={() => openUrl(importPaletteVariant.infoUrl)}
                />
              </Stack>
            )}
          </Stack>
        </Stack>
        {errorMessage && (
          <Stack dir="vertical" gap="none">
            <Text text={errorMessage} size="small" tinted />
          </Stack>
        )}
      </Stack>
      {isLoading ? (
        <Stack justify="center">
          <Text text="Loading..." />
        </Stack>
      ) : (
        <Stack>
          <Button label="Cancel" onClick={goBack} grow />
          <Button label="Import" onClick={goImport} grow />
        </Stack>
      )}
    </Stack>
  )
}
