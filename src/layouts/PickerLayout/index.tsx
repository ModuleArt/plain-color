import { FC, useEffect, useState } from 'react'
import { listen, emitTo } from '@tauri-apps/api/event'
import './index.scss'
import { isDark, rgbToHex } from '@/utils/color'
import { Text } from '@/components/Text'
import cn from 'classnames'
import { Stack } from '@/components/Stack'

export const PickerLayout: FC = () => {
  const [image, setImage] = useState('')
  const [color, setColor] = useState('000000')

  useEffect(() => {
    listen<[string, [number, number, number, number]]>('preview_fetched', (event) => {
      setImage(event.payload[0])

      console.log(event.payload[0]);

      const color = rgbToHex({ red: event.payload[1][0], green: event.payload[1][1], blue: event.payload[1][2] })
      setColor(color)
    })

    document.addEventListener('keypress', (e) => {
      if (e.key === 'Escape') {
        cancel()
      }
    })
  }, [])

  const pickColor = () => {
    emitTo('main', 'color_picked', color)
  }

  const cancel = () => {
    emitTo('main', 'color_canceled')
  }

  return (
    <div className="picker-layout">
      <img src={image} className="picker-layout__image" onClick={pickColor} />
      <Stack className="picker-layout__color" style={{ background: `#${color}` }} justify="center">
        <Text
          text={color}
          tinted
          transform="uppercase"
          className={cn('picker-layout__color-text', { 'picker-layout__color-text--inverted': !isDark(color) })}
        />
      </Stack>
    </div>
  )
}
