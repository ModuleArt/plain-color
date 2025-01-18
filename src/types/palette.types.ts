import { IColor } from './color.types'

export interface IPalette {
  id: string
  label: string
  colors: IColor[]
  view: 'list' | 'grid'
}

export enum EExportPaletteVariant {
  PLAINCOLOR_JSON = 'PLAINCOLOR_JSON',
  JSON = 'JSON',
  CSS_VARS = 'CSS_VARS',
  SASS_VARS = 'SASS_VARS',
  JS_OBJECT = 'JS_OBJECT',
}

export enum EImportPaletteVariant {
  PLAINCOLOR_JSON = 'PLAINCOLOR_JSON',
  TAILWIND_COLORS_JS = 'TAILWIND_COLORS_JS',
}

export type IPlainColorPaletteJson = Omit<IPalette, 'id' | 'colors' | 'view'> & { colors: Omit<IColor, 'id'>[] }
