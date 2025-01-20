import { IColor } from '@/types/color.types'
import { TPaletteImporterResult } from '@/types/palette.types'
import { invokeLoadClrFile } from '@/utils/cmd/clr.cmd.util'
import { generateRandomUuid } from '@/utils/uuid.util'

export interface IClrResponseObject {
  paletteName: string
  colorList: {
    [color: string]: string
  }
}

export const clrImporter = async (): Promise<TPaletteImporterResult> => {
  const json = (await invokeLoadClrFile()).trim()

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
