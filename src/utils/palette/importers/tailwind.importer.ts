import { TPaletteImporterResult } from '@/types/palette.types'
import { generateRandomUuid } from '@/utils/uuid.util'
import { fetch } from '@tauri-apps/plugin-http'

interface ITailwindColorsJsResponseObject {
  [color: string]:
    | {
        [shade: string]: string
      }
    | string
}

export const tailwindImporter = async (): Promise<TPaletteImporterResult> => {
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
