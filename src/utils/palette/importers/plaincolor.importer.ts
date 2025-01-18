import { TPaletteImporterResult, TPlainColorPaletteJson } from '@/types/palette.types'
import { open } from '@tauri-apps/plugin-dialog'
import { readTextFile } from '@tauri-apps/plugin-fs'
import { generateRandomUuid } from '@/utils/uuid.util'
import { sanitizeHexInputValue } from '@/utils/sanitize.util'

export const plaincolorImporter = async (): Promise<TPaletteImporterResult> => {
  const filePath = await open({
    title: 'Import palette from PlainColor JSON',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    multiple: false,
    directory: false,
  })

  if (!filePath) {
    throw new Error('Action rejected')
  }

  const fileContent = await readTextFile(filePath)
  const parsed = JSON.parse(fileContent) as TPlainColorPaletteJson

  if (!parsed.colors || !parsed.label) {
    throw new Error('Wrong palette format')
  }

  if (parsed.label && typeof parsed.label !== 'string') {
    throw new Error('Wrong palette label value')
  }
  if (parsed.colors && !Array.isArray(parsed.colors)) {
    throw new Error('Wrong palette colors value')
  }

  const colors = parsed.colors.filter((color) => {
    return (
      typeof color.label === 'string' &&
      typeof color.hex === 'string' &&
      (color.hex.length === 6 || color.hex.length === 8) &&
      color.hex === sanitizeHexInputValue(color.hex)
    )
  })

  return {
    label: parsed.label,
    colors: colors.map((color) => ({ id: generateRandomUuid(), label: color.label, hex: color.hex })),
  }
}
