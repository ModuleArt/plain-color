import { FC, useEffect } from 'react'
import { ColorCard } from '@/components/ColorCard'
import { Stack } from '@/components/Stack'
import { Button } from '@/components/Button'
import { Eyedropper, Plus } from '@phosphor-icons/react'
import { useColorsStore } from '@/store/colors'
import { rgbToHex } from '@/utils/color'
import namer from 'color-namer'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { useNavigate } from 'react-router-dom'

export const HomePage: FC = () => {
  const colorsStore = useColorsStore()
  const navigate = useNavigate()

  useEffect(() => {
    listen<[number, number, number]>('color_picked', (event) => {
      const hex = rgbToHex({ red: event.payload[0], green: event.payload[1], blue: event.payload[2], alpha: 1 })
      const label = namer(hex).ntc[0].name

      colorsStore.addColor({ id: crypto.randomUUID(), label, hex })
    })
  }, [])

  const pickColor = () => {
    invoke('pick_color')
  }

  const addColor = () => {
    navigate('/color')
  }

  return (
    <Stack dir="vertical">
      <Stack>
        <Button icon={Eyedropper} variant="outline" tinted onClick={pickColor} grow />
        <Button icon={Plus} variant="outline" tinted onClick={addColor} grow />
      </Stack>
      {colorsStore.colors.map((color) => (
        <ColorCard
          key={color.id}
          color={color}
          onDelete={() => colorsStore.removeColor(color.id)}
          onEdit={() => navigate(`/color/${color.id}`)}
        />
      ))}
    </Stack>
  )
}
