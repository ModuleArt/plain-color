import { FC, useEffect, useState } from 'react'
import { listen, emitTo } from '@tauri-apps/api/event'
import './index.scss'
import { rgbToHex } from '@/utils/color'
// import { Window, PhysicalPosition } from '@tauri-apps/api/window'

export const PickerLayout: FC = () => {
  const [image, setImage] = useState('')
  const [color, setColor] = useState<[number, number, number]>([0, 0, 0])
  // const [window, setWindow] = useState<Window | null>(null)

  useEffect(() => {
    listen<[string, [number, number, number, number], [number, number]]>('preview_fetched', (event) => {
      console.log(event)

      setImage(event.payload[0])
      setColor([event.payload[1][0], event.payload[1][1], event.payload[1][2]])
      // window?.setPosition(new PhysicalPosition(event.payload[2][0], event.payload[2][1]))
    })

    // Window.getByLabel('picker').then((pickerWindow) => {
    //   if (pickerWindow) {
    //     setWindow(pickerWindow)
    //   }
    // })
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
