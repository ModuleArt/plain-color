import { IColor } from '@/types/color.types'
import { EExportPaletteVariant } from '@/types/export.types'
import { ECopyVariant } from '@/types/settings.types'
import { formatCopyText } from '@/utils/copyVariants.util'

export const exportPaletteVariants = [
  { id: EExportPaletteVariant.JSON, label: 'JSON', fileExtension: 'json' },
  { id: EExportPaletteVariant.CSS_VARS, label: 'CSS variables', fileExtension: 'css' },
  { id: EExportPaletteVariant.SASS_VARS, label: 'SASS variables', fileExtension: 'scss' },
  { id: EExportPaletteVariant.JS_OBJECT, label: 'JavaScript object', fileExtension: 'js' },
]

const formatJsObjectFieldName = (fieldName: string) => {
  const sanitized = fieldName.replace(/[^a-z0-9_$ ]+/gi, '')
  const words = sanitized.split(/[\s_]+/)
  let camelCased = words
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('')
  if (/^[0-9]/.test(camelCased)) {
    camelCased = `_${camelCased}`
  }
  return camelCased
}

const formatCssVariableName = (variableName: string) => {
  const sanitized = variableName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/^[^a-zA-Z_]/, '_')
  return sanitized
}

const exportColor = (
  exportVariant: EExportPaletteVariant,
  color: IColor,
  colorFormat: ECopyVariant,
  isLastRow: boolean
) => {
  const formattedColor = formatCopyText(color.hex, colorFormat)

  switch (exportVariant) {
    case EExportPaletteVariant.JSON: {
      return `  "${color.label}": "${formattedColor}"${isLastRow ? '' : ','}`
    }
    case EExportPaletteVariant.CSS_VARS: {
      const variableName = formatCssVariableName(`color-${color.label}`)
      return `  --${variableName}: ${formattedColor};`
    }
    case EExportPaletteVariant.SASS_VARS: {
      const variableName = formatCssVariableName(`color-${color.label}`)
      return `$${variableName}: ${formattedColor};`
    }
    case EExportPaletteVariant.JS_OBJECT: {
      const fieldName = formatJsObjectFieldName(color.label)
      return `  ${fieldName}: "${formattedColor}",`
    }
  }
}

export const exportPalette = (
  exportVariant: EExportPaletteVariant,
  colors: IColor[],
  colorFormat: ECopyVariant,
  paletteName: string
) => {
  let prefix = ''
  let postfix = ''

  switch (exportVariant) {
    case EExportPaletteVariant.JSON: {
      prefix = '{\n'
      postfix = '\n}'
      break
    }
    case EExportPaletteVariant.CSS_VARS: {
      prefix = `:root {\n  /* ${paletteName} */\n`
      postfix = '\n}'
      break
    }
    case EExportPaletteVariant.SASS_VARS: {
      prefix = `// ${paletteName}\n`
      postfix = ''
      break
    }
    case EExportPaletteVariant.JS_OBJECT: {
      const fieldName = formatJsObjectFieldName(paletteName)
      prefix = `const ${fieldName} = {\n`
      postfix = '\n};'
      break
    }
  }

  const body = colors
    .map((color, index) => exportColor(exportVariant, color, colorFormat, index === colors.length - 1))
    .join('\n')

  return `${prefix}${body}${postfix}`
}
