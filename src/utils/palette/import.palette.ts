import { EImportPaletteVariant, TPaletteImporterResult } from '@/types/palette.types'
import { tailwindImporter } from './importers/tailwind.importer'
import { plaincolorImporter } from './importers/plaincolor.importer'
import { muiImporter } from './importers/mui.importer'
import { appleImporter } from './importers/apple.importer'

export const importPaletteVariants = [
  {
    id: EImportPaletteVariant.PLAINCOLOR_JSON,
    label: 'PlainColor JSON',
    infoText: 'Import colors from PlainColor JSON file',
  },
  {
    id: EImportPaletteVariant.TAILWIND_COLORS_JS,
    label: 'Tailwind CSS colors',
    infoText: 'Download all the default Tailwind CSS colors from official',
    infoUrl: 'https://github.com/tailwindlabs/tailwindcss/blob/main/src/public/colors.js',
    infoUrlLabel: 'tailwindcss GitHub repository',
  },
  {
    id: EImportPaletteVariant.MUI_COLORS_JS,
    label: 'Material UI colors',
    infoText: 'Download all the default Material UI colors from official',
    infoUrl: 'https://github.com/mui/material-ui/tree/master/packages/mui-material/src/colors',
    infoUrlLabel: 'material-ui GitHub repository',
  },
  {
    id: EImportPaletteVariant.APPLE_COLORS_PHP,
    label: 'Apple colors',
    infoText: 'Download all the default Apple colors for iOS, macOS, tvOS, visionOS, and watchOS from unofficial',
    infoUrl: 'https://github.com/phpcolor/apple-colors/tree/main/Resources/colors',
    infoUrlLabel: 'apple-colors GitHub repository',
  },
]

export const importPalette = async (importVariant: EImportPaletteVariant): Promise<TPaletteImporterResult> => {
  switch (importVariant) {
    case EImportPaletteVariant.PLAINCOLOR_JSON: {
      return plaincolorImporter()
    }
    case EImportPaletteVariant.APPLE_COLORS_PHP: {
      return appleImporter()
    }
    case EImportPaletteVariant.TAILWIND_COLORS_JS: {
      return tailwindImporter()
    }
    case EImportPaletteVariant.MUI_COLORS_JS: {
      return muiImporter()
    }
  }
}
