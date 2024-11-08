import { FC, useEffect, useState } from 'react'
import { listen, emitTo } from '@tauri-apps/api/event'
import './index.scss'
import { rgbToHex } from '@/utils/color'

export const PickerLayout: FC = () => {
  const [image, setImage] = useState('')
  const [color, setColor] = useState<[number, number, number]>([0, 0, 0])

  useEffect(() => {
    listen<[string, [number, number, number, number]]>('preview_fetched', (event) => {
      setImage(event.payload[0])
      console.log(event.payload[1])
      setColor([event.payload[1][0], event.payload[1][1], event.payload[1][2]])
    })
  }, [])

  const pickColor = () => {
    emitTo('main', 'color_picked', rgbToHex(color))
  }

  return (
    <div className="picker-layout">
      <img src={image} className="picker-layout__image" onClick={pickColor} />
    </div>
  )
}
