import { IPalette } from '@/types/palette.types'
import { invokeCmd } from '.'
import { IClrResponseObject } from '@/utils/palette/importers/clr.importer'

export const invokeLoadClrFile = async (filePath: string) => {
  return invokeCmd<string>('load_clr_file', { filePath })
}

export const invokeSaveClrFile = async (palette: IPalette) => {
  const json: IClrResponseObject = {
    paletteName: palette.label,
    colorList: palette.colors.reduce((prev, cur) => {
      return { ...prev, [cur.label]: `#${cur.hex.toUpperCase()}` }
    }, {}),
  }

  return invokeCmd<string>('save_clr_file', { json: JSON.stringify(json) })
}
