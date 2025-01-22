import { EImportPaletteVariant, IPalette, TPaletteImporterResult } from '@/types/palette.types'
import { importPalette } from './palette/import.palette'
import { generateRandomUuid } from './uuid.util'
import { open } from '@tauri-apps/plugin-dialog'

const handleOpenWith = async (filePath: string): Promise<IPalette | null> => {
  if (typeof filePath !== 'string') return null

  if (filePath.startsWith('file://')) filePath = filePath.replace('file://', '')

  let result: TPaletteImporterResult | null = null

  try {
    if (filePath.endsWith('.plaincolorjson')) {
      result = await importPalette(EImportPaletteVariant.PLAINCOLOR_JSON, filePath)
    } else if (filePath.endsWith('.clr')) {
      result = await importPalette(EImportPaletteVariant.APPLE_CLR, filePath)
    }
  } catch (err: any) {
    console.error(err)

    if (err.toString().includes('forbidden path')) {
      const file = await open({
        title: 'Import palette from file',
        filters: [{ name: 'Palette file', extensions: ['plaincolorjson', 'clr'] }],
        multiple: false,
        directory: false,
        defaultPath: filePath,
      })

      if (file) {
        return handleOpenWith(file)
      }
    }
  }

  if (result) {
    return { id: generateRandomUuid(), label: result.label, colors: result.colors, view: 'list' }
  }
  return null
}

export const handleOpenWithMultiple = async (filePaths: string[]): Promise<IPalette[]> => {
  if (!Array.isArray(filePaths)) return []

  const palettes: IPalette[] = []

  for (const filePath of filePaths) {
    const palette = await handleOpenWith(filePath)
    if (palette) palettes.push(palette)
  }

  return palettes
}

export const handleDeepLink = async (urls: string[] | null): Promise<IPalette[]> => {
  if (urls && urls.length) {
    const files = urls.filter((url) => url.startsWith('file://')).map((url) => decodeURIComponent(url))
    return handleOpenWithMultiple(files)
  }
  return []
}
