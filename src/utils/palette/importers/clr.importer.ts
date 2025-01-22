import { IColor } from '@/types/color.types'
import { TPaletteImporterResult } from '@/types/palette.types'
import { invokeLoadClrFile } from '@/utils/cmd/clr.cmd.util'
import { generateRandomUuid } from '@/utils/uuid.util'
import { open } from '@tauri-apps/plugin-dialog'

export interface IClrResponseObject {
  paletteName: string
  colorList: {
    [color: string]: string
  }
}

export const clrImporter = async (filePath?: string): Promise<TPaletteImporterResult> => {
  if (!filePath) {
    const file = await open({
      title: 'Import palette from Apple Color List (.clr) file',
      filters: [{ name: 'Apple Color List', extensions: ['clr'] }],
      multiple: false,
      directory: false,
    })

    if (file) {
      filePath = file
    }
  }

  if (!filePath) {
    throw new Error('Action rejected')
  }

  const json = (await invokeLoadClrFile(filePath)).trim()

  if (!json.startsWith('{') || !json.endsWith('}')) {
    throw new Error(json)
  }

  const obj = JSON.parse(json) as IClrResponseObject

  const colors = Object.entries(obj.colorList).map<IColor>(([label, hexWithSharp]) => ({
    id: generateRandomUuid(),
    label,
    hex: hexWithSharp.replace('#', ''),
  }))

  return { label: decodeURIComponent(obj.paletteName), colors }
}
