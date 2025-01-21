import { IColor } from '@/types/color.types'
import { TPaletteImporterResult } from '@/types/palette.types'
import { generateRandomUuid } from '@/utils/uuid.util'
import { fetch } from '@tauri-apps/plugin-http'

const getFiles = async () => {
  const response = await fetch('https://api.github.com/repos/phpcolor/apple-colors/contents/Resources/colors', {
    method: 'GET',
  })
  const fileListJson = (await response.json()) as { name: string; download_url: string }[]

  return fileListJson
    .filter((file) => file.name.endsWith('.php'))
    .map((file) => ({ fileName: file.name, fileUrl: file.download_url }))
}

const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

const processFile = async (fileName: string, fileUrl: string): Promise<IColor[]> => {
  const response = await fetch(fileUrl, {
    method: 'GET',
  })
  const phpContent = await response.text()

  const regex = /'(\w+)' => \['#([A-Fa-f0-9]{6})'/g
  const categoriesRegex = /'(light|dark)' => \[/g

  // Extract categories for matching light/dark sections.
  const categories: string[] = [...phpContent.matchAll(categoriesRegex)].map((match) => match[1])

  // Extract colors with names and hex codes.
  const matches = [...phpContent.matchAll(regex)]
  const results: IColor[] = []

  let currentCategoryIndex = -1

  matches.forEach((match) => {
    const [_, name, hex] = match
    // Determine the category for the color.
    const lineIndex = phpContent.indexOf(match[0])
    if (
      currentCategoryIndex < categories.length - 1 &&
      lineIndex > phpContent.indexOf(categories[currentCategoryIndex + 1])
    ) {
      currentCategoryIndex++
    }
    const category = categories[currentCategoryIndex]
    results.push({
      id: generateRandomUuid(),
      label: `${fileName} ${capitalize(name)}` + (category ? ` ${capitalize(category)}` : ''),
      hex: hex.toLowerCase(),
    })
  })

  return results
}

export const appleImporter = async (): Promise<TPaletteImporterResult> => {
  const files = await getFiles()

  const fileResults = await Promise.all(
    files.map((file) => processFile(file.fileName.replace('.php', ''), file.fileUrl))
  )

  const colors = fileResults
    .flat()
    .filter((c) => c.hex.length === 6 || c.hex.length === 8)
    .toSorted((a, b) => {
      if (a.label < b.label) {
        return -1
      }
      if (a.label > b.label) {
        return 1
      }
      return 0
    })

  return { label: 'Apple', colors }
}
