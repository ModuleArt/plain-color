import { EImportPaletteVariant, IPalette, TPaletteImporterResult } from '@/types/palette.types'
import { importPalette } from './palette/import.palette'
import { generateRandomUuid } from './uuid.util'

export const handleOpenWith = async (filePath: string, callback: (palette: IPalette) => void) => {
  let result: TPaletteImporterResult | null = null

  try {
    if (filePath.endsWith('.plaincolorjson')) {
      result = await importPalette(EImportPaletteVariant.PLAINCOLOR_JSON, filePath)
    } else if (filePath.endsWith('.clr')) {
      result = await importPalette(EImportPaletteVariant.APPLE_CLR, filePath)
    }
  } catch (err: any) {
    console.error(err)
  }

  if (result) {
    callback({ id: generateRandomUuid(), label: result.label, colors: result.colors, view: 'list' })
  }
}
