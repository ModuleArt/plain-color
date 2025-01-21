import { EImportPaletteVariant, IPalette, TPaletteImporterResult } from '@/types/palette.types'
import { importPalette } from './palette/import.palette'
import { generateRandomUuid } from './uuid.util'
import { open } from '@tauri-apps/plugin-dialog'

export const handleOpenWith = async (filePath: string, callback: (palette: IPalette) => void) => {
  try {
    if (typeof filePath !== 'string') return

    if (filePath.startsWith('file://')) filePath = filePath.replace('file://', '')

    let result: TPaletteImporterResult | null = null

    if (filePath.endsWith('.plaincolorjson')) {
      result = await importPalette(EImportPaletteVariant.PLAINCOLOR_JSON, filePath)
    } else if (filePath.endsWith('.clr')) {
      result = await importPalette(EImportPaletteVariant.APPLE_CLR, filePath)
    }

    if (result) {
      callback({ id: generateRandomUuid(), label: result.label, colors: result.colors, view: 'list' })
    }
  } catch (err: any) {
    if (typeof err === 'string' && err.includes('forbidden path')) {
      const file = await open({
        title: 'Import palette from file',
        filters: [{ name: 'Palette file', extensions: ['plaincolorjson', 'clr'] }],
        multiple: false,
        directory: false,
        defaultPath: filePath,
      })

      if (file) {
        return handleOpenWith(file, callback)
      }
    } else {
      console.error(err)
    }
  }
}

export const handleDeepLink = (urls: string[] | null, callback: (palette: IPalette) => void) => {
  if (urls && urls.length) {
    const url = urls[0]
    if (url.startsWith('file://')) {
      handleOpenWith(decodeURIComponent(url), callback)
    }
  }
}
