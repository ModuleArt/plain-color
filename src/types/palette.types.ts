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
  APPLE_CLR = 'APPLE_CLR',
}

export enum EImportPaletteVariant {
  PLAINCOLOR_JSON = 'PLAINCOLOR_JSON',
  APPLE_CLR = 'APPLE_CLR',
  APPLE_COLORS_PHP = 'APPLE_COLORS_PHP',
  TAILWIND_COLORS_JS = 'TAILWIND_COLORS_JS',
  MUI_COLORS_JS = 'MUI_COLORS_JS',
}

export type TPlainColorPaletteJson = Omit<IPalette, 'id' | 'colors' | 'view'> & { colors: Omit<IColor, 'id'>[] }

export type TPaletteImporterResult = Omit<IPalette, 'id' | 'view'>
