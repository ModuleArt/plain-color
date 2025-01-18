import { IPalette } from '@/types/palette.types'
import { generateRandomUuid } from '@/utils/uuid.util'
import { generateColorLabel } from '@/utils/color'

// Trending 1 and 2 -  https://coolors.co/palettes/trending
const predefinedPalette1 = ['606c38', '283618', 'fefae0', 'dda15e', 'bc6c25']
const predefinedPalette2 = ['8ecae6', '219ebc', '023047', 'ffb703', 'fb8500']

// 10 shades of P!NK - https://coolors.co/palette/590d22-800f2f-a4133c-c9184a-ff4d6d-ff758f-ff8fa3-ffb3c1-ffccd5-fff0f3
const predefinedPalette3 = [
  '590d22',
  '800f2f',
  'a4133c',
  'c9184a',
  'ff4d6d',
  'ff758f',
  'ff8fa3',
  'ffb3c1',
  'ffccd5',
  'fff0f3',
]

// All time popular - https://colorhunt.co/palettes/popular
const predefinedPalette4 = ['222831', '393e46', '00adb5', 'eeeeee']

// Palette of the month - https://colorhunt.co/palettes/popular
const predefinedPalette5 = ['86a788', 'fffdec', 'ffe2e2', 'ffcfcf']

export const predefinedPalettes: IPalette[] = [
  {
    id: generateRandomUuid(),
    label: 'Trending 1',
    colors: predefinedPalette1.map((hex) => ({ id: generateRandomUuid(), hex, label: generateColorLabel(hex) })),
    view: 'list',
  },
  {
    id: generateRandomUuid(),
    label: 'Trending 2',
    colors: predefinedPalette2.map((hex) => ({ id: generateRandomUuid(), hex, label: generateColorLabel(hex) })),
    view: 'list',
  },
  {
    id: generateRandomUuid(),
    label: '10 shades of P!NK',
    colors: predefinedPalette3.map((hex) => ({ id: generateRandomUuid(), hex, label: generateColorLabel(hex) })),
    view: 'grid',
  },
  {
    id: generateRandomUuid(),
    label: 'All time popular',
    colors: predefinedPalette4.map((hex) => ({ id: generateRandomUuid(), hex, label: generateColorLabel(hex) })),
    view: 'list',
  },
  {
    id: generateRandomUuid(),
    label: 'Palette of the month',
    colors: predefinedPalette5.map((hex) => ({ id: generateRandomUuid(), hex, label: generateColorLabel(hex) })),
    view: 'list',
  },
]
