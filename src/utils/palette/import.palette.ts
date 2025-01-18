import { EImportPaletteVariant, IPalette, IPlainColorPaletteJson } from '@/types/palette.types'
import { open } from '@tauri-apps/plugin-dialog'
import { readTextFile } from '@tauri-apps/plugin-fs'
import { fetch } from '@tauri-apps/plugin-http'
import { generateRandomUuid } from '@/utils/uuid.util'
import { sanitizeHexInputValue } from '../sanitize.util'

export const importPaletteVariants = [
  {
    id: EImportPaletteVariant.PLAINCOLOR_JSON,
    label: 'PlainColor JSON',
    infoText: 'Import colors from PlainColor JSON file',
  },
  {
    id: EImportPaletteVariant.TAILWIND_COLORS_JS,
    label: 'Tailwind CSS default colors',
    infoText: 'Download default Tailwind CSS colors from',
    infoUrl: 'https://github.com/tailwindlabs/tailwindcss/blob/main/src/public/colors.js',
    infoUrlLabel: 'tailwindcss GitHub repository',
  },
]

interface ITailwindColorsJsResponseObject {
  [color: string]:
    | {
        [shade: string]: string
      }
    | string
}

export const importPalette = async (importVariant: EImportPaletteVariant): Promise<Omit<IPalette, 'id' | 'view'>> => {
  switch (importVariant) {
    case EImportPaletteVariant.PLAINCOLOR_JSON: {
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
      const parsed = JSON.parse(fileContent) as IPlainColorPaletteJson

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
    case EImportPaletteVariant.TAILWIND_COLORS_JS: {
      const response = await fetch(
        'https://raw.githubusercontent.com/tailwindlabs/tailwindcss/refs/heads/main/src/public/colors.js',
        {
          method: 'GET',
        }
      )
      const text = await response.text()

      let jsObjectStr = text.match(/export default\s*({[\s\S]*});?/)?.[1] || '' // extract {} object
      jsObjectStr = jsObjectStr.replace(/get\s+\w+\s*\([^)]*\)\s*{[\s\S]*?return[\s\S]*?},?/g, '') // remove getters
      jsObjectStr = jsObjectStr.replace(/,(\s*[}\]])/g, '$1') // remove trailing commas
      const json = jsObjectStr.replace(/(\w+):/g, '"$1":').replace(/'/g, '"') // transform js object to json
      const jsObject = JSON.parse(json) as ITailwindColorsJsResponseObject

      let colors = Object.entries(jsObject)
        .map(([colorKey, colorValue]) => {
          if (typeof colorValue === 'string') {
            return [
              {
                id: generateRandomUuid(),
                label: colorKey,
                hex:
                  colorValue.startsWith('#') && (colorValue.length === 7 || colorValue.length === 9)
                    ? colorValue.replace('#', '').toLowerCase()
                    : '',
              },
            ]
          } else {
            return Object.entries(colorValue).map(([shadeKey, shadeValue]) => {
              return {
                id: generateRandomUuid(),
                label: `${colorKey}-${shadeKey}`,
                hex:
                  shadeValue.startsWith('#') && (shadeValue.length === 7 || shadeValue.length === 9)
                    ? shadeValue.replace('#', '').toLowerCase()
                    : '',
              }
            })
          }
        })
        .flat()
      colors = colors.filter((color) => color.hex) // remove all colors that are not hex values

      return { label: 'Tailwind CSS', colors }
    }
  }
}
