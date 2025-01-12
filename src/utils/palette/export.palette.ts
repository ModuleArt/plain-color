import { IColor } from '@/types/color.types'
import { EExportPaletteVariant, IPalette } from '@/types/palette.types'
import { ECopyVariant } from '@/types/settings.types'
import { formatCopyText } from '@/utils/copyVariants.util'

export const exportPaletteVariants = [
  { id: EExportPaletteVariant.PLAINCOLOR_JSON, label: 'PlainColor JSON', fileExtension: 'json' },
  { id: EExportPaletteVariant.JSON, label: 'Simple JSON', fileExtension: 'json' },
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
): string => {
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
    default:
      return ''
  }
}

export const exportPalette = (
  exportVariant: EExportPaletteVariant,
  palette: Omit<IPalette, 'id'>,
  colorFormat: ECopyVariant
) => {
  if (exportVariant === EExportPaletteVariant.PLAINCOLOR_JSON) {
    return JSON.stringify({ ...palette, id: undefined })
  } else {
    let prefix = ''
    let postfix = ''

    switch (exportVariant) {
      case EExportPaletteVariant.JSON: {
        prefix = '{\n'
        postfix = '\n}'
        break
      }
      case EExportPaletteVariant.CSS_VARS: {
        prefix = `:root {\n  /* ${palette.label} */\n`
        postfix = '\n}'
        break
      }
      case EExportPaletteVariant.SASS_VARS: {
        prefix = `// ${palette.label}\n`
        postfix = ''
        break
      }
      case EExportPaletteVariant.JS_OBJECT: {
        const fieldName = formatJsObjectFieldName(palette.label)
        prefix = `const ${fieldName} = {\n`
        postfix = '\n};'
        break
      }
    }

    const body = palette.colors
      .map((color, index) => exportColor(exportVariant, color, colorFormat, index === palette.colors.length - 1))
      .join('\n')

    return `${prefix}${body}${postfix}`
  }
}
