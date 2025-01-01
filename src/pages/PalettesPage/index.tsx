import { Stack } from '@/components/Stack'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import { Text } from '@/components/Text'
import { CaretLeft, Plus } from '@phosphor-icons/react'
import { usePalettesStore } from '@/store/palettes.store'
import { PaletteCard } from '@/components/PaletteCard'
import { generateRandomUuid } from '@/utils/uuid.util'

export const PalettesPage: FC = () => {
  const navigate = useNavigate()
  const palettesStore = usePalettesStore()

  const goBack = () => {
    navigate('/')
  }

  const addPalette = () => {
    palettesStore.addPalette({ id: generateRandomUuid(), label: 'New Palette', colors: [] })
  }

  return (
    <Stack dir="vertical" gap="none" grow>
      <Header
        leftElement={<Button iconPre={CaretLeft} padding="small" onClick={goBack} nativeTooltip="Back" />}
        rightElement={<Button iconPre={Plus} padding="small" onClick={addPalette} nativeTooltip="Add palette" />}
      >
        <Text text="Palettes" />
      </Header>
      <Stack dir="vertical" gap="medium" padding="medium">
        {palettesStore.palettes.map((palette) => (
          <PaletteCard
            key={palette.id}
            palette={palette}
            onDelete={() => palettesStore.removePalette(palette.id)}
            onDuplicate={() => palettesStore.duplicatePalette(palette.id)}
          />
        ))}
      </Stack>
    </Stack>
  )
}
