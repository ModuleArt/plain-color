import { EImportPaletteVariant, TPaletteImporterResult } from '@/types/palette.types'
import { tailwindImporter } from './importers/tailwind.importer'
import { plaincolorImporter } from './importers/plaincolor.importer'
import { muiImporter } from './importers/mui.importer'

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
  {
    id: EImportPaletteVariant.MUI_COLORS_JS,
    label: 'Material UI default colors',
    infoText: 'Download default Material UI colors from',
    infoUrl: 'https://github.com/mui/material-ui/tree/master/packages/mui-material/src/colors',
    infoUrlLabel: 'material-ui GitHub repository',
  },
]

export const importPalette = async (importVariant: EImportPaletteVariant): Promise<TPaletteImporterResult> => {
  switch (importVariant) {
    case EImportPaletteVariant.PLAINCOLOR_JSON: {
      return plaincolorImporter()
    }
    case EImportPaletteVariant.TAILWIND_COLORS_JS: {
      return tailwindImporter()
    }
    case EImportPaletteVariant.MUI_COLORS_JS: {
      return muiImporter()
    }
  }
}
