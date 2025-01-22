import { TPaletteImporterResult } from '@/types/palette.types'
import { generateRandomUuid } from '@/utils/uuid.util'
import { fetch } from '@tauri-apps/plugin-http'

const getFiles = async () => {
  const response = await fetch(
    'https://raw.githubusercontent.com/mui/material-ui/refs/heads/master/packages/mui-material/src/colors/index.js',
    {
      method: 'GET',
    }
  )
  const fileListText = await response.text()

  const regex = /'\.\/(.*?)'/g
  const matches = [...fileListText.matchAll(regex)]

  return matches.map((match) => ({
    fileName: match[1],
    fileUrl: `https://raw.githubusercontent.com/mui/material-ui/refs/heads/master/packages/mui-material/src/colors/${match[1]}.js`,
  }))
}

const processFile = async (fileName: string, fileUrl: string): Promise<{ key: string; value: string }[]> => {
  const response = await fetch(fileUrl, {
    method: 'GET',
  })
  const text = await response.text()

  const regex = /(\w+):\s*'#([0-9a-fA-F]+)'/g // Regex to capture keys and hex values without the '#'
  const matches = [...text.matchAll(regex)]

  return matches.map((match) => ({
    key: `${fileName} ${match[1]}`, // Extract the key (label)
    value: match[2], // Extract the hex value without the '#'
  }))
}

export const muiImporter = async (): Promise<TPaletteImporterResult> => {
  const files = await getFiles()

  const fileResults = await Promise.all(files.map((file) => processFile(file.fileName, file.fileUrl)))

  const colors = fileResults
    .flat()
    .filter((c) => c.value.length === 6 || c.value.length === 8)
    .map((c) => ({ id: generateRandomUuid(), label: c.key, hex: c.value }))

  return { label: 'Material UI', colors }
}
